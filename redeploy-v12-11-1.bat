@echo off
echo === Force redeploy V12.11.1 ===
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
git commit --allow-empty -m "V12.11.1 force redeploy"
git push origin main
echo === Done ===
pause
