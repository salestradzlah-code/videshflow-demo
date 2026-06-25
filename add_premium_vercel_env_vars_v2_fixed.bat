@echo off
setlocal EnableExtensions EnableDelayedExpansion
title SettleMap - Vercel Premium Env Setup V2

REM ============================================================
REM FIXED V2
REM Main fix:
REM - Uses npx --yes vercel@latest so npx does not wait silently.
REM - Shows login output instead of hiding it.
REM - Uses temp files for env values, then removes and re-adds variables.
REM ============================================================

set "PROJECT_DIR=C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

set "PREMIUM_PRICE_ID=price_1Tm7fSCRU6atVrqjWwxa3j68"
set "PREMIUM_CHECKOUT_ENABLED=false"

set "VERCEL_CMD=npx --yes vercel@latest"

echo.
echo === SettleMap Vercel Premium Env Setup V2 ===
echo.
echo Premium Stripe Price ID:
echo %PREMIUM_PRICE_ID%
echo.
echo Premium checkout flag:
echo %PREMIUM_CHECKOUT_ENABLED%
echo.
echo Project folder:
echo %PROJECT_DIR%
echo.

if not exist "%PROJECT_DIR%" (
  echo ERROR: Project folder not found.
  echo Edit PROJECT_DIR inside this BAT file and try again.
  pause
  exit /b 1
)

cd /d "%PROJECT_DIR%"

echo Testing Vercel CLI...
%VERCEL_CMD% --version
if errorlevel 1 (
  echo.
  echo ERROR: Could not run Vercel CLI through npx.
  echo Please check Node.js / npm installation.
  pause
  exit /b 1
)

echo.
echo Checking Vercel login...
%VERCEL_CMD% whoami
if errorlevel 1 (
  echo.
  echo You are not logged in to Vercel CLI.
  echo Starting Vercel login now. Complete the browser login or device-code login.
  echo.
  %VERCEL_CMD% login
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
  echo Choose the SettleMap project when prompted.
  echo.
  %VERCEL_CMD% link
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
echo Adding Premium env variables to Production, Preview and Development...
echo.

call :SET_VERCEL_ENV "STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID" "%PREMIUM_PRICE_ID%"
if errorlevel 1 goto FAILED

call :SET_VERCEL_ENV "NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED" "%PREMIUM_CHECKOUT_ENABLED%"
if errorlevel 1 goto FAILED

echo.
echo === Env setup complete ===
echo Added / updated:
echo STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID=%PREMIUM_PRICE_ID%
echo NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED=%PREMIUM_CHECKOUT_ENABLED%
echo.
echo Premium checkout remains OFF because the flag is false.
echo.

choice /C YN /M "Redeploy production now"
if errorlevel 2 goto END

echo.
echo Redeploying production...
%VERCEL_CMD% deploy --prod
if errorlevel 1 (
  echo.
  echo ERROR: Vercel production deploy failed.
  pause
  exit /b 1
)

goto END

:SET_VERCEL_ENV
set "ENV_NAME=%~1"
set "ENV_VALUE=%~2"
set "TMP_FILE=%TEMP%\settlemap_%ENV_NAME%.txt"

> "%TMP_FILE%" echo %ENV_VALUE%

for %%E in (production preview development) do (
  echo.
  echo --- Setting %ENV_NAME% for %%E ---

  REM Remove if already exists. Ignore failures because it may not exist yet.
  %VERCEL_CMD% env rm %ENV_NAME% %%E --yes >nul 2>nul

  REM Add fresh value from temp file.
  %VERCEL_CMD% env add %ENV_NAME% %%E < "%TMP_FILE%"
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
