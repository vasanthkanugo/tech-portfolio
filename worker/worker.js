/**
 * Cloudflare Worker for "Ask Me" chatbot
 *
 * Uses Cloudflare Workers AI (llama-3.3-70b) — no external API key needed
 * Rate limits per IP: 10 requests per hour
 * Handles CORS for GitHub Pages origin
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://vasanthkanugo.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// In-memory rate limit store — resets when the worker instance restarts
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };

  if (now - entry.windowStart > WINDOW_MS) {
    entry.count = 1;
    entry.windowStart = now;
  } else {
    entry.count += 1;
  }

  rateLimitMap.set(ip, entry);
  return entry.count > RATE_LIMIT;
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const ip = request.headers.get('cf-connecting-ip') || 'unknown';

    if (isRateLimited(ip)) {
      console.log(`[CHAT] Rate limited: ${ip}`);
      return new Response(
        JSON.stringify({ content: [{ text: "Easy there! You've sent a lot of messages in the past hour. Give it a bit and come back — I'm not going anywhere. 😄" }] }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    try {
      let { messages, systemPrompt } = await request.json();
      const lastMessage = messages[messages.length - 1];
      const rawContent = lastMessage?.content || '';

      // Log the actual question (not the full /match instructions blob)
      const isMatch = rawContent.startsWith('You are acting as an impartial');
      const jdSnippet = isMatch ? rawContent.match(/Job Description to analyze:\n([\s\S]{0,200})/)?.[1] : null;
      const loggedQuestion = isMatch
        ? `[JD MATCH] ${jdSnippet ? jdSnippet.trim() + '...' : '(no JD text)'}`
        : rawContent.slice(0, 200);
      console.log(`[CHAT] "${loggedQuestion}"`);

      // If last user message contains a URL, fetch and inject the page text
      const urlMatch = lastMessage?.content?.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        try {
          const url = urlMatch[0];
          const pageRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          const html = await pageRes.text();
          const plainText = html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 12000);
          messages = messages.map((msg, i) =>
            i === messages.length - 1
              ? { ...msg, content: msg.content.replace(url, `\n\nFetched page content from ${url}:\n${plainText}`) }
              : msg
          );
          console.log(`[CHAT] Fetched ${plainText.length} chars from ${url}`);
        } catch (fetchErr) {
          console.log(`[CHAT] URL fetch failed: ${fetchErr.message}`);
        }
      }

      // Call Cloudflare Workers AI
      const aiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
      ];

      const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: aiMessages,
        max_tokens: 8192,
      });

      const text = response.response || 'No response';

      return new Response(JSON.stringify({ content: [{ text }] }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    } catch (err) {
      console.error(`[CHAT] Error: ${err.message}`);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  },
};
