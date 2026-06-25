@echo off
echo === Force redeploy V12.10.3 ===
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
git commit --allow-empty -m "V12.10.3 force redeploy"
git push origin main
echo === Done ===
pause
