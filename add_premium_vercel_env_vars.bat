@echo off
setlocal EnableExtensions EnableDelayedExpansion
title SettleMap - Add Vercel Premium environment variables

REM ============================================================
REM SettleMap Vercel Environment Variable Helper
REM Adds / updates:
REM   STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID
REM   NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED
REM
REM Usage:
REM   1. Save/click this BAT from your SettleMap project folder, OR
REM      update PROJECT_DIR below.
REM   2. Make sure you are logged into Vercel when prompted.
REM   3. Keep checkout flag as false until Premium generator is fully ready.
REM ============================================================

set "PROJECT_DIR=C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

set "PREMIUM_PRICE_ID=price_1Tm7fSCRU6atVrqjWwxa3j68"
set "PREMIUM_CHECKOUT_ENABLED=false"

echo.
echo === SettleMap Vercel Premium Env Setup ===
echo Premium Stripe Price ID: %PREMIUM_PRICE_ID%
echo Premium checkout enabled: %PREMIUM_CHECKOUT_ENABLED%
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
echo Project folder:
cd
echo.

where vercel >nul 2>nul
if errorlevel 1 (
  echo Vercel CLI not found globally. Using npx vercel@latest.
  set "VERCEL_CMD=npx vercel@latest"
) else (
  set "VERCEL_CMD=vercel"
)

echo Checking Vercel login...
%VERCEL_CMD% whoami >nul 2>nul
if errorlevel 1 (
  echo.
  echo You are not logged into Vercel CLI yet.
  echo A browser/login prompt may open. Complete login, then return here.
  echo.
  %VERCEL_CMD% login
  if errorlevel 1 (
    echo ERROR: Vercel login failed.
    pause
    exit /b 1
  )
)

if not exist ".vercel\project.json" (
  echo.
  echo This folder is not linked to a Vercel project yet.
  echo Running vercel link. Choose the SettleMap project when prompted.
  echo.
  %VERCEL_CMD% link
  if errorlevel 1 (
    echo ERROR: Vercel project link failed.
    pause
    exit /b 1
  )
)

echo.
echo Adding/updating environment variables in Production, Preview and Development...
echo.

call :ADD_OR_UPDATE_ENV "STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID" "%PREMIUM_PRICE_ID%"
if errorlevel 1 goto FAILED

call :ADD_OR_UPDATE_ENV "NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED" "%PREMIUM_CHECKOUT_ENABLED%"
if errorlevel 1 goto FAILED

echo.
echo === Done ===
echo Added / updated:
echo STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID=%PREMIUM_PRICE_ID%
echo NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED=%PREMIUM_CHECKOUT_ENABLED%
echo.
echo Premium checkout is still OFF because NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED=false.
echo When Premium generator, success page and email are ready, change it to true and redeploy.
echo.

choice /C YN /M "Redeploy production now"
if errorlevel 2 goto END

echo.
echo Pulling production env and redeploying...
%VERCEL_CMD% pull --yes --environment=production
if errorlevel 1 (
  echo WARNING: vercel pull failed. Continuing to deploy may still work.
)

%VERCEL_CMD% deploy --prod
if errorlevel 1 (
  echo ERROR: Production deploy failed.
  pause
  exit /b 1
)

goto END

:ADD_OR_UPDATE_ENV
set "ENV_NAME=%~1"
set "ENV_VALUE=%~2"

for %%E in (production preview development) do (
  echo --- %%E: !ENV_NAME! ---
  echo !ENV_VALUE! | %VERCEL_CMD% env add !ENV_NAME! %%E --force
  if errorlevel 1 (
    echo Could not add with --force. Trying vercel env update...
    echo !ENV_VALUE! | %VERCEL_CMD% env update !ENV_NAME! %%E --yes
    if errorlevel 1 (
      echo ERROR: Failed to add/update !ENV_NAME! for %%E
      exit /b 1
    )
  )
)
exit /b 0

:FAILED
echo.
echo ERROR: One or more Vercel environment variable updates failed.
echo Check the messages above.
pause
exit /b 1

:END
echo.
echo Finished.
pause
exit /b 0
