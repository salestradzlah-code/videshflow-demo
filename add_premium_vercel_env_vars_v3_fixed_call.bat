@echo off
setlocal EnableExtensions EnableDelayedExpansion
title SettleMap - Vercel Premium Env Setup V3 FIXED

REM ============================================================
REM SettleMap Vercel Premium Env Setup V3
REM Fix from V2:
REM - Uses CALL before npx/vercel commands. Without CALL, Windows batch
REM   can exit immediately after running npx.cmd.
REM - Adds both the planned env variable and compatibility premium flags
REM   seen in your current Vercel screen.
REM - Keeps Premium OFF for now.
REM ============================================================

set "PROJECT_DIR=C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"
set "PREMIUM_PRICE_ID=price_1Tm7fSCRU6atVrqjWwxa3j68"

REM Use npx so global Vercel install is not required.
set "VERCEL_CMD=npx --yes vercel@latest"

echo.
echo === SettleMap Vercel Premium Env Setup V3 ===
echo Project folder:
echo %PROJECT_DIR%
echo.
echo Premium Stripe Price ID:
echo %PREMIUM_PRICE_ID%
echo.
echo Premium checkout will remain OFF.
echo.

if not exist "%PROJECT_DIR%" (
  echo ERROR: Project folder not found:
  echo %PROJECT_DIR%
  pause
  exit /b 1
)

cd /d "%PROJECT_DIR%"

echo Testing Vercel CLI...
call %VERCEL_CMD% --version
if errorlevel 1 (
  echo.
  echo ERROR: Could not run Vercel CLI through npx.
  echo Check Node.js/npm, then try again.
  pause
  exit /b 1
)

echo.
echo Checking Vercel login...
call %VERCEL_CMD% whoami
if errorlevel 1 (
  echo.
  echo You are not logged in to Vercel CLI.
  echo Starting Vercel login now. Complete the browser login.
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
echo Checking project link...
if not exist ".vercel\project.json" (
  echo This folder is not linked to a Vercel project.
  echo Choose the SettleMap / videshflow-demo project when prompted.
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
echo Adding/updating Premium variables in Production and Preview...
echo Development is skipped because your current Vercel screen shows Production and Preview only.
echo.

REM Main planned Premium price ID
call :SET_ENV "STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID" "%PREMIUM_PRICE_ID%"
if errorlevel 1 goto FAILED

REM Compatibility alias, harmless if code does not use it
call :SET_ENV "STRIPE_PREMIUM_PACK_PRICE_ID" "%PREMIUM_PRICE_ID%"
if errorlevel 1 goto FAILED

REM Keep Premium off using both old and new flag names
call :SET_ENV "NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED" "false"
if errorlevel 1 goto FAILED

call :SET_ENV "NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED" "false"
if errorlevel 1 goto FAILED

call :SET_ENV "PREMIUM_PACK_CHECKOUT_ENABLED" "false"
if errorlevel 1 goto FAILED

call :SET_ENV "PREMIUM_PACK_AUTOFULFILL_ENABLED" "false"
if errorlevel 1 goto FAILED

echo.
echo === Done ===
echo Added/updated Premium Stripe price ID and kept Premium checkout OFF.
echo.
echo Please refresh Vercel Environment Variables and search for:
echo STRIPE_PREMIUM
echo PREMIUM
echo.
echo You should see:
echo STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID
echo STRIPE_PREMIUM_PACK_PRICE_ID
echo NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED
echo NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED
echo PREMIUM_PACK_CHECKOUT_ENABLED
echo PREMIUM_PACK_AUTOFULFILL_ENABLED
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

for %%E in (production preview) do (
  echo.
  echo --- Setting %ENV_NAME% for %%E ---

  call %VERCEL_CMD% env rm %ENV_NAME% %%E --yes >nul 2>nul

  call %VERCEL_CMD% env add %ENV_NAME% %%E < "%TMP_FILE%"
  if errorlevel 1 (
    echo ERROR: Failed to add %ENV_NAME% for %%E
    del "%TMP_FILE%" >nul 2>nul
    exit /b 1
  )
)

del "%TMP_FILE%" >nul 2>nul
exit /b 0

:FAILED
echo.
echo ERROR: Env setup failed. Check the message above.
pause
exit /b 1

:END
echo.
echo Finished.
pause
exit /b 0
