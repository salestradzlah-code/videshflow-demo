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
git commit -m "V12.12.7: Stripe test integration BATs, env map verified, emergency control fixed. Setup bat, checkout flow bat, health check v12127, emergency control Windows CMD fix, health route bumped to V12.12.7 with 13 new flags."

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
