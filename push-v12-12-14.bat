@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.14 — Email Readiness Fix
echo  Changes:
echo    - NEW: src/lib/emailReadiness.ts — central email helper
echo    - health: bumped to V12.12.14 + 12 new email flags
echo    - health: fixed 5 inverted V12.12.8-era flags
echo    - webhook, refund-request, resend-fulfilment,
echo      qa-test-fulfilment all use shared email helper
echo    - NEW: EMAIL_READINESS_RUNBOOK.md
echo    - Payments remain paused. Voice Guide remains disabled.
echo ========================================================
echo.

cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

if exist ".git\index.lock" (
    echo Removing stale git index.lock...
    del /f ".git\index.lock"
)

git add -A
git status --short

echo.
git commit -m "V12.12.14 fix email readiness flags and add central emailReadiness helper"

git push origin main

echo.
echo ========================================================
echo  Done. Vercel will rebuild in 2-3 minutes.
echo  Check: https://settlemap.app/api/stripe/health?v=12.12.14-email
echo  Look for:
echo    fulfilmentVersion = V12.12.14
echo    resendDomainVerified = true
echo    fulfilmentEmailSenderWarning = false
echo    webhookPilotSafeFromEmail = true
echo    refundRequestEmailWarning = false
echo    refundRequestSubmitWorks = true
echo    paymentsGlobalPauseActive = true
echo    voiceGuideStillBlocked = true
echo ========================================================
echo.
pause
