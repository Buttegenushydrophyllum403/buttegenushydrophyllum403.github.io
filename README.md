# Rifat Sarwar · portfolio

My personal site: backend engineer who gets his hands dirty with ML and embedding systems.
Built with Next.js 16, TypeScript, Tailwind CSS v4 and Motion. Light mode is graph paper, dark mode is a blueprint, and there's an AI twin you can interview (Google Gemini).

## Run locally

```bash
npm install
cp .env.example .env.local        # where the chat sends messages
cp .dev.vars.example .dev.vars    # add your GEMINI_API_KEY (free: https://aistudio.google.com/apikey)
npm run twin:dev                  # the AI twin's worker, http://localhost:8787 (one terminal)
npm run dev                       # the site, http://localhost:3000 (another terminal)
```

Only working on the site? Skip `twin:dev` and point `NEXT_PUBLIC_CHAT_URL` in `.env.local` at the deployed worker instead.

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

## How it's hosted

The site is a static export (`npm run build` writes `out/`) hosted on **GitHub Pages** at https://rifatsarwarcodes.github.io. Every push to `main` builds and deploys it ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

The one part that needs a server, the AI twin, runs as a **Cloudflare Worker** ([`worker/`](worker/)). It holds the Gemini key, only accepts requests from the site (and localhost), and reuses the same chat code and content as the site.

`npm run preview` serves `out/` locally the way GitHub Pages does.

### One-time setup

1. **GitHub Pages:** repository **Settings → Pages → Source: GitHub Actions**.
2. **Cloudflare Worker:**
   ```bash
   npx wrangler login                      # free Cloudflare account
   npx wrangler secret put GEMINI_API_KEY  # paste the key
   npm run twin:deploy                     # prints the worker's URL
   ```
3. **Connect them:** in **Settings → Secrets and variables → Actions → Variables**, add `CHAT_URL` = the worker URL + `/chat`, e.g. `https://rifat-ai-twin.<you>.workers.dev/chat`. Re-run the deploy workflow.

The twin's knowledge comes from `content/`, so the worker should be redeployed whenever content changes. Either run `npm run twin:deploy` after pushing, or make it automatic: add repository secrets `CLOUDFLARE_API_TOKEN` (Cloudflare dashboard → My Profile → API Tokens → "Edit Cloudflare Workers" template) and `CLOUDFLARE_ACCOUNT_ID`, and the deploy workflow redeploys the worker on every push.

### How the AI twin behaves

- **Models:** tried in order from `GEMINI_MODELS` in [`wrangler.jsonc`](wrangler.jsonc) (default: 3.5 Flash-Lite, then 3.8 Flash, then 3.1 Flash-Lite). When one runs out of free quota or keeps failing, the next takes over. A reply that breaks mid-stream is retried from scratch.
- **Limits:** each visitor gets 8 messages a minute and 40 a day (`CHAT_LIMIT_PER_MINUTE`, `CHAT_LIMIT_PER_DAY`; `CHAT_LIMITS=off` disables them locally). Optionally add Upstash Redis (`UPSTASH_REDIS_REST_URL`/`_TOKEN` secrets) to share the limits across Cloudflare locations.
- **Kill switch:** set the worker var `CHAT_ENABLED=false`.
- **Privacy:** the worker doesn't store chat messages; logs record token counts only. On Gemini's free tier Google may use prompts to improve its products, and the site tells visitors so.
- **Contact form:** no backend. It validates the message, then opens the visitor's own email app with it already written.
