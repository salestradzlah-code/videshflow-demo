@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap Emergency Control Panel
echo  Uses Vercel CLI to set/unset env vars + redeploy.
echo  Changes take effect after redeployment only.
echo ========================================================
echo.

:MAIN_MENU
echo Select an action:
echo.
echo   1.  Check health (current live status)
echo   2.  Pause payments         (PAYMENTS_GLOBAL_PAUSED=true)
echo   3.  Resume payments        (remove PAYMENTS_GLOBAL_PAUSED)
echo   4.  Pause AI assistant     (AI_GLOBAL_PAUSED=true)
echo   5.  Resume AI assistant    (remove AI_GLOBAL_PAUSED)
echo   6.  Turn maintenance ON    (SITE_MAINTENANCE_MODE=true)
echo   7.  Turn maintenance OFF   (remove SITE_MAINTENANCE_MODE)
echo   8.  EMERGENCY ON  --- pause payments + pause AI + maintenance ON
echo   9.  EMERGENCY OFF --- resume payments + resume AI + maintenance OFF
echo  10.  Redeploy production    (trigger Vercel redeploy)
echo  11.  Exit
echo.
set /p CHOICE="Enter choice [1-11]: "

if "!CHOICE!"=="1"  goto DO_HEALTH
if "!CHOICE!"=="2"  goto DO_PAUSE_PAYMENTS
if "!CHOICE!"=="3"  goto DO_RESUME_PAYMENTS
if "!CHOICE!"=="4"  goto DO_PAUSE_AI
if "!CHOICE!"=="5"  goto DO_RESUME_AI
if "!CHOICE!"=="6"  goto DO_MAINTENANCE_ON
if "!CHOICE!"=="7"  goto DO_MAINTENANCE_OFF
if "!CHOICE!"=="8"  goto DO_EMERGENCY_ON
if "!CHOICE!"=="9"  goto DO_EMERGENCY_OFF
if "!CHOICE!"=="10" goto DO_REDEPLOY
if "!CHOICE!"=="11" goto EXIT_SCRIPT
echo Invalid choice. Try again.
goto MAIN_MENU

REM -------------------------------------------------------
:DO_HEALTH
echo.
echo Checking https://settlemap.app/api/stripe/health ...
echo.
powershell -NoProfile -Command ^
  "try { $r = Invoke-RestMethod -Uri 'https://settlemap.app/api/stripe/health'; " ^
  "Write-Host ('fulfilmentVersion:         ' + $r.fulfilmentVersion); " ^
  "Write-Host ('maintenanceModeActive:     ' + $r.maintenanceModeActive); " ^
  "Write-Host ('paymentsGlobalPauseActive: ' + $r.paymentsGlobalPauseActive); " ^
  "Write-Host ('aiGlobalPauseActive:       ' + $r.aiGlobalPauseActive); " ^
  "Write-Host ('stripeConfigured:          ' + $r.stripeConfigured); " ^
  "Write-Host ('resendConfigured:          ' + $r.resendConfigured); " ^
  "} catch { Write-Host ('ERROR: ' + $_.Exception.Message) }"
echo.
goto MAIN_MENU

REM -------------------------------------------------------
:DO_PAUSE_PAYMENTS
echo.
echo ACTION: Set PAYMENTS_GLOBAL_PAUSED=true in Vercel (production)
echo This will BLOCK all checkout after next redeploy.
echo.
set /p CONFIRM="Type YES to confirm: "
if /i not "!CONFIRM!"=="YES" (echo Cancelled. & goto MAIN_MENU)
call :CHECK_VERCEL_CLI
vercel env rm PAYMENTS_GLOBAL_PAUSED production --yes 2>nul
vercel env add PAYMENTS_GLOBAL_PAUSED production <<< "true" 2>nul
echo.
echo env var set. Redeploying now...
call :DO_REDEPLOY_INLINE
goto MAIN_MENU

REM -------------------------------------------------------
:DO_RESUME_PAYMENTS
echo.
echo ACTION: Remove PAYMENTS_GLOBAL_PAUSED from Vercel (production)
echo.
set /p CONFIRM="Type YES to confirm: "
if /i not "!CONFIRM!"=="YES" (echo Cancelled. & goto MAIN_MENU)
call :CHECK_VERCEL_CLI
vercel env rm PAYMENTS_GLOBAL_PAUSED production --yes 2>nul
echo.
echo env var removed. Redeploying now...
call :DO_REDEPLOY_INLINE
goto MAIN_MENU

REM -------------------------------------------------------
:DO_PAUSE_AI
echo.
echo ACTION: Set AI_GLOBAL_PAUSED=true in Vercel (production)
echo This will BLOCK the AI assistant after next redeploy.
echo.
set /p CONFIRM="Type YES to confirm: "
if /i not "!CONFIRM!"=="YES" (echo Cancelled. & goto MAIN_MENU)
call :CHECK_VERCEL_CLI
vercel env rm AI_GLOBAL_PAUSED production --yes 2>nul
vercel env add AI_GLOBAL_PAUSED production <<< "true" 2>nul
echo.
echo env var set. Redeploying now...
call :DO_REDEPLOY_INLINE
goto MAIN_MENU

REM -------------------------------------------------------
:DO_RESUME_AI
echo.
echo ACTION: Remove AI_GLOBAL_PAUSED from Vercel (production)
echo.
set /p CONFIRM="Type YES to confirm: "
if /i not "!CONFIRM!"=="YES" (echo Cancelled. & goto MAIN_MENU)
call :CHECK_VERCEL_CLI
vercel env rm AI_GLOBAL_PAUSED production --yes 2>nul
echo.
echo env var removed. Redeploying now...
call :DO_REDEPLOY_INLINE
goto MAIN_MENU

REM -------------------------------------------------------
:DO_MAINTENANCE_ON
echo.
echo ACTION: Set SITE_MAINTENANCE_MODE=true in Vercel (production)
echo ALL pages will show maintenance screen after next redeploy.
echo.
set /p CONFIRM="Type YES to confirm: "
if /i not "!CONFIRM!"=="YES" (echo Cancelled. & goto MAIN_MENU)
call :CHECK_VERCEL_CLI
vercel env rm SITE_MAINTENANCE_MODE production --yes 2>nul
vercel env add SITE_MAINTENANCE_MODE production <<< "true" 2>nul
echo.
echo env var set. Redeploying now...
call :DO_REDEPLOY_INLINE
goto MAIN_MENU

REM -------------------------------------------------------
:DO_MAINTENANCE_OFF
echo.
echo ACTION: Remove SITE_MAINTENANCE_MODE from Vercel (production)
echo.
set /p CONFIRM="Type YES to confirm: "
if /i not "!CONFIRM!"=="YES" (echo Cancelled. & goto MAIN_MENU)
call :CHECK_VERCEL_CLI
vercel env rm SITE_MAINTENANCE_MODE production --yes 2>nul
echo.
echo env var removed. Redeploying now...
call :DO_REDEPLOY_INLINE
goto MAIN_MENU

REM -------------------------------------------------------
:DO_EMERGENCY_ON
echo.
echo *** EMERGENCY ON ***
echo This will set ALL three flags and redeploy ONCE:
echo   PAYMENTS_GLOBAL_PAUSED=true
echo   AI_GLOBAL_PAUSED=true
echo   SITE_MAINTENANCE_MODE=true
echo.
echo All checkout, AI and site pages will be blocked.
echo.
set /p CONFIRM="Type EMERGENCY to confirm: "
if /i not "!CONFIRM!"=="EMERGENCY" (echo Cancelled. & goto MAIN_MENU)
call :CHECK_VERCEL_CLI
echo Setting PAYMENTS_GLOBAL_PAUSED=true...
vercel env rm PAYMENTS_GLOBAL_PAUSED production --yes 2>nul
vercel env add PAYMENTS_GLOBAL_PAUSED production <<< "true" 2>nul
echo Setting AI_GLOBAL_PAUSED=true...
vercel env rm AI_GLOBAL_PAUSED production --yes 2>nul
vercel env add AI_GLOBAL_PAUSED production <<< "true" 2>nul
echo Setting SITE_MAINTENANCE_MODE=true...
vercel env rm SITE_MAINTENANCE_MODE production --yes 2>nul
vercel env add SITE_MAINTENANCE_MODE production <<< "true" 2>nul
echo.
echo All flags set. Redeploying now...
call :DO_REDEPLOY_INLINE
echo.
echo EMERGENCY ON complete. Site is in maintenance mode.
goto MAIN_MENU

REM -------------------------------------------------------
:DO_EMERGENCY_OFF
echo.
echo *** EMERGENCY OFF ***
echo This will REMOVE all three flags and redeploy:
echo   PAYMENTS_GLOBAL_PAUSED  (removed)
echo   AI_GLOBAL_PAUSED        (removed)
echo   SITE_MAINTENANCE_MODE   (removed)
echo.
set /p CONFIRM="Type RESUME to confirm: "
if /i not "!CONFIRM!"=="RESUME" (echo Cancelled. & goto MAIN_MENU)
call :CHECK_VERCEL_CLI
echo Removing PAYMENTS_GLOBAL_PAUSED...
vercel env rm PAYMENTS_GLOBAL_PAUSED production --yes 2>nul
echo Removing AI_GLOBAL_PAUSED...
vercel env rm AI_GLOBAL_PAUSED production --yes 2>nul
echo Removing SITE_MAINTENANCE_MODE...
vercel env rm SITE_MAINTENANCE_MODE production --yes 2>nul
echo.
echo All flags removed. Redeploying now...
call :DO_REDEPLOY_INLINE
echo.
echo EMERGENCY OFF complete. Site is back to normal.
goto MAIN_MENU

REM -------------------------------------------------------
:DO_REDEPLOY
echo.
echo ACTION: Trigger Vercel production redeploy
echo.
set /p CONFIRM="Type YES to confirm redeploy: "
if /i not "!CONFIRM!"=="YES" (echo Cancelled. & goto MAIN_MENU)
call :DO_REDEPLOY_INLINE
goto MAIN_MENU

REM -------------------------------------------------------
:DO_REDEPLOY_INLINE
call :CHECK_VERCEL_CLI
echo.
echo Running: vercel --prod --yes
cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"
vercel --prod --yes
echo.
echo Redeploy triggered. Wait 2-3 minutes then run option 1 to verify.
goto :EOF

REM -------------------------------------------------------
:CHECK_VERCEL_CLI
where vercel >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Vercel CLI not found. Install it with:
    echo   npm install -g vercel
    echo Then run: vercel login
    echo.
    echo Alternatively, make env var changes manually in:
    echo   https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables
    echo.
    pause
    goto MAIN_MENU
)
goto :EOF
