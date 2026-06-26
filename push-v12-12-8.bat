@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.8 — Commit and Push to GitHub
echo  Production incident fixes: webhook email, Voice Guide,
echo  success page wording, refund API, CSV export
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
echo Committing as V12.12.8...
git commit -m "V12.12.8: Fix webhook 500 (pilot-safe sender, non-fatal email), hard-disable Voice Guide checkout, remove false email claim from success page, add CSV download, create refund API POST route with success state, update refund form."

echo.
echo Pushing to GitHub main...
git push origin main

echo.
echo ========================================================
echo  Push complete. Vercel will build automatically.
echo  Wait 2-3 minutes then run settlemap-health-check.bat
echo  Expected: fulfilmentVersion V12.12.8
echo ========================================================
echo.
pause
