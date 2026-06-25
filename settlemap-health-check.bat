@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap Health Check
echo  https://settlemap.app/api/stripe/health
echo ========================================================
echo.

where curl >nul 2>&1
if errorlevel 1 (
    echo ERROR: curl is not available. Install curl and try again.
    pause
    exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
    where python3 >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Python is not available. Install Python and try again.
        pause
        exit /b 1
    )
    set PYTHON=python3
) else (
    set PYTHON=python
)

set HEALTH_URL=https://settlemap.app/api/stripe/health

echo Fetching health endpoint...
echo.

curl -s -o "%TEMP%\settlemap_health.json" -w "HTTP %%{http_code}" "%HEALTH_URL%" > "%TEMP%\settlemap_http_code.txt" 2>&1
set /p HTTP_CODE=<"%TEMP%\settlemap_http_code.txt"
echo HTTP Status: %HTTP_CODE%
echo.

%PYTHON% -c ^
"import json, sys; ^
raw = open(r'%TEMP%\settlemap_health.json').read(); ^
d = json.loads(raw); ^
ver = d.get('fulfilmentVersion', 'MISSING'); ^
print('=== VERSION ==='); ^
print('fulfilmentVersion:', ver); ^
print(); ^
print('=== EMERGENCY FLAGS ==='); ^
print('maintenanceModeActive:       ', d.get('maintenanceModeActive', 'NOT SET')); ^
print('paymentsGlobalPauseActive:   ', d.get('paymentsGlobalPauseActive', 'NOT SET')); ^
print('aiGlobalPauseActive:         ', d.get('aiGlobalPauseActive', 'NOT SET')); ^
print(); ^
print('=== EMERGENCY CONTROLS READY ==='); ^
print('maintenanceModeControlReady: ', d.get('maintenanceModeControlReady', 'NOT SET')); ^
print('paymentsGlobalPauseReady:    ', d.get('paymentsGlobalPauseControlReady', 'NOT SET')); ^
print('aiGlobalPauseReady:          ', d.get('aiGlobalPauseControlReady', 'NOT SET')); ^
print(); ^
print('=== V12.12.4 FLAGS ==='); ^
print('qaTestFulfilmentRouteReady:  ', d.get('qaTestFulfilmentRouteReady', 'NOT SET')); ^
print('qaTestFulfilmentAdminProtected:', d.get('qaTestFulfilmentAdminProtected', 'NOT SET')); ^
print('documentReadinessChecklist:  ', d.get('documentReadinessChecklistReady', 'NOT SET')); ^
print('documentChecklistBrowserOnly:', d.get('documentChecklistBrowserOnly', 'NOT SET')); ^
print('voiceGuideCopyVerified:      ', d.get('voiceGuideCopyVerified', 'NOT SET')); ^
print('vercelAnalyticsWired:        ', d.get('vercelAnalyticsWired', 'NOT SET')); ^
print('v1212x4RegressionSafe:       ', d.get('v1212x4RegressionSafe', 'NOT SET')); ^
print(); ^
print('=== CORE CONFIG ==='); ^
print('stripeConfigured:            ', d.get('stripeConfigured', 'NOT SET')); ^
print('resendConfigured:            ', d.get('resendConfigured', 'NOT SET')); ^
print('adminTokenConfigured:        ', d.get('adminTokenConfigured', 'NOT SET')); ^
print('clientSecretExposureBlocked: ', d.get('clientSecretExposureBlocked', 'NOT SET')); ^
print('addonsStillSafelyOff:        ', d.get('addonsStillSafelyOff', 'NOT SET')); ^
print('noUploadOrOcrAdded:          ', d.get('noUploadOrOcrAdded', 'NOT SET')); ^
print('noLoginOrDatabaseAdded:      ', d.get('noLoginOrDatabaseAdded', 'NOT SET')); ^
print(); ^
warn = []; ^
mm = d.get('maintenanceModeActive', False); ^
pp = d.get('paymentsGlobalPauseActive', False); ^
ap = d.get('aiGlobalPauseActive', False); ^
mm and warn.append('MAINTENANCE MODE IS ON'); ^
pp and warn.append('PAYMENTS ARE PAUSED'); ^
ap and warn.append('AI ASSISTANT IS PAUSED'); ^
ver != 'V12.12.4' and warn.append(f'VERSION MISMATCH: expected V12.12.4, got {ver}'); ^
not d.get('stripeConfigured') and warn.append('Stripe not configured'); ^
not d.get('resendConfigured') and warn.append('Resend not configured'); ^
not d.get('adminTokenConfigured') and warn.append('Admin token not configured'); ^
not d.get('clientSecretExposureBlocked') and warn.append('SECRET KEY EXPOSURE RISK'); ^
[print('WARNING:', w) for w in warn] if warn else print('All checks passed. No warnings.') ^
" 2>&1

echo.
echo ========================================================
echo  Done. Check warnings above if any.
echo ========================================================
echo.
pause
