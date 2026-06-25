@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap Stripe Test Env Setup
echo  Sets Vercel env vars for Stripe TEST mode integration.
echo  SAFE: Test mode only. No live keys.
echo ========================================================
echo.
echo CODE INSPECTION NOTES (from actual source files):
echo   - No publishable key is used anywhere (server-side checkout only)
echo   - Student Move Pack: NO price ID env var needed (uses inline price_data)
echo   - Premium Pack:  STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID required
echo   - Voice Guide:   STRIPE_VOICE_GUIDE_PRICE_ID (checkout flags off by default)
echo   - NEXT_PUBLIC_BASE_URL: set to active deployment (settlemap.app is broken)
echo.

REM ── Check Vercel CLI ─────────────────────────────────────────────────────────
where vercel >nul 2>&1
if errorlevel 1 (
    echo ERROR: Vercel CLI not found. Install with:
    echo   npm install -g vercel
    echo Then run:  vercel login
    echo.
    pause
    exit /b 1
)

REM ── Confirm project ──────────────────────────────────────────────────────────
echo Confirming Vercel project...
cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"
vercel project ls
echo.
echo Is this showing videshflow-demo / SettleMap project? [Y/N]
set /p PROJ_OK="Confirm: "
if /i not "!PROJ_OK!"=="Y" (
    echo Cancelled. Log in with: vercel login --scope salestradzlah-codes-projects
    pause
    exit /b 1
)
echo.

REM ── STRIPE_SECRET_KEY ────────────────────────────────────────────────────────
echo [1/4] STRIPE_SECRET_KEY
echo Enter your Stripe TEST secret key (starts with sk_test_...).
echo This is the secret key from Stripe dashboard ^> Developers ^> API keys.
echo DO NOT enter a live key (sk_live_...).
echo.
set /p "STRIPE_SK=sk_test_... : "
if "!STRIPE_SK!"=="" (echo ERROR: Key cannot be empty. & pause & exit /b 1)
if "!STRIPE_SK:~0,8!" NEQ "sk_test_" (
    echo WARNING: Key does not start with sk_test_. Live keys are blocked.
    set /p "FORCE_SK=Type CONFIRM to proceed anyway, or press Enter to cancel: "
    if /i not "!FORCE_SK!"=="CONFIRM" (echo Cancelled. & pause & exit /b 1)
)
echo.
echo Removing old STRIPE_SECRET_KEY and setting new value...
vercel env rm STRIPE_SECRET_KEY production --yes 2>nul
echo !STRIPE_SK!| vercel env add STRIPE_SECRET_KEY production
if errorlevel 1 (echo ERROR: Failed to set STRIPE_SECRET_KEY. & pause & exit /b 1)
echo STRIPE_SECRET_KEY set.
echo.

REM ── STRIPE_WEBHOOK_SECRET ────────────────────────────────────────────────────
echo [2/4] STRIPE_WEBHOOK_SECRET
echo Enter your Stripe TEST webhook signing secret (starts with whsec_...).
echo Get this from Stripe dashboard ^> Developers ^> Webhooks ^> your endpoint.
echo Webhook URL to register: https://videshflow-demo.vercel.app/api/stripe/webhook
echo.
set /p "STRIPE_WH=whsec_... : "
if "!STRIPE_WH!"=="" (echo ERROR: Webhook secret cannot be empty. & pause & exit /b 1)
echo.
echo Removing old STRIPE_WEBHOOK_SECRET and setting new value...
vercel env rm STRIPE_WEBHOOK_SECRET production --yes 2>nul
echo !STRIPE_WH!| vercel env add STRIPE_WEBHOOK_SECRET production
if errorlevel 1 (echo ERROR: Failed to set STRIPE_WEBHOOK_SECRET. & pause & exit /b 1)
echo STRIPE_WEBHOOK_SECRET set.
echo.

REM ── STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID ─────────────────────────────────
echo [3/4] STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID
echo Setting known Stripe TEST price ID for Premium Relocation Pack (S$49).
echo Price ID: price_1TmGshCRU6atVrqjTONOhHwv
echo NOTE: Student Move Pack uses inline price_data - NO price ID env var needed.
echo.
vercel env rm STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID production --yes 2>nul
echo price_1TmGshCRU6atVrqjTONOhHwv| vercel env add STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID production
if errorlevel 1 (echo ERROR: Failed to set premium price ID. & pause & exit /b 1)
echo STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID set.
echo.

REM ── NEXT_PUBLIC_BASE_URL ─────────────────────────────────────────────────────
echo [4/4] NEXT_PUBLIC_BASE_URL
echo WARNING: settlemap.app domain is currently broken (DNS/config issue).
echo Setting base URL to active Vercel deployment so checkout success/cancel
echo redirects work during testing.
echo.
echo Current working URL: https://videshflow-demo.vercel.app
set /p "BASE_CHOICE=Use videshflow-demo.vercel.app? [Y/N]: "
if /i "!BASE_CHOICE!"=="Y" (
    vercel env rm NEXT_PUBLIC_BASE_URL production --yes 2>nul
    echo https://videshflow-demo.vercel.app| vercel env add NEXT_PUBLIC_BASE_URL production
    if errorlevel 1 (echo ERROR: Failed to set NEXT_PUBLIC_BASE_URL. & pause & exit /b 1)
    echo NEXT_PUBLIC_BASE_URL set to https://videshflow-demo.vercel.app
) else (
    echo Skipped. Success/cancel URLs will default to https://settlemap.app (currently broken).
)
echo.

REM ── Voice Guide price ID (optional, do not enable checkout) ──────────────────
echo NOTE: STRIPE_VOICE_GUIDE_PRICE_ID is NOT being set.
echo       Voice Guide checkout flags are off by default.
echo       Do not enable without Ashish approval.
echo.

REM ── Redeploy ─────────────────────────────────────────────────────────────────
echo ========================================================
echo All env vars applied. Triggering production redeploy...
echo ========================================================
echo.
vercel --prod --yes
echo.
echo ========================================================
echo Done. Wait 2-3 minutes for build to complete, then run:
echo   settlemap-health-check.bat
echo to verify Stripe is configured and products are active.
echo.
echo Stripe TEST webhook must be registered at:
echo   https://videshflow-demo.vercel.app/api/stripe/webhook
echo Events to enable:
echo   checkout.session.completed
echo   checkout.session.async_payment_succeeded
echo ========================================================
echo.
pause
