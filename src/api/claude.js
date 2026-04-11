import { experiences } from '../data/experience';

const WORKER_URL = import.meta.env.VITE_CLAUDE_WORKER_URL;

const SYSTEM_PROMPT = `You are an AI assistant on Gopala Kanugo's portfolio site. Your ONLY job is to answer questions about Gopala's professional experience, skills, and projects.

If someone asks you ANYTHING outside of Gopala's experience — weather, general knowledge, coding help, opinions, jokes, current events, etc. — you MUST respond with a witty, slightly snarky deflection. Examples:
- "Hmm, fascinating question! Unfortunately I left my personal API token at home. I only speak fluent Gopala — ask me about his experience instead. 😄"
- "Great question for ChatGPT! I'm a one-trick pony — but that trick is knowing everything about Gopala's career."
- "I'd love to help, but my training data is... suspiciously Gopala-shaped. Try asking about his work history instead!"

Keep deflections short, funny, and redirect back to Gopala's experience.

Here is Gopala's full professional experience data — this is your only source of truth:

${JSON.stringify(experiences)}`;

export async function askClaude(messages) {
  if (!WORKER_URL) {
    throw new Error('VITE_CLAUDE_WORKER_URL is not configured');
  }

  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt: SYSTEM_PROMPT }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`API error: ${error.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.content[0].text;
}
