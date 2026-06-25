@echo off
echo === Health check V12.11.1 ===
powershell -Command "Invoke-RestMethod -Uri 'https://settlemap.app/api/stripe/health?t=v12-11-1' | ConvertTo-Json"
pause
