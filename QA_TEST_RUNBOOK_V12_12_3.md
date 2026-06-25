# SettleMap QA Test Runbook - V12.12.3

This runbook covers automated and semi-automated QA for active paid products and key free flows.

## Automated commands

```bat
npm run test:smoke
npm run test:paid-flows
npm run test:safety
```

Each command prints a report using:

- `PASS`
- `FAIL`
- `BLOCKED`
- `NOT_TESTED`

`FAIL` exits non-zero. `BLOCKED` does not exit non-zero because some Stripe and email fulfilment paths require Stripe test-mode credentials or explicit approval for live payment testing.

## What the automation covers

Smoke tests:

- Live health endpoint reachability
- Student, Premium and Voice Guide active status
- Add-ons safely off
- Security headers
- Public pricing CTAs
- Missing and invalid `session_id` guards

Paid-flow tests:

- Student, Premium and Voice Guide public payment forms are active
- Source-level generated pack coverage for Student, Premium and Voice Guide
- Consent/validation state wiring
- Payment-cancelled page
- Stripe successful payment, declined card, webhook and fulfilment email are marked `BLOCKED` unless Stripe test mode is confirmed

Safety tests:

- AI planning assistant normal prompts
- AI regulated-advice refusal prompts
- No obvious secret values in public HTML
- No file upload widget or file reader in document checklist scope
- Document checklist preview-only copy
- Research-link coverage in paid packs and service registry

## Stripe test mode requirement

Do not use live cards or make live charges without Ash's explicit approval.

To enable checkout-session creation in automation, use Stripe test mode only and set:

```text
SETTLEMAP_QA_STRIPE_TEST_MODE_CONFIRMED=true
SETTLEMAP_QA_ALLOW_CHECKOUT_SESSION=true
```

The current local environment does not contain a Stripe test secret key. Until test-mode credentials are added, successful payment, declined payment, webhook receipt and fulfilment email tests remain blocked.

## Manual test steps if Ash approves live test purchases

Use internal test emails only:

- `hellosettlemap+studenttest@gmail.com`
- `hellosettlemap+premiumtest@gmail.com`
- `hellosettlemap+voiceguidetest@gmail.com`

If plus addressing fails, use `hellosettlemap@gmail.com`.

For each product:

1. Open the product page from `/pricing`.
2. Complete the form using internal test data only.
3. Confirm Stripe checkout opens with the correct amount.
4. If Ash approves a live charge, complete payment with Ash-approved card details only.
5. Confirm `/payment-success?session_id=...` renders the correct product:
   - Student Move Pack
   - Premium Relocation Pack
   - SettleMap Voice Guide
6. Confirm the customer fulfilment email arrives at the internal test inbox.
7. Confirm the admin notification arrives at `hellosettlemap@gmail.com`.
8. Confirm the admin notification includes product type, customer email, payment status, Stripe session reference last six only, fulfilment status and error if any.
9. Confirm admin notification does not include full pack content.

For failure paths:

1. Cancel Stripe checkout and confirm `/payment-cancelled` renders safely.
2. Open `/payment-success` without `session_id`; it must not render a paid pack.
3. Open `/api/stripe/session?session_id=bad_session`; it must return a guarded error.
4. If using Stripe test mode, test a declined card and confirm no fulfilment email is sent.

## Release safety boundary

SettleMap remains planning and research support only. It is not immigration, legal, tax, property, financial, insurance, medical, school admission, travel, vendor or government advice.

Do not add login, database, upload or OCR as part of QA. Do not weaken Stripe session validation. Do not expose secret keys.
