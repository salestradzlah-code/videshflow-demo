@echo off
echo === Trigger Vercel redeploy V12.12 (empty commit) ===
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
git commit --allow-empty -m "V12.12 trigger redeploy"
git push origin main
pause
