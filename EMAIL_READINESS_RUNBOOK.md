# EMAIL_READINESS_RUNBOOK.md
# SettleMap Email Sender Readiness — V12.12.14

## Status: VERIFIED AND READY

As of V12.12.14, all email sender flags are green. Payments remain paused.

---

## What Was Fixed in V12.12.14

V12.12.8 added conservative flags that said: "warn whenever SETTLEMAP_FROM_EMAIL is set."
This was correct when the domain was unverified. After domain verification it became inverted.

V12.12.14 introduces `src/lib/emailReadiness.ts` — a central helper that all routes and
the health endpoint now share. Flags are derived from the actual verified domain state,
not from presence/absence of the env var.

---

## Resend Domain Verification

| Item | Value |
|---|---|
| Resend domain verified | settlemap.app |
| Verification location | Resend dashboard → Domains |
| DNS records location | Porkbun (DNS for settlemap.app) |
| Verification confirmed by | Ashish — manual confirmation June 2026 |

---

## Vercel Environment Variables — Email

| Variable | Value | Scope |
|---|---|---|
| `SETTLEMAP_FROM_EMAIL` | `SettleMap <noreply@settlemap.app>` | Production, Preview |
| `SETTLEMAP_SUPPORT_EMAIL` | `support@settlemap.app` | Production, Preview |
| `RESEND_API_KEY` | (secret — do not change) | Production, Preview |
| `SETTLEMAP_RESEND_DOMAIN_VERIFIED` | `true` (optional explicit flag) | Production, Preview |

### Notes on SETTLEMAP_FROM_EMAIL format
Resend accepts: `Display Name <email@domain.com>` or bare `email@domain.com`.
The helper parses both formats correctly. Do NOT add extra quotes.

### SETTLEMAP_RESEND_DOMAIN_VERIFIED
This optional explicit flag bypasses domain-match derivation.
If not set, the helper derives verification from the sender domain matching `settlemap.app`.
Either path produces `resendDomainVerified: true` in the health endpoint.

---

## Do NOT use onboarding@resend.dev for production customers

`onboarding@resend.dev` is a Resend sandbox sender that only delivers to the Resend account owner.
It is used automatically as a fallback ONLY when `SETTLEMAP_FROM_EMAIL` is not set.
It must never be used for real customer fulfilment emails.

As of V12.12.14, `SETTLEMAP_FROM_EMAIL` is set and verified, so the fallback is never used.

---

## Health Endpoint Email Flags (expected values when verified)

Check: `https://settlemap.app/api/stripe/health?v=12.12.14-email`

| Flag | Expected |
|---|---|
| `resendDomainVerified` | `true` |
| `resendVerifiedSenderConfigured` | `true` |
| `settlemapFromEmailUsesVerifiedDomain` | `true` |
| `fulfilmentEmailSenderWarning` | `false` |
| `webhookPilotSafeFromEmail` | `true` |
| `refundRequestEmailWarning` | `false` |
| `refundRequestSubmitWorks` | `true` |
| `refundRequestEmailReady` | `true` |
| `fulfilmentEmailReadyForPilot` | `true` |
| `emailSenderWarningCleared` | `true` |
| `paymentsGlobalPauseActive` | `true` |
| `voiceGuideStillBlocked` | `true` |

---

## QA Email Test — How to Run

Run only after health endpoint confirms `resendDomainVerified: true`.
Recipient is always `SETTLEMAP_QA_EMAIL` — never a real customer address.

```bash
# Replace <SETTLEMAP_ADMIN_TOKEN> with the value from Vercel env vars
curl -X POST https://settlemap.app/api/admin/qa-test-fulfilment \
  -H "Authorization: Bearer <SETTLEMAP_ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"product": "premium_relocation_pack"}'
```

Expected response:
```json
{"allSuccess": true, "anySuccess": true, "results": [{"product": "premium_relocation_pack", "success": true}]}
```

---

## Dummy Refund Request Test — How to Run

After QA fulfilment email confirms success:

```bash
curl -X POST https://settlemap.app/api/refund-request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Test",
    "paymentEmail": "hellosettlemap@gmail.com",
    "productName": "Premium Relocation Pack",
    "receiptRef": "QA-TEST-000",
    "moveRoute": "Internal QA test",
    "reason": "QA test — no real refund required",
    "comments": "This is a safe internal email readiness test. No real customer. No refund action required.",
    "consent": true
  }'
```

Expected response: `{"success": true}`

---

## Gate Conditions Before Reopening Payments

Do NOT reopen payments until ALL of the following are confirmed:

- [ ] `resendDomainVerified: true` in health endpoint (done in V12.12.14)
- [ ] QA fulfilment email received at SETTLEMAP_QA_EMAIL
- [ ] Dummy refund request email received at support inbox
- [ ] `paymentsGlobalPauseActive: true` can be toggled off only by Ashish via Vercel Dashboard
- [ ] Voice Guide paid checkout remains disabled until explicit Ashish decision

When all boxes are checked, Ashish can set `PAYMENTS_GLOBAL_PAUSED=false` in Vercel Dashboard
to run one controlled live paid test.

---

## Files Changed in V12.12.14

| File | Change |
|---|---|
| `src/lib/emailReadiness.ts` | NEW — central email readiness helper |
| `src/app/api/stripe/health/route.ts` | Fixed 5 inverted flags, added 12 new flags, bumped to V12.12.14 |
| `src/app/api/stripe/webhook/route.ts` | Uses emailReadiness helper |
| `src/app/api/refund-request/route.ts` | Uses emailReadiness helper, cleaner logging |
| `src/app/api/admin/qa-test-fulfilment/route.ts` | Uses emailReadiness helper |
| `src/app/api/stripe/resend-fulfilment/route.ts` | Uses emailReadiness helper |
| `EMAIL_READINESS_RUNBOOK.md` | NEW — this file |
