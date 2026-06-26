@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap Health Check
echo  https://videshflow-demo.vercel.app/api/stripe/health
echo ========================================================
echo.

set HEALTH_URL=https://videshflow-demo.vercel.app/api/stripe/health

echo Fetching health endpoint...
echo.

powershell -NoProfile -Command ^
  "try { $r = Invoke-RestMethod -Uri '%HEALTH_URL%' -Method Get; " ^
  "Write-Host '=== VERSION ==='; " ^
  "Write-Host ('fulfilmentVersion:             ' + $r.fulfilmentVersion); " ^
  "Write-Host ''; " ^
  "Write-Host '=== EMERGENCY FLAGS ==='; " ^
  "Write-Host ('maintenanceModeActive:         ' + $r.maintenanceModeActive); " ^
  "Write-Host ('paymentsGlobalPauseActive:     ' + $r.paymentsGlobalPauseActive); " ^
  "Write-Host ('aiGlobalPauseActive:           ' + $r.aiGlobalPauseActive); " ^
  "Write-Host ''; " ^
  "Write-Host '=== EMERGENCY CONTROLS READY ==='; " ^
  "Write-Host ('maintenanceModeControlReady:   ' + $r.maintenanceModeControlReady); " ^
  "Write-Host ('paymentsGlobalPauseReady:      ' + $r.paymentsGlobalPauseControlReady); " ^
  "Write-Host ('aiGlobalPauseReady:            ' + $r.aiGlobalPauseControlReady); " ^
  "Write-Host ''; " ^
  "Write-Host '=== V12.12.4 FLAGS ==='; " ^
  "Write-Host ('qaTestFulfilmentRouteReady:    ' + $r.qaTestFulfilmentRouteReady); " ^
  "Write-Host ('qaTestFulfilmentProtected:     ' + $r.qaTestFulfilmentAdminProtected); " ^
  "Write-Host ('documentReadinessChecklist:    ' + $r.documentReadinessChecklistReady); " ^
  "Write-Host ('documentChecklistBrowserOnly:  ' + $r.documentChecklistBrowserOnly); " ^
  "Write-Host ('voiceGuideCopyVerified:        ' + $r.voiceGuideCopyVerified); " ^
  "Write-Host ('vercelAnalyticsWired:          ' + $r.vercelAnalyticsWired); " ^
  "Write-Host ('v1212x4RegressionSafe:         ' + $r.v1212x4RegressionSafe); " ^
  "Write-Host ''; " ^
  "Write-Host '=== CORE CONFIG ==='; " ^
  "Write-Host ('stripeConfigured:              ' + $r.stripeConfigured); " ^
  "Write-Host ('resendConfigured:              ' + $r.resendConfigured); " ^
  "Write-Host ('adminTokenConfigured:          ' + $r.adminTokenConfigured); " ^
  "Write-Host ('clientSecretExposureBlocked:   ' + $r.clientSecretExposureBlocked); " ^
  "Write-Host ('addonsStillSafelyOff:          ' + $r.addonsStillSafelyOff); " ^
  "Write-Host ('noUploadOrOcrAdded:            ' + $r.noUploadOrOcrAdded); " ^
  "Write-Host ('noLoginOrDatabaseAdded:        ' + $r.noLoginOrDatabaseAdded); " ^
  "Write-Host ''; " ^
  "$warn = @(); " ^
  "if ($r.maintenanceModeActive)       { $warn += 'MAINTENANCE MODE IS ON' }; " ^
  "if ($r.paymentsGlobalPauseActive)   { $warn += 'PAYMENTS ARE PAUSED' }; " ^
  "if ($r.aiGlobalPauseActive)         { $warn += 'AI ASSISTANT IS PAUSED' }; " ^
  "if ($r.fulfilmentVersion -ne 'V12.12.8') { $warn += ('VERSION: expected V12.12.8, got ' + $r.fulfilmentVersion) };" ^
  "if (-not $r.stripeConfigured)       { $warn += 'Stripe not configured' }; " ^
  "if (-not $r.resendConfigured)       { $warn += 'Resend not configured' }; " ^
  "if (-not $r.adminTokenConfigured)   { $warn += 'Admin token not configured' }; " ^
  "if (-not $r.clientSecretExposureBlocked) { $warn += 'SECRET KEY EXPOSURE RISK' }; " ^
  "if ($warn.Count -gt 0) { foreach ($w in $warn) { Write-Host ('WARNING: ' + $w) } } " ^
  "else { Write-Host 'All checks passed. No warnings.' }; " ^
  "} catch { Write-Host ('ERROR: ' + $_.Exception.Message) }"

echo.
echo ========================================================
echo  Done.
echo ========================================================
echo.
pause
