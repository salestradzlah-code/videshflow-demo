@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap Rollback Guide
echo  QA Runbook: QA_TEST_RUNBOOK_V12_12_4.md
echo ========================================================
echo.

REM Open the QA runbook in notepad if it exists
set RUNBOOK=C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp\QA_TEST_RUNBOOK_V12_12_4.md
if exist "%RUNBOOK%" (
    echo Opening QA runbook in Notepad...
    start notepad "%RUNBOOK%"
) else (
    echo NOTE: QA_TEST_RUNBOOK_V12_12_4.md not found in project root.
)

echo.
echo ========================================================
echo  ROLLBACK PROCEDURE (read carefully)
echo ========================================================
echo.
echo STEP 1 — PAUSE PAYMENTS FIRST (before anything else)
echo.
echo   Run settlemap-emergency-control.bat
echo   Choose option 2: Pause payments
echo   Verify health endpoint shows paymentsGlobalPauseActive=true
echo.
echo STEP 2 — FIND THE LAST KNOWN GOOD DEPLOYMENT
echo.
echo   Go to: https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments
echo   Look for the last deployment that was marked as Production and was working.
echo   Check the date and commit message to identify the correct one.
echo.
echo STEP 3 — PROMOTE THE GOOD DEPLOYMENT
echo.
echo   In the Vercel deployments list, click the three-dot menu on the
echo   last known good deployment and select "Promote to Production".
echo   This instantly aliases the production domain to that deployment.
echo   No rebuild required. Takes effect in ~30 seconds.
echo.
echo STEP 4 — VERIFY THE ROLLBACK
echo.
echo   Run settlemap-health-check.bat
echo   Confirm fulfilmentVersion matches the version you rolled back to.
echo   Test a page (e.g. /student-move-pack) to confirm it loads correctly.
echo.
echo STEP 5 — RESUME PAYMENTS (only after confirming rollback is stable)
echo.
echo   Run settlemap-emergency-control.bat
echo   Choose option 3: Resume payments
echo   Verify health endpoint shows paymentsGlobalPauseActive=false
echo.
echo ========================================================
echo  WHEN TO ROLLBACK
echo ========================================================
echo.
echo   - Health endpoint returns errors or unexpected version
echo   - Payment success page is broken or shows wrong content
echo   - Fulfilment emails are not being sent after purchase
echo   - Stripe webhook returning 500 errors (check Vercel logs)
echo   - Any page returns 500 or blank content on production
echo.
echo ========================================================
echo  QUICK REFERENCE
echo ========================================================
echo.
echo   Health endpoint:     https://settlemap.app/api/stripe/health
echo   Vercel dashboard:    https://vercel.com/salestradzlah-codes-projects/videshflow-demo
echo   Vercel deployments:  https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments
echo   Vercel env vars:     https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables
echo   Vercel logs:         https://vercel.com/salestradzlah-codes-projects/videshflow-demo/logs
echo   Admin QA test:       POST /api/admin/qa-test-fulfilment (Bearer token required)
echo   QA Runbook:          QA_TEST_RUNBOOK_V12_12_4.md (opened in Notepad above)
echo.
echo ========================================================
echo  IMPORTANT SAFETY RULES
echo ========================================================
echo.
echo   - NEVER change Stripe products, prices, API keys or webhook settings during an incident
echo   - NEVER remove STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET from Vercel
echo   - NEVER expose secrets in logs, chat or email
echo   - ALWAYS pause payments before rollback if in doubt
echo   - ALWAYS verify health endpoint after any change
echo   - Contact: support@settlemap.app for customer queries during downtime
echo.
echo ========================================================
pause
