@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.9 Travel Setup
echo  Committing: admin runbooks, Mac setup, Codespaces,
echo  env example, BAT files, Mac scripts, Ashu handover
echo ========================================================
echo.

cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

if exist ".git\index.lock" (
    echo Removing stale git index.lock...
    del /f ".git\index.lock"
)

git add -A
git status --short

echo.
git commit -m "V12.12.9 travel-ready admin setup: TRAVEL_ADMIN_RUNBOOK, MACBOOK_SETUP, ASHU_ADMIN_HANDOVER, .env.local.example, devcontainer, Mac shell scripts, updated health BAT."

git push origin main

echo.
echo ========================================================
echo  Done. Vercel will rebuild in 2-3 minutes.
echo  All runbooks and handover docs are now in GitHub.
echo ========================================================
echo.
pause
