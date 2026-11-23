# RESCUEN website

The official website of RESCUEN, a personal safety app for Android.

Next.js (App Router), TypeScript and Tailwind CSS, hosted on Netlify.

## Run it

```bash
npm install
cp .env.local.example .env.local   # then fill in your values
npm run dev
```

## Check it

```bash
npm run typecheck      # types
npm run build          # production build
npm run test:security  # 14 attacks against the production build
```

The security tests use fake payment, mail and AI services, so nothing real is charged or sent.

## Where things live

| What | Where |
| --- | --- |
| Brand facts, features, FAQ, footer | `lib/site.ts` |
| Safety guides and helplines | `lib/guides.ts` |
| What RESCUEN AI knows | `lib/ai/knowledge.ts` |
| Reviewed safety plans | `lib/ai/plans.ts` |
| Languages (English is the default) | `lib/i18n/languages.ts` |
| Translations, keyed by the English text | `lib/i18n/*.json` |
| Checks every API request passes | `lib/http.ts` |
| Page titles, previews, structured data | `lib/seo.ts` |
| Link preview and icons | `node scripts/make-images.mjs <fonts folder>` |

## Settings

All settings are listed in `.env.local.example`. Add the same ones in Netlify under
**Project configuration > Environment variables**. Secrets are never committed.

The assistant works without an AI key by answering from `lib/ai/knowledge.ts`. With a key it
answers freely and falls back to the same knowledge if the service is busy or out of credit.
