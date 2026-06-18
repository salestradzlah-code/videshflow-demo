Set-Location "C:\Users\ashis\Documents\videshflow-executive-demo-platform\videshflow-mvp"
Start-Transcript -Path ".\deploy-log.txt" -Force

if (-not (Test-Path ".\package.json") -or -not (Test-Path ".\src")) {
    Write-Host "WRONG FOLDER: package.json or src not found here. Stopping." -ForegroundColor Red
    Stop-Transcript
    exit 1
}
Write-Host "Folder check passed." -ForegroundColor Green

@"
node_modules/
.next/
.vercel/
out/
dist/
.env
.env.*
*.log
deploy-log.txt
.DS_Store
"@ | Set-Content -Path ".\.gitignore" -Encoding utf8
Write-Host ".gitignore written." -ForegroundColor Green

npm.cmd install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install FAILED. See deploy-log.txt." -ForegroundColor Red
    Stop-Transcript
    exit 1
}
npm.cmd run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED. Fix the error shown above, then re-run. Full log in deploy-log.txt." -ForegroundColor Red
    Stop-Transcript
    exit 1
}
Write-Host "Build passed." -ForegroundColor Green

git init
git config user.name "Ashish Bokil"
git config user.email "ashishabokil@gmail.com"

git rm -r --cached -q . 2>$null
git add .
Write-Host "`nStaged files (must NOT include node_modules / .next / .vercel / deploy-log.txt):" -ForegroundColor Cyan
git status --short

$bad = git status --short | Select-String -Pattern "node_modules|\.next/|\.vercel/|deploy-log\.txt"
if ($bad) {
    Write-Host "PROBLEM: ignored files are staged. Fix .gitignore, then re-run." -ForegroundColor Red
    Stop-Transcript
    exit 1
}
Write-Host "Staging looks clean." -ForegroundColor Green

git commit -m "Initial VideshFlow executive demo"

git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/salestradzlah-code/videshflow-demo.git
git remote -v

Write-Host "`nPushing to GitHub. If a login or browser window appears, complete it." -ForegroundColor Yellow
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "PUSH FAILED." -ForegroundColor Red
    Write-Host "  1. Not authenticated -> finish the GitHub login prompt and re-run." -ForegroundColor Red
    Write-Host "  2. Remote already has a commit -> git pull --rebase origin main  then  git push -u origin main" -ForegroundColor Red
    Stop-Transcript
    exit 1
}
Write-Host "Push complete." -ForegroundColor Green

Stop-Transcript
Write-Host "Transcript saved to: $(Join-Path (Get-Location) 'deploy-log.txt')"
