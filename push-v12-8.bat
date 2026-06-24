@echo off
cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

echo Installing stripe and resend packages...
call npm install stripe resend
if %errorlevel% neq 0 (
    echo npm install failed. Check internet connection and try again.
    pause
    exit /b 1
)

echo Removing stale lock files...
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\index.lock" del /f ".git\index.lock"

echo Running TypeScript check...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo TypeScript errors found. Fix before pushing.
    pause
    exit /b 1
)
echo TypeScript clean.

echo Staging changed files...
git add src/app/api/stripe/webhook/route.ts
git add src/app/payment-success/page.tsx
git add src/app/pricing/page.tsx
git add STRIPE_SETUP.md
git add package.json
git add package-lock.json

echo Committing V12.8...
git commit -m "V12.8 automate Student Move Pack fulfilment"

echo Pushing to main...
git push origin main
if %errorlevel% neq 0 (
    echo Push failed. Check GitHub login.
    pause
    exit /b 1
)

echo.
echo Done! V12.8 pushed.
echo.
echo NEXT STEPS (do these in Vercel + Stripe + Resend before going live):
echo 1. Vercel: add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY,
echo            SETTLEMAP_FROM_EMAIL, SETTLEMAP_SUPPORT_EMAIL
echo 2. Stripe: create webhook endpoint at https://settlemap.app/api/stripe/webhook
echo            events: checkout.session.completed + checkout.session.async_payment_succeeded
echo 3. Resend: verify settlemap.app domain, create API key with Send permission
echo 4. Test:   curl https://settlemap.app/api/stripe/webhook
echo            expected: SettleMap Stripe webhook endpoint is available.
echo 5. See STRIPE_SETUP.md for full instructions.
echo.
pause
