# Ask Gopala - Cloudflare Worker

This is the serverless backend for the "Ask Gopala" chatbot on the portfolio site.

## What it does

- Proxies chat requests from the portfolio site to Google Gemini API
- Keeps the API key secure (server-side only)
- Logs all incoming questions to Cloudflare Worker logs
- Handles CORS for the GitHub Pages origin

## Setup

### 1. Create a Cloudflare Worker

```bash
npm create cloudflare@latest ask-gopala -- --type hello-world
cd ask-gopala
```

### 2. Copy the code

Replace the contents of `src/index.js` with `worker.js` from this directory.

### 3. Add environment variable

In `wrangler.toml`, add:

```toml
[env.production]
vars = { GEMINI_API_KEY = "YOUR_API_KEY_HERE" }
```

Or set it as a secret:

```bash
wrangler secret put GEMINI_API_KEY
# Paste your Gemini API key when prompted
```

### 4. Deploy

```bash
wrangler deploy
```

You'll get a Worker URL like `https://ask-gopala.{username}.workers.dev`

### 5. Update the portfolio

In `src/api/claude.js`, update:

```js
const WORKER_URL = 'https://ask-gopala.{username}.workers.dev'
```

Or set it via the GitHub Actions secret `VITE_CLAUDE_WORKER_URL`.

## Logging

All chat messages are logged to Cloudflare. View them:

1. Go to Cloudflare Dashboard
2. Workers → Your Worker → Logs
3. Filter for `[CHAT]` entries

Example log output:

```
[CHAT] User question: "What languages does Gopala know?"
[CHAT] Origin: https://vasanthkanugo.github.io
[CHAT] Time: 2026-04-05T22:00:00.000Z
[CHAT] Response sent (245 chars)
```

## Configuration

- **Model**: `gemini-2.5-flash` (free tier, latest)
- **Max tokens**: 1024
- **CORS origin**: `https://vasanthkanugo.github.io` (GitHub Pages only for security)

To allow localhost for local testing, add it temporarily:

```js
const allowedOrigins = [
  'https://vasanthkanugo.github.io',
  'http://localhost:5173', // Remove before pushing to production!
];
```

## API Key

Get a free Gemini API key:

1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create a new project or use existing
4. Copy the key and set it as a secret in Cloudflare

**Note**: Free tier includes 60 requests/minute, which is plenty for a portfolio chatbot.

## Monitoring

To see real-time logs:

```bash
wrangler tail
```

This streams logs from your Worker to your terminal.
