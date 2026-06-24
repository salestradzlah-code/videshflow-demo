@echo off
echo === V12.10.1 Push ===
cd /d "%~dp0"
git add -A
git commit -m "V12.10.1 fix paid fulfilment email trust and refund request workflow"
git push origin main
echo === Done — Vercel will deploy automatically ===
pause
