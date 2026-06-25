# SettleMap Stripe Products - V12.12.2

Public product name: SettleMap by Tradzlah LLP.

SettleMap remains planning and research support only. It is not a travel agency, immigration adviser, legal adviser, tax adviser, property agent, financial adviser, insurance adviser, medical adviser, school/admission adviser, government website, marketplace or concierge service.

## Products

| Product | Status in code | Price | Checkout route | Success output | Fulfilment email |
|---|---:|---:|---|---|---|
| Student Move Pack | Public active product unless paused by env | S$19 one time | `/student-move-pack` | Student Move Pack | Student Move Pack email |
| Premium Relocation Pack | Wired and ready to activate | S$49 one time | `/premium-relocation-pack` | Premium Relocation Pack | Premium Relocation Pack email |
| SettleMap Voice Guide | Wired and ready to activate | S$19 one time | `/voice-guide` | Voice Guide script and walkthrough | Voice Guide email |

## Stripe Price IDs

| Product | Current code behaviour | Canonical env var | Alias support |
|---|---|---|---|
| Student Move Pack | Uses Stripe inline `price_data` for S$19 in the existing working flow | None today | None today |
| Premium Relocation Pack | Requires a configured Stripe Price ID before checkout can start | `STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID` | `STRIPE_PREMIUM_PACK_PRICE_ID`, `STRIPE_PREMIUM_PRICE_ID` |
| SettleMap Voice Guide | Requires a configured Stripe Price ID before checkout can start | `STRIPE_VOICE_GUIDE_PRICE_ID` | None today |

Premium current Price ID:

`price_1Tm7fSCRU6atVrqjWwxa3j68`

Voice Guide current Price ID:

`price_1Tm8PNCRU6atVrqjYi3A3sAr`

Do not place Stripe secret keys or Gemini keys in browser code. Do not add `NEXT_PUBLIC_STRIPE_SECRET_KEY`, `NEXT_PUBLIC_GEMINI_API_KEY`, or any public secret variable.

## Deliverables

### Student Move Pack

- 90-day route-aware project plan
- First 7 days setup guide
- Concern-based checklist
- Packing and bring-vs-buy checklist
- Parent and student handover checklist
- Provider research scripts
- Research links and official-source reminders
- Support email
- No-advice boundary

### Premium Relocation Pack

- Route aware move summary
- Detailed timeline checklist
- Budget template
- Document tracker
- First week setup plan
- Persona modules: family, couple, solo mover, corporate transfer, returning home, pet owner, student add-on where relevant
- Provider research scripts
- Research links to verify
- Official source reminders
- Support email
- No human review note
- Not professional advice note

### SettleMap Voice Guide

- Route summary
- Move reason
- Top 7 things to focus on
- First 7 days explanation
- Checklist walkthrough
- Documents to prepare
- Provider questions to ask
- Research links to verify
- Common mistakes to avoid
- Boundary note
- Support email

Voice Guide is a written conversational guide and walkthrough. It does not promise generated audio, a live human call, concierge help, human review or provider recommendations.

## Future add-ons

These are config/runbook-ready only. Checkout is not activated in V12.12.2.

| Add-on | Price | Preferred env var |
|---|---:|---|
| Family Add-on | S$15 | `STRIPE_FAMILY_ADDON_PRICE_ID=price_1Tm8R2CRU6atVrqjeN4MZAlt` |
| Pet Add-on | S$15 | `STRIPE_PET_ADDON_PRICE_ID=price_1Tm8RlCRU6atVrqjyU4QZFcA` |
| Corporate Transfer Add-on | S$25 | `STRIPE_CORPORATE_ADDON_PRICE_ID=price_1Tm8SVCRU6atVrqj1kiN4JKQ` |
| Returning Home Add-on | S$15 | `STRIPE_RETURN_HOME_ADDON_PRICE_ID=price_1Tm8TkCRU6atVrqjOTV9keix` |
| Parent Helper Add-on | S$15 | `STRIPE_PARENT_HELPER_ADDON_PRICE_ID=price_1Tm8UmCRU6atVrqjuLw9ZATl` |

Public add-on switch for future bundled checkout:

`NEXT_PUBLIC_ADDONS_ENABLED`

Server-side add-on switches are also documented for future bundled checkout:

- `ADDONS_CHECKOUT_ENABLED`
- `ADDONS_AUTOFULFILL_ENABLED`

In V12.12.2, add-ons are visible as prepared modules only. Standalone or bundled add-on checkout is not exposed until a safe bundled purchase flow exists.
