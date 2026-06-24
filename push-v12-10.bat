@echo off
echo === V12.10 Push ===
cd /d "%~dp0"
git add -A
git commit -m "V12.10 show paid Student Move Pack on success page and email"
git push origin main
echo === Done — Vercel will deploy automatically ===
pause
