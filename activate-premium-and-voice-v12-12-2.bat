@echo off
setlocal EnableExtensions
echo === Activate SettleMap Premium and Voice Guide V12.12.2 ===
cd /d "%~dp0"
echo.
echo This sets only Premium and Voice Guide launch flags in Vercel Production.
echo Add-on flags are not changed and should remain false.
echo No secret keys are printed or changed by this script.
echo.

where vercel >nul 2>nul
if errorlevel 1 (
  set "VERCEL_CMD=npx --yes vercel@latest"
) else (
  set "VERCEL_CMD=vercel"
)

call :setFlag NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED true
if errorlevel 1 goto failed
call :setFlag NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED true
if errorlevel 1 goto failed
call :setFlag PREMIUM_PACK_CHECKOUT_ENABLED true
if errorlevel 1 goto failed
call :setFlag PREMIUM_PACK_AUTOFULFILL_ENABLED true
if errorlevel 1 goto failed
call :setFlag NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED true
if errorlevel 1 goto failed
call :setFlag VOICE_GUIDE_CHECKOUT_ENABLED true
if errorlevel 1 goto failed
call :setFlag VOICE_GUIDE_AUTOFULFILL_ENABLED true
if errorlevel 1 goto failed

echo.
echo Premium and Voice Guide flags are set to true in Vercel Production.
echo Next: run redeploy-v12-12-2.bat, then run health-check-v12-12-2.bat.
echo Add-ons were not changed: keep NEXT_PUBLIC_ADDONS_ENABLED, ADDONS_CHECKOUT_ENABLED and ADDONS_AUTOFULFILL_ENABLED false.
pause
exit /b 0

:setFlag
echo Setting %~1=%~2
call %VERCEL_CMD% env rm %~1 production --yes >nul 2>nul
echo %~2| call %VERCEL_CMD% env add %~1 production
if errorlevel 1 (
  echo Failed to set %~1.
  exit /b 1
)
exit /b 0

:failed
echo.
echo Activation did not finish. Check the Vercel CLI output above.
pause
exit /b 1
