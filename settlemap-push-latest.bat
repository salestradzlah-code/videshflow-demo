@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap — Push Latest Changes to GitHub
echo  Vercel will deploy automatically after push.
echo ========================================================
echo.

cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

REM Clear stale git lock if present
if exist ".git\index.lock" (
    echo Removing stale git index.lock...
    del /f ".git\index.lock"
)

echo Current status:
git log --oneline -3
echo.

set /p MSG="Enter commit message (e.g. V12.12.10: description): "
if "%MSG%"=="" (
    echo No message entered. Exiting.
    pause
    exit /b
)

echo.
echo Staging all changes...
git add -A
git status --short

echo.
echo Committing...
git commit -m "%MSG%"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================================
echo  Done. Vercel will build in 2-3 minutes.
echo  Check: https://videshflow-demo.vercel.app/api/stripe/health
echo ========================================================
echo.
pause
