@echo off
echo === Fix stale git lock and push V12.10.2 ===
cd /d "%~dp0"

echo Removing stale lock file...
del /f ".git\index.lock" 2>nul
echo Done.

echo.
echo Staging all changes...
git add -A

echo.
echo Committing...
git commit -m "V12.10.2 fix paid launch blockers and success-page guard"

echo.
echo Pushing to main...
git push origin main

echo.
echo === Done — Vercel will deploy automatically ===
pause
