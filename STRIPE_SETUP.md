# SettleMap V12.8 — Stripe Webhook Setup

Internal reference for Ash. Do not commit with real secret values.

---

## Environment variables

Set these in Vercel project settings (Settings → Environment Variables). Never put in `.env` or git.

| Variable | Where to find | Safe to commit? |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API keys → Secret key | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → signing secret | No |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | No |
| `SETTLEMAP_FROM_EMAIL` | Set to `SettleMap <support@settlemap.app>` | Yes (no secret) |
| `SETTLEMAP_SUPPORT_EMAIL` | Set to `support@settlemap.app` | Yes (no secret) |
| `NEXT_PUBLIC_STRIPE_STUDENT_MOVE_PACK_PAYMENT_LINK` | The Stripe Payment Link URL | Yes |

---

## Stripe webhook setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://settlemap.app/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (`whsec_...`) → save as `STRIPE_WEBHOOK_SECRET` in Vercel

### Health check

After deploy, verify the endpoint is live:

```
curl https://settlemap.app/api/stripe/webhook
# Expected: SettleMap Stripe webhook endpoint is available.
```

---

## Stripe Payment Link — custom fields

The Payment Link `https://buy.stripe.com/bJe7sKcJs90l7csgrK1gs00` should have these custom fields configured in Stripe Dashboard:

| Key | Label | Type | Required |
|---|---|---|---|
| `student_name` | Student or parent name | Text | Yes |
| `move_route` | Move route (e.g. India to UK) | Text | Yes |
| `departure_month` | Expected departure month | Text | Yes |

The webhook parses these by matching keywords in the field key:
- `name`/`student`/`parent` → customer name
- `route`/`move`/`destination` → move route
- `departure`/`month`/`when` → departure month

If custom fields are missing, the customer email still sends but asks the customer to reply with their route details.

---

## Resend domain setup

1. In Resend Dashboard → Domains, verify `settlemap.app`
2. Add DNS records as instructed by Resend (SPF, DKIM, DMARC)
3. Set `SETTLEMAP_FROM_EMAIL` to `SettleMap <support@settlemap.app>` once verified
4. Create an API key (not the root key) with Send permission only → save as `RESEND_API_KEY`

---

## Fulfilment logic summary

1. Stripe calls `POST /api/stripe/webhook` on `checkout.session.completed`
2. Webhook verifies signature with `STRIPE_WEBHOOK_SECRET`
3. Validates: `payment_status === "paid"`, `amount_total === 1900`, `currency === "sgd"`
4. Retrieves PaymentIntent — checks `settlemap_fulfilled_at` metadata for idempotency
5. Sends customer fulfilment email via Resend
6. Updates PaymentIntent metadata with `settlemap_fulfilled_at` timestamp
7. Sends internal notification to `SETTLEMAP_SUPPORT_EMAIL`
8. Returns `{ received: true }` with status 200

If the customer email send fails (Resend error), returns HTTP 500 so Stripe retries.

---

## Safe logging rules (already implemented in webhook)

| Safe to log | Never log |
|---|---|
| event.id, event.type | Stripe secret key |
| session.id, payment_intent.id | Webhook secret |
| Email domain only (e.g. `gmail.com`) | Resend API key |
| Fulfilment status (true/false) | Full email address in logs |
| Error type/name only | Full card details |
| Amount and currency | Authorization headers |
| | Passport/ID numbers |

---

## Testing

Use Stripe CLI for local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI prints a webhook signing secret (`whsec_...`) — use it as `STRIPE_WEBHOOK_SECRET` in `.env.local` for local testing only.

Trigger a test event:
```bash
stripe trigger checkout.session.completed
```

---

*Last updated: V12.8 — June 2026*
