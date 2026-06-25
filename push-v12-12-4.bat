@echo off
echo === SettleMap V12.12.4 Push ===
del /f ".git\index.lock" 2>nul

cd /d "%~dp0"

git add src/app/api/admin/qa-test-fulfilment/route.ts
git add src/app/document-readiness-checklist/page.tsx
git add src/app/api/chat/route.ts
git add src/app/api/stripe/create-checkout-session/route.ts
git add src/app/api/stripe/health/route.ts
git add src/app/layout.tsx
git add QA_TEST_RUNBOOK_V12_12_4.md
git add push-v12-12-4.bat

git commit -m "V12.12.4 QA test route, emergency pause flags, document checklist, health V12.12.4"

git push origin main

echo.
echo === Done. Vercel deploying. ===
echo Health: https://settlemap.app/api/stripe/health
echo QA test: POST /api/admin/qa-test-fulfilment with Bearer token
echo Checklist: https://settlemap.app/document-readiness-checklist
pause
