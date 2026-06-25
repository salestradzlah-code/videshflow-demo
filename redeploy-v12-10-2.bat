@echo off
echo === V12.10.2 Force Redeploy ===
cd /d "%~dp0"
git commit --allow-empty -m "redeploy: trigger V12.10.2 Vercel build"
git push origin main
echo === Done — Vercel will rebuild ===
pause
