@echo off
echo === Push V12.11.1 Mobile menu fix, hero polish, Premium pilot, health V12.11.1 ===
cd /d "%~dp0"

echo Removing stale lock file if any...
del /f ".git\index.lock" 2>nul

echo.
echo Staging all changes...
git add -A

echo.
echo Committing...
git commit -m "V12.11.1 mobile menu overlay fixed, hero polished, Premium pilot readiness, health V12.11.1"

echo.
echo Pushing to main...
git push origin main

echo.
echo === Done — Vercel will deploy automatically ===
pause
