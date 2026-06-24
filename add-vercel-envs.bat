@echo off
echo.
echo SettleMap V12.9 - Adding Vercel Environment Variables
echo ======================================================
echo.

where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Vercel CLI not found.
    echo Install it with: npm install -g vercel
    echo Then log in with: vercel login
    pause
    exit /b 1
)

echo Adding NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED=true ...
echo true | vercel env add NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED production --yes
echo true | vercel env add NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED preview --yes
echo true | vercel env add NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED development --yes

echo Adding STUDENT_PACK_CHECKOUT_ENABLED=true ...
echo true | vercel env add STUDENT_PACK_CHECKOUT_ENABLED production --yes
echo true | vercel env add STUDENT_PACK_CHECKOUT_ENABLED preview --yes
echo true | vercel env add STUDENT_PACK_CHECKOUT_ENABLED development --yes

echo Adding STUDENT_PACK_AUTOFULFILL_ENABLED=true ...
echo true | vercel env add STUDENT_PACK_AUTOFULFILL_ENABLED production --yes
echo true | vercel env add STUDENT_PACK_AUTOFULFILL_ENABLED preview --yes
echo true | vercel env add STUDENT_PACK_AUTOFULFILL_ENABLED development --yes

echo.
echo All 3 variables added. Triggering redeploy...
vercel --prod --yes

echo.
echo Done! Check: https://settlemap.app/api/stripe/health
echo.
pause
