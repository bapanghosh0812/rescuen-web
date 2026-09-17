# RESCUEN — Official Website

A premium, white-themed marketing website for **RESCUEN**, the personal-safety app.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS**, with a secure backend for
phone-OTP login (Firebase), contact emails (Gmail), and an AI safety companion (Gemini).

> This is the **website**, not the app. The mobile app is linked via the “Get the App”
> buttons and the ⋮ menu.

---

## ✨ What’s inside

- **Premium white UI** with 3D motion, glassmorphism, and red + gold accents
- **Header** with logo, nav, and a ⋮ (3-dot) menu that links to the app & legal pages
- **Rich footer** with 20+ real links, socials, contact, and legal
- **Home**: 3D hero · 15 features · how-it-works · app showcase · security · testimonials · FAQ · contact · download CTA
- **Phone → OTP login** (`/login`) — passwordless, Firebase-backed, invisible reCAPTCHA
- **Working contact form** — emails your Gmail inbox **and** auto-replies to the sender
- **AI Safety Companion** — floating chat backed by Gemini
- **Legal pages** — Terms, Privacy, Disclaimer, Refund, Cookies (protective templates)
- **Security**: strict headers, CSP, rate-limiting, input validation, honeypot, server-only secrets

---

## 🚀 Run locally

```bash
npm install
cp .env.local.example .env.local   # PowerShell: Copy-Item .env.local.example .env.local
# → open .env.local and fill in your keys (see the file’s comments)
npm run dev
```

Open http://localhost:3000

### Without keys?
The site runs fine for previewing. Login uses **demo mode** (OTP code `123456`), the contact
form validates but won’t email, and the AI gives offline guidance. Add the keys in `.env.local`
to make everything live.

---

## 🔑 Keys you need (all set in `.env.local`)

| Feature | Variables | Where to get them |
|---|---|---|
| Phone OTP login | `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project settings → Web app config. Enable **Phone** sign-in. |
| Server token verify (optional) | `FIREBASE_ADMIN_*` | Firebase → Service accounts → Generate private key |
| Contact emails | `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CONTACT_TO` | Google Account → Security → App passwords (needs 2-Step Verification) |
| AI companion | `GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| App links / email shown | `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_SUPPORT_EMAIL` | your real links |

Full instructions are in **`.env.local.example`**.

---

## 🧩 Editing content

Brand info, nav, footer links, the 15 features, testimonials, and FAQ all live in one file:
**`lib/site.ts`** — edit there, no component changes needed.

---

## 🏗️ Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # run the production build
npm run typecheck  # TypeScript check
```

---

## 📦 Deploy

Works great on **Vercel** (recommended for Next.js). Add the same environment variables in your
host’s dashboard. Ensure your production domain is added to Firebase **Authorized domains**.

The previous Vite prototype is archived in `legacy-vite/` for reference and is not built.
