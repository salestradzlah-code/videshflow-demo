@echo off
echo === SettleMap Health Check V12.12 ===
echo Expected: fulfilmentVersion V12.12, paidProductConfigReady true, researchLinksRegistryReady true, providerReferencePolicyReady true
echo.
powershell -NoProfile -Command "Invoke-RestMethod -Uri 'https://settlemap.app/api/stripe/health?t=v12-12' | ConvertTo-Json -Depth 8"
pause
