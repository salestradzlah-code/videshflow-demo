@echo off
echo === Add SETTLEMAP_ADMIN_TOKEN to Vercel ===
echo.

REM Generate a random 32-char token using PowerShell
for /f "delims=" %%T in ('powershell -NoProfile -Command "[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24)).Replace('+','').Replace('/','').Replace('=','').Substring(0,32)"') do set TOKEN=%%T

echo Generated token: %TOKEN%
echo.

REM Copy to clipboard
echo %TOKEN% | clip
echo Token copied to clipboard.
echo.

REM Try Vercel CLI first
vercel env add SETTLEMAP_ADMIN_TOKEN production 2>nul
if %errorlevel% equ 0 (
  echo Done via Vercel CLI.
  goto end
)

echo Vercel CLI not found — opening Vercel dashboard.
echo.
echo Steps in Vercel:
echo  1. Go to your project ^> Settings ^> Environment Variables
echo  2. Add:  Name = SETTLEMAP_ADMIN_TOKEN
echo           Value = (already in your clipboard)
echo           Environment = Production
echo  3. Click Save, then redeploy
echo.
start "" "https://vercel.com/dashboard"

:end
echo.
pause
