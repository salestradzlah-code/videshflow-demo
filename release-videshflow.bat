@echo off
setlocal

cd /d %~dp0
set LOG=release-log.txt

echo ================================ > %LOG%
echo VideshFlow Release Started >> %LOG%
echo Folder: %CD% >> %LOG%
echo ================================ >> %LOG%

echo Installing dependencies...
npm.cmd install --no-audit --no-fund >> %LOG% 2>&1
if errorlevel 1 goto fail

echo Running production build...
npm.cmd run build >> %LOG% 2>&1
if errorlevel 1 goto fail

echo Checking Git...
git status >> %LOG% 2>&1

echo Adding files...
git add . >> %LOG% 2>&1

echo Committing changes...
git commit -m "V5 SettleMap rebrand: brand rename, new route cards, interactive AI demo, feedback page, beta banner" >> %LOG% 2>&1

echo Pushing to GitHub...
git push >> %LOG% 2>&1
if errorlevel 1 goto fail

echo Release pushed successfully. Vercel will auto-deploy. >> %LOG%
echo Done. Check Vercel and GitHub.
start https://vercel.com
start https://github.com/salestradzlah-code/videshflow-demo
goto end

:fail
echo Release failed. Please upload release-log.txt to ChatGPT. >> %LOG%
echo Release failed. Check release-log.txt.
pause

:end
endlocal
