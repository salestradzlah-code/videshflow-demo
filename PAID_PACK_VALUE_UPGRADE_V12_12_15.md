# SettleMap V12.12.15 paid pack value upgrade

V12.12.15 upgrades the Student Move Pack and Premium Relocation Pack into structured relocation workspaces rather than generic fulfilment emails.

## What changed

- Added a near-top “Your move at a glance” summary with route, timing, who is moving, top priorities, official checks, this-week actions, and planning complexity.
- Added a “Next 7 actions” checklist with owner, reason, time estimate, and verification source.
- Added an “Official-source verification checklist” for government, institution, housing, banking, healthcare, telecom, local registration, and consulate checks.
- Added a “Route research links and search prompts” section so customers know what to search and where to start.
- Added worksheet-style tables for budget planning, document tracking, and provider comparison.
- Added Student-specific “Parent and family handover” guidance.
- Added copy-paste scripts for neutral provider research.
- Added a quality gate footer that preserves the planning-only boundary and official-source verification reminder.

## Safety boundaries preserved

- Planning and research support only.
- No legal, immigration, tax, financial, property, insurance, medical, school admission, vendor, or government advice.
- No provider recommendations or endorsements.
- No document upload, OCR, login, database, concierge, marketplace, or human review added.
- Stripe payment state, prices, webhook validation, and payment-success session validation were not changed by this upgrade.
- Voice Guide checkout remains blocked unless separately activated in a future approved release.
- Voice Guide has a code-level checkout hard block so env flags alone cannot accidentally open it.

## Email requirements

- Live fulfilment subjects remain customer-ready and do not include `[QA TEST]`.
- QA fulfilment emails may include `[QA TEST]`.
- Sender should remain `SettleMap <noreply@settlemap.app>`.
- Runtime code must not fall back to `onboarding@resend.dev` for production customer sends.

## Health markers

The Stripe health endpoint should expose:

- `fulfilmentQualityVersion: "V12.12.15"`
- `agenticPackStructureReady: true`
- `studentPackValueUpgrade: true`
- `premiumPackValueUpgrade: true`
- `paidPackWorkspaceStructureReady: true`
- `paymentsGlobalPauseUnchanged: true`
- `voiceGuideStillBlocked: true`
- `voiceGuideHardBlockEnforcedV1215: true`

The V12.12.14 email readiness markers should remain present:

- `resendDomainVerified`
- `fulfilmentEmailReadyForPilot`
- `refundRequestEmailReady`
- `fulfilmentEmailSenderWarning`
- `refundRequestEmailWarning`
- `webhookPilotSafeFromEmail`

## QA fulfilment test commands

Only run these with a real admin token available securely. Do not paste or print the token in chat or logs.

```powershell
$headers = @{ Authorization = "Bearer YOUR_ADMIN_TOKEN"; "Content-Type" = "application/json" }
Invoke-RestMethod -Method Post -Uri "https://settlemap.app/api/admin/qa-test-fulfilment" -Headers $headers -Body '{"product":"student_move_pack"}'
Invoke-RestMethod -Method Post -Uri "https://settlemap.app/api/admin/qa-test-fulfilment" -Headers $headers -Body '{"product":"premium_relocation_pack"}'
```

Expected result: both calls return success and deliver readable mobile-friendly QA emails to the configured QA address.
