@echo off
echo === Push V12.12 paid product activation system ===
cd /d "%~dp0"

echo Removing stale lock file if any...
del /f ".git\index.lock" 2>nul

echo.
echo Running TypeScript check...
call npx tsc --noEmit
if errorlevel 1 (
  echo TypeScript failed. Fix errors before push.
  pause
  exit /b 1
)

echo.
echo Staging V12.12 release files only...
git add .env.example .gitignore README.md STRIPE_PRODUCTS.md VERCEL_ENVIRONMENT_VARIABLES.md PAYMENT_ACTIVATION_RUNBOOK.md
git add health-check-v12-12.bat push-v12-12.bat redeploy-v12-12.bat
git add src\app\api\stripe\create-checkout-session\route.ts
git add src\app\api\stripe\health\route.ts
git add src\app\api\stripe\resend-fulfilment\route.ts
git add src\app\api\stripe\session\route.ts
git add src\app\api\stripe\webhook\route.ts
git add src\app\payment-success\page.tsx
git add src\app\premium-relocation-pack\page.tsx
git add src\app\pricing\page.tsx
git add src\app\reference-links\page.tsx
git add src\app\service-provider-reference-policy\page.tsx
git add src\app\services\page.tsx
git add src\app\sitemap.ts
git add src\app\voice-guide\page.tsx
git add src\components\Footer.tsx
git add src\components\settlemap\RouteLibraryGrid.tsx
git add src\components\settlemap\RouteWizard.tsx
git add src\data\researchLinksRegistry.ts
git add src\lib\paidProducts.ts
git add src\lib\premiumRelocationPack.ts
git add src\lib\studentMovePack.ts
git add src\lib\voiceGuide.ts

echo.
echo Committing...
git commit -m "V12.12 paid product activation system and Voice Guide readiness"

echo.
echo Pushing to main...
git push origin main

echo.
echo Done. Vercel should deploy automatically.
pause
