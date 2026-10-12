# Rifat Sarwar · portfolio

My personal site: backend engineer who also does machine learning.
Built with Next.js 16, TypeScript, Tailwind CSS v4 and Motion. Light mode is graph paper, dark mode is a blueprint, and there's an AI twin you can interview (Google Gemini).

## Run locally

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY; everything else is optional
npm run dev                  # http://localhost:3000
```

No Gemini key? Set `CHAT_MOCK=1` in `.env.local` for canned chat replies.

## Editing the words

All the text on the site lives in [`content/`](content/) as JSON: profile, home page, projects, research, changelog, awards, skills, chat, and so on. Change a file and the site changes; there's no need to touch `src/`.
[`content/README.md`](content/README.md) explains which file holds what and the small formatting markers (`==highlight==`, `[link](/path)`, …).

Content is validated when the site builds, so a typo fails the build with the file and field named instead of shipping a broken page. The AI twin's knowledge is generated from the same files.

Photos, screenshots and videos live in `public/`; see [`public/images/README.md`](public/images/README.md). Papers are in `public/papers/`.

## Checks

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # unit tests: content, chat, contact form, renderers
npm run e2e         # Playwright end-to-end tests (PW_CHANNEL=chrome uses your installed Chrome)
npm run check       # lint + typecheck + unit tests + build
```

## Deploy to Vercel

1. Import this repository on [vercel.com/new](https://vercel.com/new). The framework is detected automatically.
2. Under **Settings → Environment Variables**, add `GEMINI_API_KEY` (free from [Google AI Studio](https://aistudio.google.com/apikey)) and `NEXT_PUBLIC_SITE_URL` (your final address). The rest of `.env.example` is optional.
3. Optional: add **Upstash Redis** from the Marketplace so per-visitor chat limits are shared across serverless instances, and set `IP_HASH_SALT` to any long random string.
4. Redeploy so the variables take effect. After that, every push to `main` deploys.

### How the AI twin behaves

- **Models:** tried in order from `GEMINI_MODELS` (default: 3.5 Flash-Lite, then 3.8 Flash, then 3.1 Flash-Lite). When one runs out of free quota or keeps failing, the next takes over. A reply that breaks mid-stream is retried from scratch.
- **Limits:** each visitor gets 8 messages a minute and 40 a day on the live site (`CHAT_LIMIT_PER_MINUTE`, `CHAT_LIMIT_PER_DAY`). Local development isn't limited.
- **Kill switch:** `CHAT_ENABLED=false` turns the chat off instantly.
- **Privacy:** this site doesn't store chat messages; server logs record token counts only. On Gemini's free tier Google may use prompts to improve its products, and the site tells visitors so.
- **Contact form:** no backend. It validates the message, then opens the visitor's own email app with it already written.
