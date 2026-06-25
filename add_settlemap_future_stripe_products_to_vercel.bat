@echo off
setlocal EnableExtensions EnableDelayedExpansion
title SettleMap - Add Future Stripe Product Env Vars to Vercel

REM ============================================================
REM SettleMap Future Stripe Products -> Vercel Env Setup
REM
REM Adds / updates Production environment variables only.
REM Reason: Preview env can trigger a "Git branch?" prompt in Vercel CLI,
REM which makes the BAT harder for beginners. Production is enough for
REM the live settlemap.app site.
REM
REM Keeps all new products OFF by default.
REM Later, change the relevant checkout flag to true and redeploy.
REM ============================================================

set "PROJECT_DIR=C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"
set "VERCEL_CMD=npx --yes vercel@latest"

REM Stripe Price IDs created in Stripe
set "STRIPE_VOICE_GUIDE_PRICE_ID=price_1Tm8PNCRU6atVrqjYi3A3sAr"
set "STRIPE_FAMILY_ADDON_PRICE_ID=price_1Tm8R2CRU6atVrqjeN4MZAlt"
set "STRIPE_PET_ADDON_PRICE_ID=price_1Tm8RlCRU6atVrqjyU4QZFcA"
set "STRIPE_CORPORATE_ADDON_PRICE_ID=price_1Tm8SVCRU6atVrqj1kiN4JKQ"
set "STRIPE_RETURN_HOME_ADDON_PRICE_ID=price_1Tm8TkCRU6atVrqjOTV9keix"
set "STRIPE_PARENT_HELPER_ADDON_PRICE_ID=price_1Tm8UmCRU6atVrqjuLw9ZATl"

REM Activation flags, all OFF for safety
set "NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED=false"
set "VOICE_GUIDE_CHECKOUT_ENABLED=false"
set "VOICE_GUIDE_AUTOFULFILL_ENABLED=false"
set "NEXT_PUBLIC_ADDONS_ENABLED=false"
set "ADDONS_CHECKOUT_ENABLED=false"
set "ADDONS_AUTOFULFILL_ENABLED=false"

echo.
echo === SettleMap Future Stripe Product Env Setup ===
echo.
echo Project folder:
echo %PROJECT_DIR%
echo.
echo This will add/update Production env variables only.
echo All new checkout flags will be set to false.
echo.

if not exist "%PROJECT_DIR%" (
  echo ERROR: Project folder not found:
  echo %PROJECT_DIR%
  echo.
  echo Edit PROJECT_DIR inside this BAT file and try again.
  pause
  exit /b 1
)

cd /d "%PROJECT_DIR%"

echo Testing Vercel CLI...
call %VERCEL_CMD% --version
if errorlevel 1 (
  echo.
  echo ERROR: Could not run Vercel CLI through npx.
  echo Check Node.js/npm installation, then try again.
  pause
  exit /b 1
)

echo.
echo Checking Vercel login...
call %VERCEL_CMD% whoami
if errorlevel 1 (
  echo.
  echo You are not logged in to Vercel CLI.
  echo Starting Vercel login now. Complete browser or device-code login.
  echo.
  call %VERCEL_CMD% login
  if errorlevel 1 (
    echo.
    echo ERROR: Vercel login failed.
    pause
    exit /b 1
  )
)

echo.
echo Checking Vercel project link...
if not exist ".vercel\project.json" (
  echo This folder is not linked to a Vercel project.
  echo Choose the SettleMap / videshflow-demo project when prompted.
  echo.
  call %VERCEL_CMD% link
  if errorlevel 1 (
    echo.
    echo ERROR: Vercel project link failed.
    pause
    exit /b 1
  )
) else (
  echo Project is already linked.
)

echo.
echo Adding/updating future product variables in PRODUCTION...
echo.

call :SET_ENV "STRIPE_VOICE_GUIDE_PRICE_ID" "%STRIPE_VOICE_GUIDE_PRICE_ID%"
if errorlevel 1 goto FAILED

call :SET_ENV "STRIPE_FAMILY_ADDON_PRICE_ID" "%STRIPE_FAMILY_ADDON_PRICE_ID%"
if errorlevel 1 goto FAILED

call :SET_ENV "STRIPE_PET_ADDON_PRICE_ID" "%STRIPE_PET_ADDON_PRICE_ID%"
if errorlevel 1 goto FAILED

call :SET_ENV "STRIPE_CORPORATE_ADDON_PRICE_ID" "%STRIPE_CORPORATE_ADDON_PRICE_ID%"
if errorlevel 1 goto FAILED

call :SET_ENV "STRIPE_RETURN_HOME_ADDON_PRICE_ID" "%STRIPE_RETURN_HOME_ADDON_PRICE_ID%"
if errorlevel 1 goto FAILED

call :SET_ENV "STRIPE_PARENT_HELPER_ADDON_PRICE_ID" "%STRIPE_PARENT_HELPER_ADDON_PRICE_ID%"
if errorlevel 1 goto FAILED

call :SET_ENV "NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED" "%NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED%"
if errorlevel 1 goto FAILED

call :SET_ENV "VOICE_GUIDE_CHECKOUT_ENABLED" "%VOICE_GUIDE_CHECKOUT_ENABLED%"
if errorlevel 1 goto FAILED

call :SET_ENV "VOICE_GUIDE_AUTOFULFILL_ENABLED" "%VOICE_GUIDE_AUTOFULFILL_ENABLED%"
if errorlevel 1 goto FAILED

call :SET_ENV "NEXT_PUBLIC_ADDONS_ENABLED" "%NEXT_PUBLIC_ADDONS_ENABLED%"
if errorlevel 1 goto FAILED

call :SET_ENV "ADDONS_CHECKOUT_ENABLED" "%ADDONS_CHECKOUT_ENABLED%"
if errorlevel 1 goto FAILED

call :SET_ENV "ADDONS_AUTOFULFILL_ENABLED" "%ADDONS_AUTOFULFILL_ENABLED%"
if errorlevel 1 goto FAILED

echo.
echo === Done ===
echo Added / updated these Production env vars:
echo.
echo STRIPE_VOICE_GUIDE_PRICE_ID=%STRIPE_VOICE_GUIDE_PRICE_ID%
echo STRIPE_FAMILY_ADDON_PRICE_ID=%STRIPE_FAMILY_ADDON_PRICE_ID%
echo STRIPE_PET_ADDON_PRICE_ID=%STRIPE_PET_ADDON_PRICE_ID%
echo STRIPE_CORPORATE_ADDON_PRICE_ID=%STRIPE_CORPORATE_ADDON_PRICE_ID%
echo STRIPE_RETURN_HOME_ADDON_PRICE_ID=%STRIPE_RETURN_HOME_ADDON_PRICE_ID%
echo STRIPE_PARENT_HELPER_ADDON_PRICE_ID=%STRIPE_PARENT_HELPER_ADDON_PRICE_ID%
echo.
echo NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED=false
echo VOICE_GUIDE_CHECKOUT_ENABLED=false
echo VOICE_GUIDE_AUTOFULFILL_ENABLED=false
echo NEXT_PUBLIC_ADDONS_ENABLED=false
echo ADDONS_CHECKOUT_ENABLED=false
echo ADDONS_AUTOFULFILL_ENABLED=false
echo.
echo Voice Guide and Add-ons remain OFF until you change flags to true.
echo.

choice /C YN /M "Redeploy production now"
if errorlevel 2 goto END

echo.
echo Redeploying production...
call %VERCEL_CMD% deploy --prod
if errorlevel 1 (
  echo.
  echo ERROR: Vercel production deploy failed.
  pause
  exit /b 1
)

goto END

:SET_ENV
set "ENV_NAME=%~1"
set "ENV_VALUE=%~2"
set "TMP_FILE=%TEMP%\settlemap_%ENV_NAME%.txt"

> "%TMP_FILE%" echo %ENV_VALUE%

echo.
echo --- Setting %ENV_NAME% for production ---

REM Remove existing value, if any. Ignore failure because it may not exist.
call %VERCEL_CMD% env rm %ENV_NAME% production --yes >nul 2>nul

REM Add fresh value.
call %VERCEL_CMD% env add %ENV_NAME% production < "%TMP_FILE%"
if errorlevel 1 (
  echo ERROR: Failed to add %ENV_NAME% for production.
  del "%TMP_FILE%" >nul 2>nul
  exit /b 1
)

del "%TMP_FILE%" >nul 2>nul
exit /b 0

:FAILED
echo.
echo ERROR: One or more env variable updates failed.
echo Check the message above.
pause
exit /b 1

:END
echo.
echo Finished.
echo.
echo Next check:
echo 1. Refresh Vercel Environment Variables.
echo 2. Search STRIPE_VOICE_GUIDE.
echo 3. Search ADDON.
echo 4. Confirm all new flags are false.
echo.
pause
exit /b 0
