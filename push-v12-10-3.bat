@echo off
echo === Push V12.10.3 UX polish ===
cd /d "%~dp0"

echo Removing stale lock file if any...
del /f ".git\index.lock" 2>nul

echo.
echo Staging all changes...
git add -A

echo.
echo Committing...
git commit -m "V12.10.3 UX polish — form label, pricing copy, card icons, official links, health endpoint"

echo.
echo Pushing to main...
git push origin main

echo.
echo === Done — Vercel will deploy automatically ===
pause
