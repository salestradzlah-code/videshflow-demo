@echo off
echo === Add Premium Relocation Pack env vars to Vercel ===
echo.
echo IMPORTANT: This sets NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED=true
echo and PREMIUM_PACK_CHECKOUT_ENABLED=true to activate Premium checkout.
echo.
echo If STRIPE_PREMIUM_PRICE_ID is already in Vercel, that price ID will be used.
echo If not set, the code uses price_data at 4900 SGD cents (S$49).
echo.

vercel env add NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED production
echo Enter: true

vercel env add PREMIUM_PACK_CHECKOUT_ENABLED production
echo Enter: true

vercel env add PREMIUM_PACK_AUTOFULFILL_ENABLED production
echo Enter: true

echo.
echo After adding envs, run redeploy-v12-12.bat or push-v12-12.bat
pause
