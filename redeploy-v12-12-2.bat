@echo off
echo === Trigger Vercel redeploy V12.12.2 ===
cd /d "%~dp0"

echo Removing stale lock file if any...
del /f ".git\index.lock" 2>nul

echo.
echo Creating empty redeploy commit...
git commit --allow-empty -m "V12.12.2 trigger redeploy"
if errorlevel 1 (
  echo Empty commit failed.
  pause
  exit /b 1
)

echo.
echo Pushing to main...
git push origin main
if errorlevel 1 (
  echo Push failed.
  pause
  exit /b 1
)

echo.
echo Done. Watch Vercel production deployment.
pause
