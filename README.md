# SettleMap — Map your move. Settle with confidence.

A professional Next.js + Tailwind CSS demo for SettleMap, a practical relocation starter kit website for people and families moving across countries.

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

## Deploy

Push to GitHub and import the repository into Vercel. Use the default Next.js settings.

## Start path selector

The launch version includes `/start`, a first-click relocation path selector. It asks users:

- Where are you moving?
- Why are you moving?
- Who is moving?

This keeps the website from feeling like a generic relocation ocean. The selector is static and client-side only. It does not use login, a database, payment, or saved personal data.

## AI assistant roadmap

Phase 1: Static AI Assistant page with prompt chips, language support note, service request flow, and safety boundaries.

Phase 2: Embed a no-code AI chatbot such as Chatbase, Crisp, Botpress, Voiceflow, or similar. Train it only on approved SettleMap pages, FAQs, and official-source links.

Phase 3: Build a custom Next.js chatbot using Vercel AI SDK or a similar stack. Use retrieval only from an approved SettleMap knowledge base and keep strict safety guardrails.

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

Phase 1, current launch version:
- Static AI Assistant page
- Prompt chips
- Safety boundaries
- AI planner roadmap cards
- No login, no database, no payment, no automated tracking

Phase 2, no-code AI assistant:
- Embed a no-code AI chatbot such as Chatbase, Crisp, Botpress, Voiceflow, or similar
- Train only on SettleMap website content, FAQs, approved checklists, and official source links
- Keep responses checklist based and multilingual friendly

Phase 3, custom AI assistant:
- Build a custom Next.js chatbot using Vercel AI SDK or similar
- Use retrieval from an approved SettleMap knowledge base
- Add strict guardrails for legal, immigration, tax, medical, financial, insurance, school admission, housing, and vendor topics
- Add future user-controlled reminders only after privacy and data storage are designed properly

## AI safety guardrails

The AI assistant must never provide legal, immigration, tax, financial, medical, insurance, school admission, housing, or vendor advice. It must not guarantee visas, jobs, tax savings, housing, school admission, banking approval, insurance outcomes, vendor quality, or official approvals. For rules and complex topics, it should route users to official sources or qualified professionals.

## Internal migration note

This project was originally scaffolded under the working name "VideshFlow" and briefly "SettlePath" before the public brand was finalized as SettleMap. Some internal-only filenames (e.g. legacy release scripts) and the GitHub repo / local folder path may still reference the old working name — these are not public-facing and are scheduled for cleanup in a later release. The public product name and all user-facing copy is SettleMap.
