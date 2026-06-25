@echo off
echo === Force redeploy V12.11 ===
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
git commit --allow-empty -m "V12.11 force redeploy"
git push origin main
echo === Done ===
pause
