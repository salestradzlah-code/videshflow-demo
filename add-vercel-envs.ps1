# V12.9 — Add new Vercel environment variables for SettleMap Student Move Pack
# Run this from PowerShell in the project folder, or double-click add-vercel-envs.bat

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SettleMap V12.9 — Adding Vercel Environment Variables" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Check Vercel CLI is installed
try {
    $versionOutput = & vercel --version 2>&1
    Write-Host "Vercel CLI found: $versionOutput" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Vercel CLI not found. Install it with: npm install -g vercel" -ForegroundColor Red
    Write-Host "Then run: vercel login" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Adding NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED=true ..." -ForegroundColor Yellow
"true" | vercel env add NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED production --yes 2>&1
"true" | vercel env add NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED preview --yes 2>&1
"true" | vercel env add NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED development --yes 2>&1

Write-Host "Adding STUDENT_PACK_CHECKOUT_ENABLED=true ..." -ForegroundColor Yellow
"true" | vercel env add STUDENT_PACK_CHECKOUT_ENABLED production --yes 2>&1
"true" | vercel env add STUDENT_PACK_CHECKOUT_ENABLED preview --yes 2>&1
"true" | vercel env add STUDENT_PACK_CHECKOUT_ENABLED development --yes 2>&1

Write-Host "Adding STUDENT_PACK_AUTOFULFILL_ENABLED=true ..." -ForegroundColor Yellow
"true" | vercel env add STUDENT_PACK_AUTOFULFILL_ENABLED production --yes 2>&1
"true" | vercel env add STUDENT_PACK_AUTOFULFILL_ENABLED preview --yes 2>&1
"true" | vercel env add STUDENT_PACK_AUTOFULFILL_ENABLED development --yes 2>&1

Write-Host ""
Write-Host "All 3 variables added. Now triggering redeploy..." -ForegroundColor Cyan
vercel --prod --yes 2>&1

Write-Host ""
Write-Host "Done! Check https://settlemap.app/api/stripe/health to verify." -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
