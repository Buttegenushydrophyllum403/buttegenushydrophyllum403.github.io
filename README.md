# rifat-portfolio

Rifat Sarwar's personal site: Full Stack Developer | AI & Robotics.
Built with Next.js 16, TypeScript, Tailwind CSS v4 and Motion. The AI twin chat runs on Claude.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional locally
npm run dev                  # http://localhost:3000
```

Without an `ANTHROPIC_API_KEY`, set `CHAT_MOCK=1` in `.env.local` to get canned chat replies.
Without a `RESEND_API_KEY`, set `CONTACT_DRY_RUN=1` so the contact form validates without sending.

## Where things live

| To change… | Edit |
| --- | --- |
| Name, intro, email, links, education, headshot | `src/content/profile.ts` |
| The rover → drone career journey | `src/content/journey.ts` |
| Case studies, screenshots, store links | `src/content/projects.ts` |
| Trophies, skills, telemetry numbers | `src/content/achievements.ts` |
| AI twin personality and rules | `src/lib/chat/system-prompt.ts` |
| Colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |

The content files are the single source of truth: pages, the AI twin's knowledge, the sitemap and structured data are all generated from them.
Content is validated when the site builds, so a typo fails the build instead of shipping.

To add photos, screenshots and videos, see [`public/images/README.md`](public/images/README.md).

## Checks

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # unit tests (content, AI twin knowledge, chat validation)
npm run e2e         # Playwright end-to-end tests (first run: npx playwright install chromium)
npm run check       # lint + typecheck + unit tests + build
```

## Deploy to Vercel

1. Create an empty GitHub repository (for example `rifat-portfolio`), then push:
   ```bash
   git remote add origin https://github.com/<you>/rifat-portfolio.git
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com/new), import the repository. The framework is detected automatically.
3. Under **Storage**, add **Upstash Redis** from the Marketplace and connect it to the project. This provides shared rate limiting and the daily chat budget.
4. Under **Settings → Environment Variables**, add the variables from `.env.example` (for Production and Preview):
   `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `CHAT_ENABLED`, `CHAT_DAILY_BUDGET_USD`, `IP_HASH_SALT`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, and `NEXT_PUBLIC_SITE_URL` (your final `https://….vercel.app` address).
5. Redeploy so the variables take effect.
6. In the [Anthropic Console](https://console.anthropic.com), set a monthly spend limit as a hard backstop.
7. Optional: enable **Analytics** and **Speed Insights** in the Vercel dashboard.

### Costs and safety

- **Model:** the chat uses `claude-opus-5` with low effort, prompt caching and short replies. That's roughly 1–2 cents per message.
- **Changing the model:** set `CLAUDE_MODEL`, and update `CHAT_PRICE_*` so the budget math stays right.
- **Limits:** each visitor gets 8 messages a minute and 40 a day. Chat pauses once today's estimated spend reaches `CHAT_DAILY_BUDGET_USD`.
- **Kill switch:** `CHAT_ENABLED=false` turns the chat off instantly.
- **Privacy:** chat messages are not stored. Server logs record token counts only.
- **Contact form:** protected by a honeypot field, a minimum fill time, and a limit of 3 messages per 10 minutes per visitor.
