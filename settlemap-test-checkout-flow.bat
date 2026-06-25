@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap Stripe Test Checkout Flow
echo  Guides you through a full end-to-end test checkout.
echo  Uses Stripe TEST card. No real charge occurs.
echo ========================================================
echo.

set BASE_URL=https://videshflow-demo.vercel.app

REM ── Step 1: Health check ─────────────────────────────────────────────────────
echo [STEP 1] Running health check before test...
echo.

powershell -NoProfile -Command ^
  "try { $r = Invoke-RestMethod -Uri '%BASE_URL%/api/stripe/health'; " ^
  "$student = $r.paidProducts | Where-Object { $_.slug -eq 'student_move_pack' }; " ^
  "$premium = $r.paidProducts | Where-Object { $_.slug -eq 'premium_relocation_pack' }; " ^
  "Write-Host ('Version:              ' + $r.fulfilmentVersion); " ^
  "Write-Host ('stripeConfigured:     ' + $r.stripeConfigured); " ^
  "Write-Host ('resendConfigured:     ' + $r.resendConfigured); " ^
  "Write-Host ('paymentsGlobalPause:  ' + $r.paymentsGlobalPauseActive); " ^
  "Write-Host ('maintenanceMode:      ' + $r.maintenanceModeActive); " ^
  "Write-Host ''; " ^
  "Write-Host '--- Student Move Pack ---'; " ^
  "Write-Host ('  status:             ' + $student.status); " ^
  "Write-Host ('  publicEnabled:      ' + $student.publicCheckoutEnabled); " ^
  "Write-Host ('  serverEnabled:      ' + $student.serverCheckoutEnabled); " ^
  "Write-Host ('  priceConfigured:    ' + $student.priceConfigured); " ^
  "Write-Host '--- Premium Relocation Pack ---'; " ^
  "Write-Host ('  status:             ' + $premium.status); " ^
  "Write-Host ('  publicEnabled:      ' + $premium.publicCheckoutEnabled); " ^
  "Write-Host ('  serverEnabled:      ' + $premium.serverCheckoutEnabled); " ^
  "Write-Host ('  priceConfigured:    ' + $premium.priceConfigured); " ^
  "} catch { Write-Host ('HEALTH CHECK FAILED: ' + $_.Exception.Message) }"

echo.
set /p "HEALTH_OK=Does health look good? (stripe+resend configured, student active) [Y/N]: "
if /i not "!HEALTH_OK!"=="Y" (
    echo.
    echo Fix health issues first:
    echo   - Run settlemap-setup-stripe-test-env.bat to set Stripe env vars
    echo   - Run settlemap-emergency-control.bat to check pause flags
    pause
    exit /b 1
)
echo.

REM ── Stripe test card info ─────────────────────────────────────────────────────
echo ========================================================
echo  STRIPE TEST CARD DETAILS (use these in checkout)
echo ========================================================
echo.
echo   Card number:  4242 4242 4242 4242
echo   Expiry:       Any future date (e.g. 12/29)
echo   CVC:          Any 3 digits (e.g. 123)
echo   Name:         Any name (e.g. Test Buyer)
echo   Address:      Any (e.g. 123 Test St, Singapore 123456)
echo.
echo   For failed payment test: 4000 0000 0000 9995 (always declines)
echo   For 3D Secure test:      4000 0027 6000 3184 (requires auth step)
echo.
echo NOTE: These are TEST cards only. No real money moves.
echo ========================================================
echo.
pause

REM ── Step 2: Student Move Pack checkout test ───────────────────────────────────
echo.
echo [STEP 2] Student Move Pack checkout test
echo.
echo Opening student-move-pack page in browser...
start "" "%BASE_URL%/student-move-pack"
echo.
echo INSTRUCTIONS:
echo  1. Fill in the form with any test data (your test email address)
echo  2. Click "Get Your Pack" or the checkout button
echo  3. On the Stripe checkout page, enter the test card above
echo  4. Complete the payment
echo  5. You should be redirected to the payment-success page
echo  6. Check your email for the fulfilment pack (Resend sandbox only delivers to
echo     the Resend account email: ashishabokil@gmail.com)
echo.
echo Expected flow:
echo   Form ^> /api/stripe/create-checkout-session ^> Stripe hosted page
echo   ^> Payment success ^> /payment-success?session_id=...
echo   ^> Stripe webhook fires ^> /api/stripe/webhook
echo   ^> Email sent via Resend to customer
echo.
set /p "STUDENT_RESULT=Student Move Pack checkout result? [PASS/FAIL/SKIP]: "
echo.

REM ── Step 3: Premium Pack checkout test (only if flags are on) ─────────────────
echo [STEP 3] Premium Relocation Pack checkout test
echo.
echo NOTE: Premium checkout is OFF by default (defaultPublicEnabled: false).
echo       It requires both NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED=true and
echo       PREMIUM_PACK_CHECKOUT_ENABLED=true in Vercel to activate.
echo.
set /p "PREMIUM_TEST=Do you want to test Premium checkout? (requires flags to be on) [Y/N]: "
if /i "!PREMIUM_TEST!"=="Y" (
    echo.
    echo Opening premium-relocation-pack page...
    start "" "%BASE_URL%/premium-relocation-pack"
    echo.
    echo INSTRUCTIONS:
    echo  1. Fill in the premium intake form with test data
    echo  2. Check both consent boxes
    echo  3. Click checkout - should go to Stripe (S$49 test price)
    echo  4. Use test card: 4242 4242 4242 4242
    echo  5. Verify success page and email fulfilment
    echo.
    set /p "PREMIUM_RESULT=Premium Pack checkout result? [PASS/FAIL/SKIP]: "
) else (
    set "PREMIUM_RESULT=SKIPPED"
)
echo.

REM ── Step 4: Verify webhook endpoint ───────────────────────────────────────────
echo [STEP 4] Verify webhook endpoint is available...
echo.
powershell -NoProfile -Command ^
  "try { $r = Invoke-WebRequest -Uri '%BASE_URL%/api/stripe/webhook' -Method GET; " ^
  "Write-Host ('Webhook endpoint: HTTP ' + $r.StatusCode + ' - Available'); " ^
  "} catch { Write-Host ('Webhook check failed: ' + $_.Exception.Message) }"
echo.
echo NOTE: For webhooks to fire during testing, Stripe must be configured to
echo       send events to: %BASE_URL%/api/stripe/webhook
echo       Register this in Stripe dashboard ^> Developers ^> Webhooks ^> Add endpoint
echo.

REM ── Summary ───────────────────────────────────────────────────────────────────
echo ========================================================
echo  TEST RESULTS SUMMARY
echo ========================================================
echo   Student Move Pack:       !STUDENT_RESULT!
echo   Premium Relocation Pack: !PREMIUM_RESULT!
echo   Base URL:                %BASE_URL%
echo ========================================================
echo.

if /i "!STUDENT_RESULT!"=="PASS" (
    echo Student checkout: PASSED. Stripe test integration confirmed.
    echo Next step: Register Stripe webhook endpoint and run a full end-to-end
    echo to confirm email fulfilment fires via webhook.
) else if /i "!STUDENT_RESULT!"=="FAIL" (
    echo Student checkout FAILED. Common causes:
    echo   - STRIPE_SECRET_KEY not set in Vercel (run setup bat)
    echo   - PAYMENTS_GLOBAL_PAUSED=true (run emergency-control bat)
    echo   - NEXT_PUBLIC_BASE_URL not set (success URL goes to broken settlemap.app)
    echo   - Stripe account not in test mode
)
echo.
pause
