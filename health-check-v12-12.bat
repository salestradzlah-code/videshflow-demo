@echo off
echo === Health check V12.12 ===
powershell -Command "Invoke-RestMethod -Uri 'https://settlemap.app/api/stripe/health?t=v12-12' | ConvertTo-Json"
pause
