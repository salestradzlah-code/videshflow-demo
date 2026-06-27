@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap V12.12.12 — Customer Copy Polish
echo  Changes:
echo    - RouteWizard: "Real stories" renamed to "Common move scenarios"
echo    - RouteWizard: Architecture section rewritten (customer-friendly)
echo    - RouteWizard: "Open route starter kit" -> "View route starter kit"
echo    - RouteWizard: "Limited AI pilot" eyebrow removed
echo    - RouteWizard: RouteReadyCard placeholder copy cleaned
echo    - Health: bumped to V12.12.12 + 10 new customer copy flags
echo    - Payments remain paused. Voice Guide remains disabled.
echo ========================================================
echo.

cd /d "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"

if exist ".git\index.lock" (
    echo Removing stale git index.lock...
    del /f ".git\index.lock"
)

git add -A
git status --short

echo.
git commit -m "V12.12.12 polish customer copy and remove internal architecture language"

git push origin main

echo.
echo ========================================================
echo  Done. Vercel will rebuild in 2-3 minutes.
echo  Check: https://videshflow-demo.vercel.app/api/stripe/health
echo  Look for: fulfilmentVersion = V12.12.12
echo             customerCopyPolished = true
echo             fakeStoriesRenamed = true
echo             internalArchitectureCopyRemoved = true
echo             paymentsStillPaused = true
echo ========================================================
echo.
pause
