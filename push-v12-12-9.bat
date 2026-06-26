@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.9 — Fix truncated webhook file
echo  Restores missing closing lines + sessionId/paymentStatus
echo  All V12.12.8 fixes still included
echo ========================================================
echo.

cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

if exist ".git\index.lock" (
    echo Removing stale git index.lock...
    del /f ".git\index.lock"
)

echo Staging all changes...
git add -A

echo.
git status --short

echo.
echo Committing as V12.12.9...
git commit -m "V12.12.9: Fix truncated webhook file (restore missing closing + sessionId/paymentStatus), bump health version."

echo.
echo Pushing to GitHub main...
git push origin main

echo.
echo ========================================================
echo  Push complete. Vercel will build automatically.
echo  Wait 2-3 minutes then check health endpoint:
echo  https://videshflow-demo.vercel.app/api/stripe/health
echo  Expected: fulfilmentVersion V12.12.9
echo ========================================================
echo.
pause
