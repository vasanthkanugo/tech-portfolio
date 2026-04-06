# tech-portfolio

Personal portfolio site for Gopala Krishna Vasanth Kanugo.

🌐 **Live:** https://vasanthkanugo.github.io/tech-portfolio/

## Stack

**Frontend:**
- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

**Backend (Chatbot):**
- [Cloudflare Workers](https://workers.cloudflare.com/) — serverless API proxy
- [Google Gemini API](https://ai.google.dev/) — LLM for chat responses

**Deployment:**
- [GitHub Pages](https://pages.github.com/) — static site hosting
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipeline

## Features

- Horizontal drag-to-scroll timeline (desktop) / vertical timeline (mobile)
- Discipline filter bar — Frontend, Backend, Fullstack, Infra, Data, Mobile, ML
- Card modal with highlights and tech stack
- Dark mode with toggle
- Resume download
- **Ask Gopala** — AI chatbot powered by Google Gemini API
  - Floating chat widget (bottom-right corner)
  - Grounded in experience data (answers only about Gopala)
  - Witty deflections for off-topic questions
  - Mobile-responsive (bottom sheet on mobile, floating panel on desktop)
  - Server-side API key (secure via Cloudflare Worker)

## Chatbot Architecture

The "Ask Gopala" chatbot uses a three-layer architecture:

```
Browser (React) → Cloudflare Worker → Google Gemini API
```

- **Frontend** (`src/components/ChatWidget.jsx`, `src/api/claude.js`)
  - Floating chat widget with message history
  - Proxies requests to Cloudflare Worker

- **Backend** (`worker/worker.js` — Cloudflare Worker)
  - Server-side proxy (keeps API key secure)
  - Logs all questions to Cloudflare dashboard
  - Forwards requests to Gemini API

- **AI Model** (Google Gemini 2.5 Flash — free tier)
  - System prompt grounds responses in `src/data/experience.js`
  - Max 1024 tokens per response
  - 60 requests/minute (free tier limit)

## Viewing Chat Analytics

See what questions people are asking:

**Cloudflare Dashboard:**
1. Workers → `ask-gopala` → Logs tab
2. Filter for `[CHAT]` entries

**Live tail (terminal):**
```bash
wrangler tail
```

Example logs:
```
[CHAT] User question: "What languages does Gopala know?"
[CHAT] Origin: https://vasanthkanugo.github.io
[CHAT] Time: 2026-04-05T22:00:00.000Z
[CHAT] Response sent (245 chars)
```

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` — the chatbot won't work locally (CORS restricted to production origin), but you can test the UI.

## Deployment

Auto-deploys to GitHub Pages on every push to `main` via GitHub Actions.

**Required secrets** (GitHub Settings → Secrets and variables → Actions):
- `VITE_CF_BEACON_TOKEN` — Cloudflare Web Analytics token
- `VITE_CLAUDE_WORKER_URL` — Cloudflare Worker URL (e.g., `https://ask-gopala.vasanth-kanugo.workers.dev`)

See `worker/README.md` for Cloudflare Worker setup.
