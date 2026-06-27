# SettleMap V12.12.16 Private Pilot Runbook

SettleMap is ready for a small private pilot with up to 10 trusted paid testers. This is not a public launch.

## Who can test

- Trusted students, families, or friends who understand this is early access.
- People willing to share honest product feedback after purchase.
- Testers who do not need legal, immigration, tax, financial, property, insurance, medical, school/admission, government, travel agency, concierge, marketplace, or provider recommendation advice.

## What link to send

- Main site: https://settlemap.app
- Pricing page: https://settlemap.app/pricing
- Feedback page: https://settlemap.app/pilot-feedback
- Refund request page: https://settlemap.app/refund-request

Use private messages only. Do not make a public launch announcement yet.

## What product to test first

1. Student Move Pack - best first test because the route and buyer need are easiest to explain.
2. Premium Relocation Pack - use next for family, work, or multi-person relocation planning.

Voice Guide remains blocked. Add-ons remain visible only where safely prepared and must not be sold until checkout support is explicitly enabled.

## What feedback to collect

Ask testers to complete https://settlemap.app/pilot-feedback after purchase.

Collect:

- Did payment work?
- Did the Stripe receipt arrive?
- Did the SettleMap pack email arrive?
- Was the pack worth the price?
- What was most useful?
- What was confusing?
- What was missing?
- Would they recommend this to a student, family, or friend?
- Permission to contact for follow-up.

Do not ask for or accept passport numbers, visa numbers, bank details, medical details, ID documents, or other sensitive documents.

## How to check Stripe payment

1. Open Stripe Dashboard.
2. Search the tester email address.
3. Confirm the payment succeeded.
4. Confirm the product purchased is either Student Move Pack or Premium Relocation Pack.
5. Do not change prices, create Payment Links, install Stripe apps, process refunds, or enable new products during the pilot.

## How to check fulfilment email

1. Ask the tester to check inbox, updates/promotions folders, and spam.
2. Confirm the sender is SettleMap <noreply@settlemap.app>.
3. Confirm the subject is not prefixed with `[QA TEST]` for real customer emails.
4. Confirm the email includes:
   - Why this pack is useful
   - What to do after receiving this pack
   - Budget worksheet
   - Document tracker
   - Provider questions/scripts
   - Safety footer
   - Pilot feedback link

If fulfilment fails, use the existing admin resend process only with the secure local admin token. Do not paste secrets into chat.

## How to handle refund requests manually

1. Ask the customer to submit https://settlemap.app/refund-request.
2. Review the request manually.
3. Check the Stripe payment and fulfilment status.
4. Decide manually according to the refund policy.
5. Do not process refunds through automation in this pilot workflow.

## When to pause payments

Pause payments immediately if:

- Stripe checkout behaves unexpectedly.
- Pack fulfilment emails fail or are delayed repeatedly.
- Customers receive confusing or unsafe content.
- The wrong product is delivered.
- Any regulated advice, provider endorsement, or sensitive-document collection risk appears.
- More than 10 paid testers attempt to buy before the pilot is reviewed.

Do not change `PAYMENTS_GLOBAL_PAUSED` unless Ashish explicitly asks.

## Why this is still not public launch

V12.12.16 is a private pilot polish release. It is designed to validate product value, fulfilment reliability, customer understanding, and refund/support readiness with a small trusted group.

SettleMap still needs pilot feedback, monitored payment/fulfilment behaviour, and final launch messaging before broad public launch.
