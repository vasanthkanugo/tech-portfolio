/**
 * Cloudflare Worker for "Ask Gopala" chatbot
 *
 * Proxies chat requests to Google Gemini API
 * Logs all incoming questions to Cloudflare Worker logs
 * Handles CORS for GitHub Pages origin
 */

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://vasanthkanugo.github.io',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      const { messages, systemPrompt } = await request.json();
      const userQuestion = messages[messages.length - 1]?.content || 'N/A';

      // Log the incoming question
      console.log(`[CHAT] User question: "${userQuestion}"`);
      console.log(`[CHAT] Origin: ${origin}`);
      console.log(`[CHAT] Time: ${new Date().toISOString()}`);

      // Convert Claude message format to Gemini format
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Add system prompt to first user message
      if (contents.length > 0 && contents[0].role === 'user') {
        contents[0].parts[0].text = `${systemPrompt}\n\nUser question: ${contents[0].parts[0].text}`;
      }

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: { maxOutputTokens: 1024 }
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(`[CHAT] API error: ${data.error?.message}`);
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://vasanthkanugo.github.io'
          }
        });
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      console.log(`[CHAT] Response sent (${text.length} chars)`);

      return new Response(JSON.stringify({ content: [{ text }] }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://vasanthkanugo.github.io',
        },
      });
    } catch (err) {
      console.error(`[CHAT] Error: ${err.message}`);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://vasanthkanugo.github.io'
        }
      });
    }
  },
};
