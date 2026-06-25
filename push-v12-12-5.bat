@echo off
del /f ".git\index.lock" 2>nul
cd /d "%~dp0"
git log --oneline -3
git push origin main
echo.
echo === Done. Vercel deploying V12.12.5 ===
echo Health: https://settlemap.app/api/stripe/health
echo Run first: settlemap-health-check.bat
pause
