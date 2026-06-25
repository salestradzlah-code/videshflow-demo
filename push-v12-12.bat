@echo off
echo === Push V12.12 Premium Relocation Pack — live paid product ===
cd /d "%~dp0"

echo Removing stale lock file if any...
del /f ".git\index.lock" 2>nul

echo.
echo Staging all changes...
git add -A

echo.
echo Committing...
git commit -m "V12.12 Premium Relocation Pack: generator, intake page, Stripe routing, webhook, session, resend, payment-success PremiumPackView, pricing live CTA, health V12.12 +16 flags"

echo.
echo Pushing to main...
git push origin main

echo.
echo === Done — Vercel will deploy automatically ===
pause
