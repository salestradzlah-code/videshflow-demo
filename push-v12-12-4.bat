@echo off
echo === SettleMap V12.12.4 Push ===
del /f ".git\index.lock" 2>nul

cd /d "%~dp0"

git log --oneline -3

git push origin main

echo.
echo === Done. Vercel deploying. ===
echo Health: https://settlemap.app/api/stripe/health
echo QA test: POST /api/admin/qa-test-fulfilment with Bearer token
echo Checklist: https://settlemap.app/document-readiness-checklist
pause
