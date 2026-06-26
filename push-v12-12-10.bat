@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.10 — Stripe Safety Check
echo  New flags: stripeModeChecked, paymentsPausedForSafety,
echo  voiceGuidePaidCheckoutDisabled, fulfilmentEmailInvestigated,
echo  refundRequestApiEnabled, refundRequestSubmitWorks,
echo  payoutDestinationChecked, noStripeAppsRequired
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
git commit -m "V12.12.10 Stripe safety check: confirmed live mode, 8 new health flags, payoutDestinationChecked=false pending manual verify."

git push origin main

echo.
echo ========================================================
echo  Done. Vercel will rebuild in 2-3 minutes.
echo  Check: https://videshflow-demo.vercel.app/api/stripe/health
echo  Look for: fulfilmentVersion = V12.12.10
echo ========================================================
echo.
pause
