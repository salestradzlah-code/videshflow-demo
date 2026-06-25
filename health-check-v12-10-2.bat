@echo off
echo === SettleMap Health Check V12.10.2 ===
echo.
echo Fetching https://settlemap.app/api/stripe/health?t=v12-10-2 ...
echo.
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'https://settlemap.app/api/stripe/health?t=v12-10-2' -UseBasicParsing; $r.Content | ConvertFrom-Json | Format-List } catch { Write-Host 'ERROR: ' $_.Exception.Message }"
echo.
echo Expected: fulfilmentVersion V12.10.2, successPageGuardReady true, homepagePaymentCopyReady true
echo.
pause
