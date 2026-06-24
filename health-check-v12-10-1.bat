@echo off
echo === SettleMap Health Check V12.10.1 ===
echo.
echo Fetching https://settlemap.app/api/stripe/health ...
echo.
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'https://settlemap.app/api/stripe/health' -UseBasicParsing; $r.Content | ConvertFrom-Json | Format-List } catch { Write-Host 'ERROR: ' $_.Exception.Message }"
echo.
echo Expected: fulfilmentVersion V12.10.1, all keys true
echo.
pause
