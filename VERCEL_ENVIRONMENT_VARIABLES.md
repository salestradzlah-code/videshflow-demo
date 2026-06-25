# SettleMap Vercel Environment Variables - V12.12.2

Do not delete existing production variables in this release. Old names are supported where safe so production does not break.

## Payment infrastructure

| Current env var | Used in code | Purpose | Canonical name | Alias support | Keep or remove later | Risk |
|---|---:|---|---|---|---|---|
| `STRIPE_SECRET_KEY` | Yes | Server-side Stripe API | `STRIPE_SECRET_KEY` | No | Keep | Critical secret. Never expose publicly. |
| `STRIPE_WEBHOOK_SECRET` | Yes | Verify Stripe webhook signatures | `STRIPE_WEBHOOK_SECRET` | No | Keep | Critical secret. Wrong value breaks fulfilment. |
| `RESEND_API_KEY` | Yes | Send fulfilment emails | `RESEND_API_KEY` | No | Keep | Secret. Missing value blocks automated email. |
| `SETTLEMAP_FROM_EMAIL` | Yes | From email for fulfilment | `SETTLEMAP_FROM_EMAIL` | No | Keep | Missing value uses support fallback. |
| `SETTLEMAP_SUPPORT_EMAIL` | Yes | Reply-to/support email | `SETTLEMAP_SUPPORT_EMAIL` | No | Keep | Missing value uses `support@settlemap.app`. |
| `SETTLEMAP_ADMIN_TOKEN` | Yes | Protect resend fulfilment endpoint | `SETTLEMAP_ADMIN_TOKEN` | No | Keep | Secret. Missing value disables resend endpoint. |
| `NEXT_PUBLIC_BASE_URL` | Yes | Checkout success/cancel URL base | `NEXT_PUBLIC_BASE_URL` | No | Keep | Must be `https://settlemap.app` in production. |

## Student Move Pack

| Current env var | Used in code | Purpose | Canonical name | Alias support | Keep or remove later | Risk |
|---|---:|---|---|---|---|---|
| `NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED` | Yes | Public Student checkout visibility | `NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED` | No | Keep | If `false`, Student public checkout is paused. |
| `STUDENT_PACK_CHECKOUT_ENABLED` | Yes | Server-side Student checkout gate | `STUDENT_PACK_CHECKOUT_ENABLED` | No | Keep | If `false`, API returns safe paused error. |
| `STUDENT_PACK_AUTOFULFILL_ENABLED` | Yes | Send Student email automatically | `STUDENT_PACK_AUTOFULFILL_ENABLED` | No | Keep | If `false`, payment succeeds but manual fulfilment may be needed. |

Student currently uses Stripe inline `price_data` for S$19, not a Stripe Price ID env var.

## Premium Relocation Pack

| Current env var | Used in code | Purpose | Canonical name | Alias support | Keep or remove later | Risk |
|---|---:|---|---|---|---|---|
| `STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID` | Yes | Premium Stripe Price ID | `STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID` | Canonical | Keep | Required for Premium checkout. |
| `STRIPE_PREMIUM_PACK_PRICE_ID` | Yes | Premium Stripe Price ID alias | `STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID` | Alias | Keep for now, remove later after audit | Safe alias. |
| `STRIPE_PREMIUM_PRICE_ID` | Yes | Legacy Premium Stripe Price ID alias | `STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID` | Alias | Remove later only after production audit | Legacy alias avoids breakage. |
| `NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED` | Yes | Public Premium checkout visibility | `NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED` | Canonical | Keep | Must be `true` to show active CTA. |
| `NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED` | Yes | Public Premium checkout visibility alias | `NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED` | Alias | Keep for now | Safe alias. |
| `PREMIUM_PACK_CHECKOUT_ENABLED` | Yes | Server-side Premium checkout gate | `PREMIUM_PACK_CHECKOUT_ENABLED` | No | Keep | Must be `true` for checkout API. |
| `PREMIUM_PACK_AUTOFULFILL_ENABLED` | Yes | Send Premium email automatically | `PREMIUM_PACK_AUTOFULFILL_ENABLED` | No | Keep | Must be `true` for automated email. |

Premium is payable only when:

1. A valid Premium Stripe Price ID exists.
2. At least one public Premium payment flag is `true`.
3. `PREMIUM_PACK_CHECKOUT_ENABLED=true`.

## SettleMap Voice Guide

| Current env var | Used in code | Purpose | Canonical name | Alias support | Keep or remove later | Risk |
|---|---:|---|---|---|---|---|
| `STRIPE_VOICE_GUIDE_PRICE_ID` | Yes | Voice Guide Stripe Price ID (`price_1Tm8PNCRU6atVrqjYi3A3sAr`) | `STRIPE_VOICE_GUIDE_PRICE_ID` | No | Keep | Required before Voice Guide checkout can work. |
| `NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED` | Yes | Public Voice Guide checkout visibility | `NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED` | No | Keep | Must be `true` to show active CTA. |
| `VOICE_GUIDE_CHECKOUT_ENABLED` | Yes | Server-side Voice Guide checkout gate | `VOICE_GUIDE_CHECKOUT_ENABLED` | No | Keep | Must be `true` for checkout API. |
| `VOICE_GUIDE_AUTOFULFILL_ENABLED` | Yes | Send Voice Guide email automatically | `VOICE_GUIDE_AUTOFULFILL_ENABLED` | No | Keep | Must be `true` for automated email. |

If `STRIPE_VOICE_GUIDE_PRICE_ID` is missing, the site does not break. It shows a safe paused/configuring state and the API returns a safe configuration message.

## Future add-ons

| Current env var | Used in code | Purpose | Canonical name | Alias support | Keep or remove later | Risk |
|---|---:|---|---|---|---|---|
| `STRIPE_FAMILY_ADDON_PRICE_ID` | Config only | Future Family Add-on (`price_1Tm8R2CRU6atVrqjeN4MZAlt`) | `STRIPE_FAMILY_ADDON_PRICE_ID` | No | Keep | Not active in checkout today. |
| `STRIPE_PET_ADDON_PRICE_ID` | Config only | Future Pet Add-on (`price_1Tm8RlCRU6atVrqjyU4QZFcA`) | `STRIPE_PET_ADDON_PRICE_ID` | No | Keep | Not active in checkout today. |
| `STRIPE_CORPORATE_ADDON_PRICE_ID` | Config only | Future Corporate Add-on (`price_1Tm8SVCRU6atVrqj1kiN4JKQ`) | `STRIPE_CORPORATE_ADDON_PRICE_ID` | No | Keep | Not active in checkout today. |
| `STRIPE_RETURN_HOME_ADDON_PRICE_ID` | Config only | Future Returning Home Add-on (`price_1Tm8TkCRU6atVrqjOTV9keix`) | `STRIPE_RETURN_HOME_ADDON_PRICE_ID` | No | Keep | Not active in checkout today. |
| `STRIPE_PARENT_HELPER_ADDON_PRICE_ID` | Config only | Future Parent Helper Add-on (`price_1Tm8UmCRU6atVrqjuLw9ZATl`) | `STRIPE_PARENT_HELPER_ADDON_PRICE_ID` | No | Keep | Not active in checkout today. |
| `NEXT_PUBLIC_ADDONS_ENABLED` | Config only | Future add-on UI visibility gate | `NEXT_PUBLIC_ADDONS_ENABLED` | No | Keep | Does not enable checkout by itself. |
| `ADDONS_CHECKOUT_ENABLED` | Config only | Future server-side add-on checkout gate | `ADDONS_CHECKOUT_ENABLED` | No | Keep | Keep `false` until bundled checkout is implemented and tested. |
| `ADDONS_AUTOFULFILL_ENABLED` | Config only | Future add-on fulfilment gate | `ADDONS_AUTOFULFILL_ENABLED` | No | Keep | Keep `false` until add-on fulfilment exists. |

## Non-payment safeguards

| Env var pattern | Status |
|---|---|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Do not add. Gemini key must remain server-side only. |
| `GEMINI_API_KEY` | Server-side only for `/api/chat`. |
| Upload/OCR/login/database envs | None required in V12.12.2. |
