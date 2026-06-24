# SettleMap Stripe + Resend Setup — V12.9

## Required Vercel Environment Variables

| Variable | Notes |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key — server-side only, never NEXT_PUBLIC |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) from Stripe event destination |
| `RESEND_API_KEY` | Resend API key — server-side only |
| `SETTLEMAP_FROM_EMAIL` | e.g. `SettleMap <support@settlemap.app>` |
| `SETTLEMAP_SUPPORT_EMAIL` | e.g. `support@settlemap.app` |
| `NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED` | `true` to show payment CTA; `false` to hide and show paused message |
| `STUDENT_PACK_CHECKOUT_ENABLED` | `true` to allow checkout session creation; `false` returns 503 |
| `STUDENT_PACK_AUTOFULFILL_ENABLED` | `true` to send customer email automatically; `false` sends internal alert only (manual required) |
| `NEXT_PUBLIC_STRIPE_STUDENT_MOVE_PACK_PAYMENT_LINK` | Legacy Stripe Payment Link — kept for fallback reference only |

## Stripe Webhook Endpoint

- URL: `https://settlemap.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`
- Location in Stripe: Workbench → Event destinations → `settlemap-student-move-pack`
- Copy the `whsec_…` signing secret and add to Vercel as `STRIPE_WEBHOOK_SECRET`

## Fulfilment Logic Summary (V12.9)

1. User opens `/student-move-pack` and fills in intake form (email, name, role, route, departure, concerns, consent)
2. Form POSTs to `/api/stripe/create-checkout-session` — creates Stripe Checkout Session with all metadata in `payment_intent_data.metadata`
3. User pays S$19 on Stripe-hosted checkout
4. Stripe fires `checkout.session.completed` webhook to `/api/stripe/webhook`
5. Webhook verifies signature, validates payment (paid, 1900 SGD, student_move_pack product)
6. Retrieves PaymentIntent — checks `settlemap_fulfilled_at` for idempotency (prevents duplicate emails on retry)
7. If `STUDENT_PACK_AUTOFULFILL_ENABLED=true`: sends customer fulfilment email via Resend
8. Updates PaymentIntent metadata: `settlemap_fulfilled_at`, `settlemap_fulfilment_version=V12.9`
9. Sends internal notification to `SETTLEMAP_SUPPORT_EMAIL`
10. If `STUDENT_PACK_AUTOFULFILL_ENABLED=false`: sends internal alert for manual fulfilment only

## Feature Flags

| Flag | Value | Effect |
|---|---|---|
| `NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED` | `true` | Shows payment CTA on /pricing and /student-move-pack |
| `NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED` | `false` | Hides CTA, shows "payments paused" message |
| `STUDENT_PACK_CHECKOUT_ENABLED` | `true` | Allows checkout session creation |
| `STUDENT_PACK_CHECKOUT_ENABLED` | `false` | Returns 503 with friendly error |
| `STUDENT_PACK_AUTOFULFILL_ENABLED` | `true` | Sends customer email automatically |
| `STUDENT_PACK_AUTOFULFILL_ENABLED` | `false` | Skips customer email, sends internal manual-action alert |

## Safe Logging Rules

| Safe to log | Never log |
|---|---|
| event.id, event.type | Stripe secret key |
| session.id | Webhook secret |
| paymentIntentId | Resend API key |
| email domain only (after `@`) | Full customer email |
| fulfilment status, error type | Full card details |
| move route, departure month | Personal ID numbers |

## Health Check

```
GET https://settlemap.app/api/stripe/health
```

Returns JSON — no secrets exposed:
```json
{
  "stripeWebhookEndpoint": "available",
  "paymentsEnabled": true,
  "checkoutEnabled": true,
  "autofulfillEnabled": true,
  "stripeConfigured": true,
  "resendConfigured": true,
  "fulfilmentVersion": "V12.9"
}
```

## Resend Domain Verification

- Go to resend.com → Domains → Add `settlemap.app`
- Add the DNS records (SPF, DKIM, DMARC) shown to your DNS provider
- Until verified, emails send but may have deliverability issues

## Test Workflow

1. Open `https://settlemap.app/student-move-pack`
2. Enter buyer email, name, role, move route, departure month, concerns
3. Tick both consent checkboxes
4. Click "Continue to secure payment" — redirects to Stripe Checkout
5. Pay S$19 (use Stripe test card `4242 4242 4242 4242` in test mode)
6. Confirm Stripe receipt arrives at buyer email
7. Confirm SettleMap Student Move Pack email arrives (within 15 min)
8. Confirm internal support notification arrives at support@settlemap.app
9. Check Stripe PaymentIntent metadata shows `settlemap_fulfilled_at` timestamp
10. In Stripe: resend the webhook event — confirm no duplicate customer email sent (idempotency)
11. Test refund from Stripe dashboard — no automated action required (manual support)

## Stripe CLI Testing (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```
