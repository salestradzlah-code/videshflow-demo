# SettleMap Payment Activation Runbook — V12.12

This runbook lets Ash activate or pause Student, Premium and Voice Guide without code changes.

Do not enable billing changes, archive Stripe products, rename the repository, rename the Vercel project, change DNS, or expose secrets as public env variables.

## General deployment steps

1. Update the relevant Vercel environment variables.
2. Redeploy Production after any env variable change.
3. Run `health-check-v12-12.bat`.
4. Test checkout using the product page.
5. Confirm `/payment-success?session_id=...` renders the correct product.
6. Confirm fulfilment email goes to the checkout email if autofulfilment is enabled.
7. If anything looks wrong, set the public and server checkout flags back to `false` and redeploy.

## Activate Student Move Pack

Set:

```text
NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED=true
STUDENT_PACK_CHECKOUT_ENABLED=true
STUDENT_PACK_AUTOFULFILL_ENABLED=true
```

Redeploy Production.

Test:

1. Open `/student-move-pack`.
2. Complete the intake form.
3. Confirm Stripe checkout opens for S$19.
4. Complete a test payment.
5. Confirm payment success shows Student Move Pack, not Premium or Voice Guide.
6. Confirm the Student fulfilment email is sent.

## Deactivate Student Move Pack

Set either:

```text
NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED=false
```

or:

```text
STUDENT_PACK_CHECKOUT_ENABLED=false
```

Redeploy Production. The public page will show a paused state and the API will block checkout safely.

## Activate Premium Relocation Pack

Premium current Stripe Price ID:

```text
price_1Tm7fSCRU6atVrqjWwxa3j68
```

Set:

```text
STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID=price_1Tm7fSCRU6atVrqjWwxa3j68
STRIPE_PREMIUM_PACK_PRICE_ID=price_1Tm7fSCRU6atVrqjWwxa3j68
NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED=true
NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED=true
PREMIUM_PACK_CHECKOUT_ENABLED=true
PREMIUM_PACK_AUTOFULFILL_ENABLED=true
```

Redeploy Production.

Test:

1. Open `/pricing`.
2. Confirm Premium CTA says `Start Premium Relocation Pack`.
3. Open `/premium-relocation-pack`.
4. Complete the intake form.
5. Confirm Stripe checkout opens for S$49.
6. Complete a test payment.
7. Confirm success page shows Premium Relocation Pack, not Student.
8. Confirm Premium email is sent with Premium sections.

## Deactivate Premium Relocation Pack

Set:

```text
NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED=false
NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED=false
PREMIUM_PACK_CHECKOUT_ENABLED=false
PREMIUM_PACK_AUTOFULFILL_ENABLED=false
```

Redeploy Production. Premium remains visible but shows a safe waitlist/paused state.

## Activate SettleMap Voice Guide

First create a Stripe product/price for SettleMap Voice Guide at S$19 one time. Then set:

```text
STRIPE_VOICE_GUIDE_PRICE_ID=<voice_guide_stripe_price_id>
NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED=true
VOICE_GUIDE_CHECKOUT_ENABLED=true
VOICE_GUIDE_AUTOFULFILL_ENABLED=true
```

Redeploy Production.

Test:

1. Open `/pricing`.
2. Confirm Voice Guide CTA says `Start Voice Guide`.
3. Open `/voice-guide`.
4. Complete the intake form.
5. Confirm Stripe checkout opens for S$19.
6. Complete a test payment.
7. Confirm success page shows SettleMap Voice Guide, not Student or Premium.
8. Confirm Voice Guide email is sent.

## Deactivate SettleMap Voice Guide

Set:

```text
NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED=false
VOICE_GUIDE_CHECKOUT_ENABLED=false
VOICE_GUIDE_AUTOFULFILL_ENABLED=false
```

Redeploy Production. Voice Guide remains visible but shows a safe paused/configuring state.

## Rollback quickly

If checkout, success page or email has any issue:

1. Set the affected product public checkout flag to `false`.
2. Set the affected product server checkout flag to `false`.
3. Set the affected product autofulfilment flag to `false`.
4. Redeploy Production.
5. Confirm `/pricing` shows paused/waitlist state.
6. Confirm checkout API returns a safe paused/configuring error.

## Health checks

Run:

```bat
health-check-v12-12.bat
```

Expected:

- `fulfilmentVersion` is `V12.12`
- `paidProductConfigReady` is `true`
- `studentCheckoutStillReady` reflects Student env flags
- `premiumPriceIdConfigured` reflects Premium env
- `voiceGuidePriceIdConfigured` reflects Voice Guide env
- `researchLinksRegistryReady` is `true`
- `providerReferencePolicyReady` is `true`
- `v1212RegressionSafe` is `true`

## Safety boundaries to verify after activation

- No document upload.
- No OCR.
- No login.
- No database.
- No provider contact automation.
- No human review promise.
- No concierge promise.
- No professional advice.
- No guarantees.
