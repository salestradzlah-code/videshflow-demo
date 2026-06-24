@echo off
cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

echo.
echo Triggering Vercel redeploy via empty git commit...
echo.

if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\index.lock" del /f ".git\index.lock"

git commit --allow-empty -m "trigger Vercel redeploy — V12.9 env vars"
if %errorlevel% neq 0 (
    echo Git commit failed.
    pause
    exit /b 1
)

git push origin main
if %errorlevel% neq 0 (
    echo Push failed. Check GitHub login.
    pause
    exit /b 1
)

echo.
echo Done! Vercel will auto-deploy in ~1 minute.
echo.
echo Check when ready:
echo   https://settlemap.app/api/stripe/health
echo   https://settlemap.app/student-move-pack
echo.
pause
