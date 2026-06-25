@echo off
echo === Push V12.11.2 Promise audit, packing checklist, provider scripts, research links ===
cd /d "%~dp0"

echo Removing stale lock file if any...
del /f ".git\index.lock" 2>nul

echo.
echo Staging all changes...
git add -A

echo.
echo Committing...
git commit -m "V12.11.2 promise audit: packing checklist improved, provider scripts complete, research links section, health V12.11.2"

echo.
echo Pushing to main...
git push origin main

echo.
echo === Done — Vercel will deploy automatically ===
pause
