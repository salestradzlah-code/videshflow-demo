@echo off
echo === Health check V12.10.3 ===
powershell -Command "Invoke-RestMethod -Uri 'https://settlemap.app/api/stripe/health?t=v12-10-3' | ConvertTo-Json"
pause
