# tech-portfolio

Personal portfolio site for Gopala Krishna Vasanth Kanugo — a software engineer with experience across cloud infrastructure, data engineering, distributed systems, and full-stack development.

🌐 **Live:** https://vasanthkanugo.github.io/tech-portfolio/

---

## What This Is

A fully interactive portfolio built to go beyond a static resume. It showcases work history, projects, education, and publications — and includes an AI chatbot that lets visitors have a real conversation with "Gopala" about his experience, including matching against a job description.

---

## Stack

**Frontend:**
- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) — animations and transitions
- [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) — markdown rendering in chat

**Backend (Chatbot):**
- [Cloudflare Workers](https://workers.cloudflare.com/) — serverless API proxy
- [Google Gemini 2.5 Flash API](https://ai.google.dev/) — LLM powering chat responses

**Deployment:**
- [GitHub Pages](https://pages.github.com/) — static site hosting
- [GitHub Actions](https://github.com/features/actions) — CI/CD (frontend build + Cloudflare Worker deploy)
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) — privacy-friendly page analytics

---

## Features

### Portfolio UI
- **Timeline view** — horizontal drag-to-scroll on desktop, vertical on mobile, with animated cards for each role
- **Card modal** — click any card to see full highlights, tech stack, and description
- **Discipline filter bar** — filter by Frontend, Backend, Fullstack, Infra, Data, Mobile, ML
- **Publications section** — thesis and conference papers
- **Dark mode** — toggle between light and dark
- **Resume download** — one-click PDF download

### "Ask Me" AI Chatbot
A floating chat widget (bottom-right) powered by Google Gemini. The chatbot embodies Gopala and speaks in first person — answering questions as if it were him.

**Conversation features:**
- Grounded entirely in real experience data (`src/data/experience.js`, `src/data/job-scenarios.js`)
- Witty, in-character deflections for off-topic questions
- Scenario suggestion chips in the empty state (populated from `src/data/job-scenarios.js`)
- Conversation history maintained across the session
- Mobile-responsive: bottom sheet on mobile with keyboard-aware height, floating panel on desktop

**JD Match feature (`/match` command):**
- Click "Drop a JD — let's see if I'm your hire" or type `/match ` followed by a job description (or a URL)
- If a URL is provided, the Cloudflare Worker fetches the page and extracts the text automatically
- Gemini scores the fit across 5 weighted dimensions:
  - Technical Skills (35%)
  - Domain Experience (25%)
  - Seniority Level (15%)
  - Soft Skills (15%)
  - Industry Background (10%)
- Returns an impartial markdown table with per-dimension scores, reasoning, and an overall % match
- Closes with a CTA to reach out via LinkedIn or email

---

## Project Structure

```
src/
├── api/
│   └── claude.js           # Sends messages to the Cloudflare Worker, builds system prompt
├── components/
│   ├── ChatWidget.jsx       # Full chat UI — state, /match command, markdown rendering
│   ├── Header.jsx           # Nav with dark mode toggle and resume download
│   ├── Timeline.jsx         # Horizontal/vertical timeline layout
│   ├── Card.jsx             # Individual experience card
│   ├── CardModal.jsx        # Expanded card detail view
│   ├── FilterBar.jsx        # Discipline filter chips
│   ├── ViewToggle.jsx       # Timeline vs. grid view switch
│   └── Publications.jsx     # Publications section
├── data/
│   ├── experience.js        # All experience, projects, education, publications data
│   ├── job-scenarios.js     # Career story scenarios for suggestion chips (add your stories here)
│   └── jd-match-metrics.js  # Scoring dimensions + instructions for JD match analysis
├── constants/
│   └── disciplines.js       # Color mapping for skill/discipline tags
└── assets/

worker/
└── worker.js               # Cloudflare Worker — proxies to Gemini, handles URL fetching, CORS, logging
```

---

## Chatbot Architecture

```
Browser (React) → Cloudflare Worker → Google Gemini 2.5 Flash
```

1. **Frontend** (`src/api/claude.js`) builds a system prompt from all data files and sends `{ messages, systemPrompt }` to the Worker
2. **Cloudflare Worker** (`worker/worker.js`):
   - Receives the request and logs the question
   - If the message contains a URL, fetches the page and strips HTML to plain text
   - Converts message format from Claude-style to Gemini format
   - Calls the Gemini API and returns the response
   - Keeps the `GEMINI_API_KEY` server-side (never exposed to the browser)
3. **Gemini** generates a response grounded in Gopala's experience data

### Adding Job Scenario Stories

Open `src/data/job-scenarios.js` and add entries following the documented schema:

```js
{
  id: 'your-scenario-id',
  title: 'Short title shown on the suggestion chip',
  problem: 'The challenge or context you faced',
  solution: 'What you did to solve it',
  impact: 'Measurable outcome or result',
  tags: ['cloud', 'leadership', 'cost-reduction'],
  relatedExperience: 'experience-id-from-experience.js' // or null
}
```

Once populated, chips appear automatically in the empty chat state.

### Tuning JD Match Scoring

Edit `src/data/jd-match-metrics.js` to adjust dimension weights or descriptions. Weights must sum to `1.0`.

---

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173/tech-portfolio/` — the chatbot won't function locally (the Worker enforces CORS for the production origin only), but all UI is fully interactive.

---

## Deployment

Every push to `main` triggers two parallel GitHub Actions jobs:

| Job | What it does |
|-----|-------------|
| `deploy-worker` | Deploys `worker/worker.js` to Cloudflare Workers via Wrangler |
| `build-and-deploy` | Builds the Vite app and publishes to GitHub Pages |

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `VITE_CF_BEACON_TOKEN` | Cloudflare Web Analytics token |
| `VITE_CLAUDE_WORKER_URL` | Cloudflare Worker URL (e.g. `https://ask-gopala.vasanth-kanugo.workers.dev`) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (found in Workers dashboard sidebar) |
| `GEMINI_API_KEY` | Google Gemini API key — set as a Worker secret, not exposed to the browser |

---

## Viewing Chat Analytics

**Cloudflare Dashboard:**
1. Workers → `ask-gopala` → **Logs** tab
2. Filter for `[CHAT]` entries

**Live tail (terminal):**
```bash
wrangler tail
```

Example log output:
```
[CHAT] User question: "What was your biggest technical challenge?"
[CHAT] Origin: https://vasanthkanugo.github.io
[CHAT] Time: 2026-04-11T20:00:00.000Z
[CHAT] Response sent (412 chars)
```
