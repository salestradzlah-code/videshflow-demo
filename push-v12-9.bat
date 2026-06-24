@echo off
cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

echo Installing packages if needed...
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
git add src/app/student-move-pack/page.tsx
git add src/app/api/stripe/create-checkout-session/route.ts
git add src/app/api/stripe/webhook/route.ts
git add src/app/api/stripe/health/route.ts
git add src/app/pricing/page.tsx
git add src/app/payment-success/page.tsx
git add src/app/payment-cancelled/page.tsx
git add package.json
git add package-lock.json

echo Committing V12.9...
git commit -m "V12.9 add prepayment intake and automated Student Move Pack fulfilment"

echo Pushing to main...
git push origin main
if %errorlevel% neq 0 (
    echo Push failed. Check GitHub login.
    pause
    exit /b 1
)

echo.
echo Done! V12.9 pushed.
echo.
echo NEXT STEPS — add these to Vercel environment variables:
echo   NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED=true
echo   STUDENT_PACK_CHECKOUT_ENABLED=true
echo   STUDENT_PACK_AUTOFULFILL_ENABLED=true
echo   (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY already set)
echo.
echo TEST WORKFLOW:
echo   1. Open https://settlemap.app/student-move-pack
echo   2. Fill in buyer email, name, route, departure month and concerns
echo   3. Continue to Stripe — pay S$19
echo   4. Confirm Stripe receipt arrives
echo   5. Confirm SettleMap Student Move Pack email arrives (within 15 min)
echo   6. Confirm internal support@settlemap.app notification arrives
echo   7. Check Stripe PaymentIntent metadata shows settlemap_fulfilled_at
echo   8. Retry webhook — confirm no duplicate customer email sent
echo.
echo HEALTH CHECK: https://settlemap.app/api/stripe/health
echo.
pause
