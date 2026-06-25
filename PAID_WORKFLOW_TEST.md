# SettleMap Paid Workflow Test Checklist

Use this checklist before sharing the paid workflow publicly or after any change to the payment, webhook, or fulfilment email path.

## Pre-test setup
- Confirm all Vercel env vars are set: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SETTLEMAP_FROM_EMAIL`, `SETTLEMAP_ADMIN_TOKEN`
- Confirm health endpoint is green: https://settlemap.app/api/stripe/health
- Confirm Resend domain is verified for the `from` domain (e.g. `settlemap.app`) in the Resend dashboard

## Route-tip test (free — no payment needed)
For each route, fill `/student-move-pack`, select the route, and confirm the correct tip appears on the success page.

| Route | Expected tip keyword |
|---|---|
| India to US | I-20, SEVIS, F-1 |
| India to UK | CAS, BRP/eVisa, NHS |
| India to Australia | CoE, subclass 500, OSHC |
| India to Germany | APS, Sperrkonto, Anmeldung |
| India to Singapore | IPA/student pass, SAL |
| India to Canada | LOA, study permit, GIC |
| Other route | generic wording only |

**Australia must NOT show I-20, SEVIS or F-1.**

## Full paid workflow test (S$19 real payment)

1. Fill `/student-move-pack` with a real test email and choose a route.
2. Complete payment via Stripe.
3. Confirm payment success page shows paid pack.
4. Confirm the route tip on success page matches the selected route.
5. Click **Print / Save as PDF** — confirm browser print dialog opens.
6. Click **Copy pack summary** — confirm clipboard copy and "Copied!" feedback.
7. Confirm Stripe receipt email arrives in the test inbox.
8. Confirm SettleMap fulfilment email arrives within 15 minutes (check spam).
9. Confirm internal notification email arrives at support@settlemap.app.
10. Check Stripe dashboard → Payment Intents → confirm `settlemap_fulfilled_at` metadata is set.
11. Go to `/refund-request`, fill the form, click Submit — confirm email app opens with prefilled body.
12. Issue refund from Stripe dashboard → Payments → Refund.
13. Confirm Stripe refund confirmation email arrives.

## If fulfilment email does not arrive
1. Check Vercel function logs for `[webhook]` entries.
2. Check Resend dashboard → Logs for the send attempt and error.
3. Confirm `SETTLEMAP_FROM_EMAIL` is set to a Resend-verified sender domain.
4. Use the admin resend endpoint if needed:
   ```
   POST /api/stripe/resend-fulfilment
   Authorization: Bearer <SETTLEMAP_ADMIN_TOKEN>
   { "paymentIntentId": "pi_..." }
   ```

## V12.10.2 guard tests

| # | Test | Expected |
|---|---|---|
| 1 | Open `/payment-success` with no `session_id` | No green tick. No "Payment confirmed". Neutral page: "Payment status unavailable". |
| 2 | Open `/payment-success?session_id=cs_test_FAKEID` | No green tick. No "Payment confirmed". Neutral page or invalid-session message. |
| 3 | Open homepage | No copy saying payments are inactive or "No payment processing active today". |
| 4 | On `/student-move-pack`, check both consent boxes, leave email blank, click Submit | Both consent checkboxes remain checked after validation error appears. |
| 5 | On `/student-move-pack`, scroll below the payment CTA | Payment failure help note visible: international payments, OTP/3DS, try another card, contact support. |

## Health check
After deployment, verify: https://settlemap.app/api/stripe/health

Expected response:
```json
{
  "fulfilmentVersion": "V12.10.2",
  "paymentsEnabled": true,
  "checkoutEnabled": true,
  "autofulfillEnabled": true,
  "stripeConfigured": true,
  "resendConfigured": true,
  "adminTokenConfigured": true,
  "studentPackGeneratorReady": true,
  "sessionLookupReady": true,
  "resendEndpointReady": true,
  "paidPackGeneratorReady": true,
  "routeTipsReady": true,
  "refundRequestReady": true
}
```
