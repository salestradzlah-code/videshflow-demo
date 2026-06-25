@echo off
echo === Push V12.11 Homepage simplification and visual polish ===
cd /d "%~dp0"

echo Removing stale lock file if any...
del /f ".git\index.lock" 2>nul

echo.
echo Staging all changes...
git add -A

echo.
echo Committing...
git commit -m "V12.11 homepage simplified, any-country copy, feedback CTA, service card colors, trust bar, health V12.11"

echo.
echo Pushing to main...
git push origin main

echo.
echo === Done — Vercel will deploy automatically ===
pause
