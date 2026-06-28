# SettleMap V12.13 Paid Pack Workspace Upgrade

Commit message: `V12.13 add paid pack workspace assets`

## What changed

- Student Move Pack and Premium Relocation Pack now include a `Workspace assets` section.
- Paid emails include copy-paste CSV blocks for:
  - Budget starter worksheet
  - Document tracker
  - Provider comparison worksheet
  - Risk register
  - Next 7 actions tracker
- Paid emails include a progress tracker table.
- Route-specific official-source research prompts were upgraded into category prompts for immigration, institution, housing, banking, healthcare/insurance, telecom, and emergency/consulate research.
- Private-pilot update CTAs were added for best-effort next-7-actions and updated-pack support when status changes.
- Student pack parent/student handover now splits parent ownership, student ownership, official verification, normal worries, escalation triggers, and weekly check-in prompts.
- Premium pack now includes 30/60/90-day transition milestones, banking/tax planning boundary language, family/dependent split when relevant, corporate transfer checklist when relevant, and housing/settling-in provider comparison.

## Why this beats prompt-only output

V12.13 is not just a one-off generated answer. It gives the buyer a relocation workspace they can copy into Google Sheets or Excel, use with family or HR, and keep updating through the first stage of the move. The pack now combines planning guidance, action tracking, official-source prompts, provider questions, risk tracking, and private-pilot support paths in one place.

## Safety boundaries

SettleMap remains a planning and research tool only. It is not an immigration adviser, legal adviser, tax adviser, financial adviser, property agent, insurance adviser, medical adviser, school/admission adviser, travel agency, concierge service, government website, or provider marketplace.

Every paid pack keeps boundaries for:

- Planning support only
- Verify official sources
- No sensitive document upload
- No guarantees
- No provider endorsement
- Seek qualified professional advice where needed

## QA checklist

- Run TypeScript check.
- Run production build.
- Confirm Student email includes workspace assets, CSV worksheet blocks, progress tracker, official-source prompts, private-pilot CTAs, parent/student handover, and boundary footer.
- Confirm Premium email includes all workspace assets plus 30/60/90 milestones, banking/tax qualified-adviser boundary, family/dependent split when relevant, employer/corporate checklist when relevant, and boundary footer.
- Search for old VideshFlow public branding.
- Confirm health endpoint reports V12.13 and the new readiness flags.
- Confirm payment state, Voice Guide state, and add-ons state were not changed.
- Confirm no secrets or env files are staged or committed.

## Private pilot scope

V12.13 is suitable for limited trusted paid testers. Private-pilot support is best effort and not an automated reminder service, not unlimited service, and not guaranteed human review.

## Public launch status

Public launch remains no-go unless Ashish explicitly approves. Use private sharing only while payment, fulfilment, support, and refund handling continue to be monitored.

## Constraints honored

- No Stripe price changes.
- No Stripe product changes.
- No Stripe payment links created.
- No DNS changes.
- No Resend domain changes.
- No environment variable or secret changes.
- No `PAYMENTS_GLOBAL_PAUSED` change.
- Voice Guide checkout remains blocked.
- Add-ons checkout remains blocked.
- Refund logic unchanged.
- No login, database, upload, OCR, document collection, automated reminders, provider marketplace, or concierge promise added.
