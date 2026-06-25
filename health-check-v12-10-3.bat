@echo off
echo === Health check V12.10.3 ===
curl -s "https://settlemap.app/api/stripe/health?t=v12-10-3" | python -m json.tool
pause
