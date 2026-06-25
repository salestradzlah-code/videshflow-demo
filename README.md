# SettleMap — Map your move. Settle with confidence.

A professional Next.js + Tailwind CSS early access site for SettleMap, a practical relocation starter kit for people and families moving across countries.

SettleMap is operated by TRADZLAH LLP, Singapore UEN T20LL0224L. It is not a travel agency, immigration adviser, property agent, financial adviser, insurance adviser, medical adviser, school or admission adviser, or government website.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## Gemini chat pilot setup

Create `.env.local` from `.env.example` and add a Gemini API key:

```bash
GEMINI_API_KEY=your_server_side_key
```

For Vercel, add `GEMINI_API_KEY` in the project environment variables and redeploy. Never prefix the variable with `NEXT_PUBLIC_`; the browser calls SettleMap's `/api/chat` route and the server calls Gemini 2.5 Flash-Lite.

The pilot is limited to checklist-style planning support. It uses an HTTP-only session cookie for a simple in-memory request limit. It does not add login, a database, document upload, OCR, or provider contact automation. Paid products are handled separately through server-side Stripe checkout routes and environment-controlled activation switches.

## Deploy

Push to GitHub and import the repository into Vercel. Use the default Next.js settings.

## Start path selector

The launch version includes `/start`, a first-click relocation path selector. It asks users:

- Where are you moving?
- Why are you moving?
- Who is moving?

This keeps the website from feeling like a generic relocation ocean. The selector is static and client-side only. It does not use login, a database, or saved personal data. Paid product checkout is separate and controlled by Stripe/Vercel environment variables.

## AI assistant roadmap

Current pilot: Gemini 2.5 Flash-Lite through a server-side Next.js route, with route context, prompt chips, request throttling, and strict safety boundaries.

Future phase: Use retrieval only from an approved SettleMap knowledge base and keep the current professional-advice guardrails.

### AI assistant guardrails

- Never provide legal, immigration, tax, medical, financial, insurance, school admission, housing, or vendor advice.
- Always recommend checking official sources for current rules.
- Never guarantee visas, jobs, housing, school admission, bank accounts, insurance, vendor quality, or official outcomes.
- For complex topics, route users to official sources or the relocation help request flow.
- Support multilingual questions where possible, but keep launch website content in simple English for browser translation.
- Keep answers practical, checklist-based, and source-aware.

## Form URL constants

Update these in `src/lib/constants.ts` when real Tally, Typeform, or CRM links are ready:

- `STORY_FORM_URL`
- `HELP_FORM_URL`
- `PARTNER_FORM_URL`

While they are placeholders, they point to safe internal fallback sections so users do not hit broken external links.

## Launch readiness checklist

1. Buy the domain.
2. Push the code to GitHub.
3. Import the GitHub repo into Vercel.
4. Deploy the production site.
5. Add the custom domain in Vercel project settings.
6. Configure DNS records exactly as Vercel shows.
7. Add real Tally links for `STORY_FORM_URL`, `HELP_FORM_URL`, and `PARTNER_FORM_URL` in `src/lib/constants.ts`.
8. Add final logo assets if needed. Current launch version uses a coded wordmark and globe route mark.
9. Add the final privacy contact email in `src/lib/constants.ts`.
10. Check mobile pages for homepage, AI Assistant, Get Help, Services, Reference Links, Singapore guide, Before You Fly, and Home Setup.
11. Run `npm.cmd run build` before deployment.
12. Share a private beta with family and trusted contacts.

## AI planner roadmap

Current pilot:
- Gemini-powered checklist chat through `/api/chat`
- Route, move-reason, household-profile, and selected add-on context
- Prompt chips and session request limits
- Server-enforced professional-advice guardrails
- No login, database, document upload, OCR, or provider automation. Paid checkout is server-side through Stripe and controlled by environment variables.

## Paid product activation

V12.12.2 supports environment-controlled paid products:

- Student Move Pack — S$19, existing active paid flow unless paused by Student env flags
- Premium Relocation Pack — S$49, ready to activate with Premium Stripe Price ID and flags
- SettleMap Voice Guide — S$19, ready to activate after `STRIPE_VOICE_GUIDE_PRICE_ID` and Voice Guide flags are set

See:

- `STRIPE_PRODUCTS.md`
- `VERCEL_ENVIRONMENT_VARIABLES.md`
- `PAYMENT_ACTIVATION_RUNBOOK.md`

Future work:
- Add retrieval only from approved SettleMap content and official-source links
- Keep responses checklist-based and multilingual-friendly
- Add user-controlled reminders only after privacy and data storage are designed properly

## AI safety guardrails

The AI assistant must never provide legal, immigration, tax, financial, medical, insurance, school admission, housing, or vendor advice. It must not guarantee visas, jobs, tax savings, housing, school admission, banking approval, insurance outcomes, vendor quality, or official approvals. For rules and complex topics, it should route users to official sources or qualified professionals.

## Internal migration note

The public product name is SettleMap. This project was originally scaffolded under the working names "VideshFlow" and "SettlePath". Old names may exist only in internal paths, the repository name, or legacy scripts; they must not appear on public pages.
