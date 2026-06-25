# SettleMap Payment Activation Runbook - V12.12.2

This runbook lets Ash activate or pause Student, Premium Relocation Pack and SettleMap Voice Guide without code changes.

Do not enable billing changes, archive Stripe products, rename the repository, rename the Vercel project, change DNS, or expose secrets as public environment variables.

## V12.12.2 quick controls

V12.12.2 adds security headers, activation health flags and quick helper scripts for Premium and Voice Guide.

To activate Premium and Voice Guide:

```bat
activate-premium-and-voice-v12-12-2.bat
redeploy-v12-12-2.bat
health-check-v12-12-2.bat
```

To pause Premium and Voice Guide:

```bat
pause-premium-and-voice-v12-12-2.bat
redeploy-v12-12-2.bat
health-check-v12-12-2.bat
```

The activation and pause scripts only update Premium and Voice Guide booleans. They do not change Stripe price IDs, Stripe secrets, Gemini keys, DNS, billing or add-on flags. Add-ons remain prepared only until a safe bundled checkout flow exists.

Security headers added in V12.12.2:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Restrictive `Permissions-Policy`
- `X-Frame-Options: SAMEORIGIN`
- HTTPS `Strict-Transport-Security`
- CSP in `Content-Security-Policy-Report-Only` mode first, so Stripe checkout, Vercel assets, fonts and current images are not accidentally blocked during launch.

## General deployment steps

1. Update the relevant Vercel environment variables.
2. Redeploy Production after any environment variable change.
3. Run `health-check-v12-12-2.bat`.
4. Test checkout using the product page.
5. Confirm `/payment-success?session_id=...` renders the correct product.
6. Confirm fulfilment email goes to the checkout email if autofulfilment is enabled.
7. If anything looks wrong, set the public and server checkout flags back to `false` and redeploy.

## Activate Student Move Pack

Student remains active and unaffected by the Premium/Voice activation scripts.

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

Required variables:

```text
STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID=price_1Tm7fSCRU6atVrqjWwxa3j68
STRIPE_PREMIUM_PACK_PRICE_ID=price_1Tm7fSCRU6atVrqjWwxa3j68
NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED=true
NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED=true
PREMIUM_PACK_CHECKOUT_ENABLED=true
PREMIUM_PACK_AUTOFULFILL_ENABLED=true
```

Shortcut:

```bat
activate-premium-and-voice-v12-12-2.bat
redeploy-v12-12-2.bat
health-check-v12-12-2.bat
```

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

Shortcut:

```bat
pause-premium-and-voice-v12-12-2.bat
redeploy-v12-12-2.bat
health-check-v12-12-2.bat
```

Premium remains visible but shows a safe paused state.

## Activate SettleMap Voice Guide

Voice Guide current Stripe Price ID:

```text
price_1Tm8PNCRU6atVrqjYi3A3sAr
```

Required variables:

```text
STRIPE_VOICE_GUIDE_PRICE_ID=price_1Tm8PNCRU6atVrqjYi3A3sAr
NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED=true
VOICE_GUIDE_CHECKOUT_ENABLED=true
VOICE_GUIDE_AUTOFULFILL_ENABLED=true
```

Shortcut:

```bat
activate-premium-and-voice-v12-12-2.bat
redeploy-v12-12-2.bat
health-check-v12-12-2.bat
```

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

Shortcut:

```bat
pause-premium-and-voice-v12-12-2.bat
redeploy-v12-12-2.bat
health-check-v12-12-2.bat
```

Voice Guide remains visible but shows a safe paused state.

## Add-ons

Add-on Stripe Price IDs are configured for future use:

```text
STRIPE_FAMILY_ADDON_PRICE_ID=price_1Tm8R2CRU6atVrqjeN4MZAlt
STRIPE_PET_ADDON_PRICE_ID=price_1Tm8RlCRU6atVrqjyU4QZFcA
STRIPE_CORPORATE_ADDON_PRICE_ID=price_1Tm8SVCRU6atVrqj1kiN4JKQ
STRIPE_RETURN_HOME_ADDON_PRICE_ID=price_1Tm8TkCRU6atVrqjOTV9keix
STRIPE_PARENT_HELPER_ADDON_PRICE_ID=price_1Tm8UmCRU6atVrqjuLw9ZATl
NEXT_PUBLIC_ADDONS_ENABLED=false
ADDONS_CHECKOUT_ENABLED=false
ADDONS_AUTOFULFILL_ENABLED=false
```

V12.12.2 shows add-ons as prepared modules only. Do not set `ADDONS_CHECKOUT_ENABLED=true` until bundled checkout and add-on fulfilment are implemented and tested. Premium already includes persona modules, so there is no need to activate standalone add-on checkout for this launch.

## Roll back quickly

If checkout, success page or email has any issue:

1. Run `pause-premium-and-voice-v12-12-2.bat`.
2. Run `redeploy-v12-12-2.bat`.
3. Run `health-check-v12-12-2.bat`.
4. Confirm `/pricing` shows paused state for Premium and Voice Guide.
5. Confirm checkout API returns a safe paused/configuring error.

For Student-specific issues, set the Student public/server/autofulfilment flags to `false` and redeploy.

## Health checks

Run:

```bat
health-check-v12-12-2.bat
```

Expected:

- `fulfilmentVersion` is `V12.12.2`
- `paidProductConfigReady` is `true`
- `studentCheckoutStillReady` reflects Student environment flags
- `premiumPriceIdConfigured` reflects Premium environment variables
- `voiceGuidePriceIdConfigured` reflects Voice Guide environment variables
- `securityHeadersConfigured` is `true`
- `stripeWebhookSignatureVerified` is `true`
- `paymentSuccessSessionGuardReady` is `true`
- `serverSideProductValidationReady` is `true`
- `clientSecretExposureBlocked` is `true`
- `aiAssistantSecurityChecked` is `true`
- `aiAssistantFallbackReady` is `true`
- `documentUploadStillDisabled` is `true`
- `premiumActivationToggleReady` is `true`
- `voiceGuideActivationToggleReady` is `true`
- `premiumCanActivate` is `true` when Premium price IDs are configured
- `voiceGuideCanActivate` is `true` when Voice Guide price ID is configured
- `addonsStillSafelyOff` is `true`
- `researchLinksRegistryReady` is `true`
- `providerReferencePolicyReady` is `true`
- `v12122RegressionSafe` is `true`

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
