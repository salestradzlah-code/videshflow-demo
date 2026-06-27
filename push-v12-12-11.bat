@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.11 — Refund Request Email Safety Fix
echo  Changes:
echo    - Refund route: email failure is non-fatal (200, not 500)
echo    - Refund route: logs sender warning + error name
echo    - Health: refundRequestSubmitWorks = false when unverified
echo    - Health: refundRequestEmailWarning = true when SETTLEMAP_FROM_EMAIL set
echo    - Health: refundRequestEmailFailureNonFatal = true
echo    - Health: resendDomainVerified = false
echo    - Payments remain paused
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
git commit -m "V12.12.11 fix refund request email safety and health flags"

git push origin main

echo.
echo ========================================================
echo  Done. Vercel will rebuild in 2-3 minutes.
echo  Check: https://videshflow-demo.vercel.app/api/stripe/health
echo  Look for: fulfilmentVersion = V12.12.11
echo             refundRequestSubmitWorks = false (until Resend domain verified)
echo             refundRequestEmailFailureNonFatal = true
echo ========================================================
echo.
pause
