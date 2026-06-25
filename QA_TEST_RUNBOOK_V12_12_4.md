# SettleMap QA Test Runbook — V12.12.4

**Version:** V12.12.4  
**Date:** 2026-06-25  
**Products under test:** Student Move Pack (S$19) · Premium Relocation Pack (S$49) · SettleMap Voice Guide (S$19)  
**Test email:** hellosettlemap@gmail.com

---

## 1. Pre-test checklist

Before running any test, verify:

- [ ] Stripe dashboard is in **Test mode** (toggle top-left of Stripe dashboard)
- [ ] Vercel environment has all required env vars set (see `VERCEL_ENVIRONMENT_VARIABLES.md`)
- [ ] Health endpoint returns `"fulfilmentVersion": "V12.12.4"` at `/api/stripe/health`
- [ ] `SETTLEMAP_ADMIN_TOKEN` is configured in Vercel
- [ ] `RESEND_API_KEY` and `SETTLEMAP_FROM_EMAIL` are configured
- [ ] No emergency pause flags are active: `SITE_MAINTENANCE_MODE`, `PAYMENTS_GLOBAL_PAUSED`, `AI_GLOBAL_PAUSED` should all be unset or `"false"`

---

## 2. QA test fulfilment route (admin only, no Stripe)

This route generates and emails test content to `hellosettlemap@gmail.com` without touching Stripe. Use this to verify email delivery and pack content before a live purchase.

### 2a. Test all three products at once

```bash
curl -X POST https://settlemap.app/api/admin/qa-test-fulfilment \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product": "all"}'
```

Expected response:
```json
{
  "sentTo": "hellosettlemap@gmail.com",
  "product": "all",
  "results": [
    {"product": "student_move_pack", "success": true},
    {"product": "premium_relocation_pack", "success": true},
    {"product": "voice_guide", "success": true}
  ],
  "allSuccess": true
}
```

### 2b. Test individual products

Replace `"all"` with `"student_move_pack"`, `"premium_relocation_pack"`, or `"voice_guide"`.

### 2c. Verify in email inbox

Check `hellosettlemap@gmail.com` for three emails with subject prefix `[QA TEST]`. Confirm:
- Subject is correct per product
- Email body is complete (checklist, budget, provider scripts etc.)
- No raw template variables visible (e.g. `{{origin}}`)
- Safety boundary note appears at the end of every email
- All links are placeholder research links (not live bookings)

---

## 3. Stripe test-mode purchase path

Use Stripe test cards. Never use real cards in test mode.

**Stripe test card (success):** `4242 4242 4242 4242` | Any future expiry | Any CVC  
**Stripe test card (decline):** `4000 0000 0000 0002`

### 3a. Student Move Pack (S$19)

1. Go to `/student-move-pack`
2. Fill intake form with test data (any valid values)
3. Use test email `hellosettlemap@gmail.com`
4. Click "Continue to secure payment — S$19"
5. Complete Stripe checkout with test card `4242 4242 4242 4242`
6. Confirm redirect to `/payment-success?session_id=cs_test_...`
7. Confirm success page shows Student pack content (emerald colour scheme)
8. Check `hellosettlemap@gmail.com` for fulfilment email within 60 seconds

### 3b. Premium Relocation Pack (S$49)

Requires: `NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED=true` or `NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED=true` AND `PREMIUM_PACK_CHECKOUT_ENABLED=true` AND `STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID` configured.

1. Go to `/premium-relocation-pack`
2. Fill intake form with test data
3. Use test email `hellosettlemap@gmail.com`
4. Click "Continue to secure payment — S$49"
5. Complete Stripe checkout with test card
6. Confirm success page shows Premium pack (violet colour scheme)
7. Check email within 60 seconds

### 3c. SettleMap Voice Guide (S$19)

Requires: `NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED=true` AND `VOICE_GUIDE_CHECKOUT_ENABLED=true` AND `STRIPE_VOICE_GUIDE_PRICE_ID` configured.

1. Go to `/voice-guide`
2. Fill intake form
3. Complete checkout with test card
4. Confirm success page shows Voice Guide content
5. Check email

---

## 4. Payment failure path test

1. Go to `/student-move-pack`
2. Fill intake form, proceed to Stripe checkout
3. Use decline card `4000 0000 0000 0002`
4. Stripe shows payment declined
5. Click cancel or return to SettleMap
6. Confirm redirect to `/payment-cancelled`
7. Confirm no fulfilment email is sent

---

## 5. Emergency controls test (staging only)

**IMPORTANT: Do not test these on production without a maintenance window.**

### 5a. SITE_MAINTENANCE_MODE

1. Set `SITE_MAINTENANCE_MODE=true` in Vercel (Preview environment only)
2. Redeploy
3. Visit any page — should show "Briefly down for maintenance" with support email
4. Set back to `false` or remove the var

### 5b. PAYMENTS_GLOBAL_PAUSED

1. Set `PAYMENTS_GLOBAL_PAUSED=true`
2. Submit any checkout form — API should return 503 with "Payments are temporarily paused"
3. Remove the var and redeploy

### 5c. AI_GLOBAL_PAUSED

1. Set `AI_GLOBAL_PAUSED=true`
2. Submit a message on `/ai-assistant` — API should return 503
3. Remove the var

---

## 6. Document readiness checklist test

1. Go to `/document-readiness-checklist`
2. Verify 7 categories render: Identity/Travel, Education/Work, Money/Setup, Housing, Healthcare, Family, Pets
3. Tick several items — confirm progress bar updates
4. Use "Tick all" on a category — confirm all tick
5. Use "Reset all" — confirm all clear
6. Confirm no upload UI exists anywhere on the page
7. Confirm disclaimer is visible

---

## 7. Admin notification test (via Stripe dashboard)

After a live or test purchase completes:
1. Check `hellosettlemap@gmail.com` (or `SETTLEMAP_SUPPORT_EMAIL` if set) for admin notification
2. Admin email should be slim: product type, customer email domain only, payment status, last 6 chars of session ID, timestamp
3. Admin email must NOT include the full fulfilment pack content

---

## 8. Health endpoint check

```bash
curl https://settlemap.app/api/stripe/health
```

Verify all critical flags:
- `fulfilmentVersion: "V12.12.4"`
- `stripeConfigured: true`
- `resendConfigured: true`
- `adminTokenConfigured: true`
- `clientSecretExposureBlocked: true`
- `qaTestFulfilmentRouteReady: true`
- `maintenanceModeControlReady: true`
- `paymentsGlobalPauseControlReady: true`
- `aiGlobalPauseControlReady: true`
- `documentReadinessChecklistReady: true`
- `addonsStillSafelyOff: true`
- `noUploadOrOcrAdded: true`
- `noLoginOrDatabaseAdded: true`

---

## 9. Resend fulfilment (manual re-send to customer)

If a customer reports not receiving their email:

```bash
curl -X POST https://settlemap.app/api/stripe/resend-fulfilment \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"checkoutSessionId": "cs_live_..."}'
```

Or use `paymentIntentId` instead of `checkoutSessionId`.

---

## 10. Post-launch sign-off

- [ ] QA test emails received for all 3 products
- [ ] At least one test-mode Student purchase completed end-to-end
- [ ] Payment failure path confirmed (no email sent)
- [ ] Health endpoint clean (no false flags)
- [ ] Emergency flags confirmed off (maintenance, payments pause, AI pause)
- [ ] Document readiness checklist working, no upload
- [ ] No secret keys exposed in NEXT_PUBLIC_ vars
- [ ] Addons safely off

**Sign-off:** __________________  **Date:** __________________

---

## Safety reminders

- SettleMap is a planning and research support tool only
- Never promise visa, admission, housing, banking, insurance, tax, legal, medical or financial outcomes
- Never log full Stripe keys, webhook secrets, Resend API keys, card numbers, or personal ID documents
- All BAT files use `del /f ".git\index.lock" 2>nul` as first step
- Never activate addons in checkout without explicit price ID and flag configuration
