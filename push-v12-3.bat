@echo off
cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

echo Removing stale lock files...
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\index.lock" del /f ".git\index.lock"

echo Staging changed files...
git add src/app/pricing/page.tsx
git add src/app/payment-success/page.tsx

echo Committing V12.7.1...
git commit -m "V12.7.1 clarify post payment fulfilment wording"

echo Pushing to main...
git push origin main
if %errorlevel% neq 0 (
    echo Push failed. Check GitHub login.
    pause
    exit /b 1
)

echo Done! V12.7.1 pushed. Watch Vercel for deployment.
pause
