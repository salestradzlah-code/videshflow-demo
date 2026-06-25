@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.7 — Commit and Push to GitHub
echo  Stripe test integration, BAT automation, env map fix
echo ========================================================
echo.

cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

REM Clear any stale git lock from prior session
if exist ".git\index.lock" (
    echo Removing stale git index.lock...
    del /f ".git\index.lock"
)

echo Staging all changes...
git add -A

echo.
echo Files staged:
git status --short

echo.
echo Committing as V12.12.7...
git commit -m "V12.12.7: Stripe test integration BATs, env map verified, emergency control fixed

- settlemap-setup-stripe-test-env.bat: safe Vercel env setup for Stripe test
- settlemap-test-checkout-flow.bat: guided end-to-end checkout test script
- settlemap-emergency-control.bat: fix Windows <<< bash syntax -> piped echo
- settlemap-health-check.bat: version check updated to V12.12.7
- health/route.ts: bump fulfilmentVersion to V12.12.7, add 13 new flags
- Env map verified from code: no publishable key used, student uses inline
  price_data (no price ID env var), premium needs STRIPE_PREMIUM_RELOCATION
  _PACK_PRICE_ID, voice guide flags off by default
- push-v12-12-7.bat: this commit BAT

Safety: No Stripe dashboard changes. No live keys. No login/DB/OCR added.
QA emails: confirmed allSuccess=true to sales.tradzlah@gmail.com (V12.12.6)
Webhook: signature verification + idempotency + product routing all present"

echo.
echo Pushing to GitHub main...
git push origin main

echo.
echo ========================================================
echo  Push complete. Vercel will build automatically.
echo  Wait 2-3 minutes then run settlemap-health-check.bat
echo ========================================================
echo.
pause
