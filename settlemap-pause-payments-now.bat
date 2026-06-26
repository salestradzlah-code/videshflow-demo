@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap EMERGENCY — Pause Payments Now
echo  Sets PAYMENTS_GLOBAL_PAUSED=true + redeploys.
echo  No prompts. Runs immediately when you double-click.
echo ========================================================
echo.

cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

REM Check Vercel CLI
where vercel >nul 2>&1
if errorlevel 1 (
    echo ERROR: Vercel CLI not found. Install with: npm install -g vercel
    echo Then run: vercel login
    echo.
    echo Manual fix: Set PAYMENTS_GLOBAL_PAUSED=true in Vercel dashboard:
    echo https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables
    echo Then trigger a redeploy from Vercel dashboard.
    echo.
    pause
    exit /b 1
)

echo Removing old PAYMENTS_GLOBAL_PAUSED (if set)...
vercel env rm PAYMENTS_GLOBAL_PAUSED production --yes 2>nul

echo Setting PAYMENTS_GLOBAL_PAUSED=true in production...
echo true| vercel env add PAYMENTS_GLOBAL_PAUSED production 2>nul

echo.
echo Redeploying to production (vercel --prod --yes)...
vercel --prod --yes

echo.
echo ========================================================
echo  DONE. Payments will be paused after deploy completes.
echo  Wait 2-3 minutes then run settlemap-health-check.bat
echo  and confirm: paymentsGlobalPauseActive: True
echo ========================================================
echo.
pause
