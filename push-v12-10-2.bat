@echo off
echo === V12.10.2 Push ===
cd /d "%~dp0"
git add -A
git commit -m "V12.10.2 fix paid launch blockers and success-page guard"
git push origin main
echo === Done — Vercel will deploy automatically ===
pause
