@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.13 — Remove stray route starter kit file
echo ========================================================
echo.

cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

echo Checking for stray file...
if exist "View route starter kit" (
    echo Found: "View route starter kit" — deleting...
    del /f "View route starter kit"
    echo Deleted.
) else (
    echo File not found — nothing to delete.
)

if exist ".git\index.lock" (
    echo Removing stale git index.lock...
    del /f ".git\index.lock"
)

git add -A
git status --short

echo.
git commit -m "V12.12.13 remove accidental stray route starter kit file"

git push origin main

echo.
echo ========================================================
echo  Done. Vercel will rebuild in 2-3 minutes.
echo  Check: https://settlemap.app/api/stripe/health?v=12.12.13
echo  Look for: fulfilmentVersion = V12.12.13
echo             strayRouteStarterKitFileRemoved = true
echo             paymentsGlobalPauseActive = true
echo ========================================================
echo.
pause
