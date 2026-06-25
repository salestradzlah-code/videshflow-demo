@echo off
echo === Push V12.12.2 security hardening and activation controls ===
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
echo Running production build...
call npm run build
if errorlevel 1 (
  echo Build failed. Fix errors before push.
  pause
  exit /b 1
)

echo.
echo Staging V12.12.2 release files only...
git add .env.example README.md STRIPE_PRODUCTS.md VERCEL_ENVIRONMENT_VARIABLES.md PAYMENT_ACTIVATION_RUNBOOK.md
git add next.config.ts
git add activate-premium-and-voice-v12-12-2.bat pause-premium-and-voice-v12-12-2.bat health-check-v12-12-2.bat push-v12-12-2.bat redeploy-v12-12-2.bat
git add src\app\api\chat\route.ts
git add src\app\api\stripe\create-checkout-session\route.ts
git add src\app\api\stripe\health\route.ts
git add src\app\api\stripe\resend-fulfilment\route.ts
git add src\app\api\stripe\webhook\route.ts
git add src\app\premium-relocation-pack\page.tsx
git add src\app\voice-guide\page.tsx
git add src\components\settlemap\RouteWizard.tsx
git add src\lib\relocationTimeline.ts

echo.
echo Committing...
git commit -m "V12.12.2 security hardening and activation controls"
if errorlevel 1 (
  echo Nothing committed or commit failed.
  pause
  exit /b 1
)

echo.
echo Pushing to main...
git push origin main
if errorlevel 1 (
  echo Push failed.
  pause
  exit /b 1
)

echo.
echo Done. Vercel should deploy automatically.
pause
