@echo off
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
git log --oneline -3
git push origin main
echo.
echo === V12.12.6 pushed. Vercel deploying... ===
echo.
echo BEFORE retesting, add this env var in Vercel:
echo   Key:   SETTLEMAP_QA_EMAIL
echo   Value: sales.tradzlah@gmail.com
echo   Env:   Production and Preview
echo.
echo URL: https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables
echo.
echo Then redeploy, wait 2 min, rerun settlemap-admin-qa-fulfilment.bat
pause
