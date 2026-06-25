@echo off
echo === SettleMap Health Check V12.12.2 ===
echo Expected: fulfilmentVersion V12.12.2, security hardening true, Premium/Voice activation-ready, add-ons safely off
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $h = Invoke-RestMethod -Uri 'https://settlemap.app/api/stripe/health?t=v12-12-2' -Headers @{'Cache-Control'='no-cache'}; $h | ConvertTo-Json -Depth 8; $required = @('securityHeadersConfigured','stripeWebhookSignatureVerified','paymentSuccessSessionGuardReady','serverSideProductValidationReady','clientSecretExposureBlocked','aiAssistantSecurityChecked','aiAssistantFallbackReady','documentUploadStillDisabled','premiumActivationToggleReady','voiceGuideActivationToggleReady','premiumCanActivate','voiceGuideCanActivate','addonsStillSafelyOff','v12122RegressionSafe'); $fail = @(); if ($h.fulfilmentVersion -ne 'V12.12.2') { $fail += 'fulfilmentVersion=' + $h.fulfilmentVersion }; foreach ($name in $required) { $prop = $h.PSObject.Properties[$name]; if ($null -eq $prop) { $fail += 'missing ' + $name } elseif (-not [bool]$prop.Value) { $fail += 'false ' + $name } }; if ($fail.Count -gt 0) { Write-Host ''; Write-Host 'Health check failed:' -ForegroundColor Red; $fail | ForEach-Object { Write-Host $_ -ForegroundColor Red }; exit 1 }; Write-Host ''; Write-Host 'V12.12.2 health check passed.' -ForegroundColor Green"
if errorlevel 1 (
  echo.
  echo Health check failed.
  pause
  exit /b 1
)
pause
