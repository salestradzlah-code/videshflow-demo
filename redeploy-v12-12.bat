@echo off
echo === Trigger Vercel redeploy V12.12 ===
cd /d "%~dp0"

echo Removing stale lock file if any...
del /f ".git\index.lock" 2>nul

echo.
echo Creating empty redeploy commit...
git commit --allow-empty -m "V12.12 trigger redeploy"

echo.
echo Pushing to main...
git push origin main

echo.
echo Done. Watch Vercel production deployment.
pause
