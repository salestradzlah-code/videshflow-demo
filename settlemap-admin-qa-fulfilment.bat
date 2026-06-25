@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================================
echo  SettleMap Admin QA Fulfilment Test
echo  Sends test packs to: hellosettlemap@gmail.com
echo  No Stripe charge. Admin token required.
echo ========================================================
echo.

where curl >nul 2>&1
if errorlevel 1 (
    echo ERROR: curl is not available. Install curl and try again.
    pause
    exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
    where python3 >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Python is not available. Install Python and try again.
        pause
        exit /b 1
    )
    set PYTHON=python3
) else (
    set PYTHON=python
)

set BASE_URL=https://settlemap.app

REM -------------------------------------------------------
REM  Prompt for admin token (hidden input not available in
REM  standard cmd, so just prompt — do not store in env vars)
REM -------------------------------------------------------
echo Enter your SETTLEMAP_ADMIN_TOKEN (the value from Vercel, not the variable name):
set /p ADMIN_TOKEN="Token: "
echo.

if "!ADMIN_TOKEN!"=="" (
    echo ERROR: Admin token cannot be empty.
    pause
    exit /b 1
)

REM -------------------------------------------------------
REM  Product selection
REM -------------------------------------------------------
echo Select product to test:
echo   1. all                     (sends all 3 products)
echo   2. student_move_pack
echo   3. premium_relocation_pack
echo   4. voice_guide
echo.
set /p PRODUCT_CHOICE="Enter 1-4 [default: 1]: "

if "!PRODUCT_CHOICE!"=="2" set PRODUCT=student_move_pack
if "!PRODUCT_CHOICE!"=="3" set PRODUCT=premium_relocation_pack
if "!PRODUCT_CHOICE!"=="4" set PRODUCT=voice_guide
if not defined PRODUCT set PRODUCT=all

echo.
echo Sending QA test for product: !PRODUCT!
echo Target email:  hellosettlemap@gmail.com
echo Endpoint:      !BASE_URL!/api/admin/qa-test-fulfilment
echo.

curl -s -X POST ^
  -H "Authorization: Bearer !ADMIN_TOKEN!" ^
  -H "Content-Type: application/json" ^
  -d "{\"product\": \"!PRODUCT!\"}" ^
  -o "%TEMP%\settlemap_qa_result.json" ^
  -w "HTTP %%{http_code}" ^
  "!BASE_URL!/api/admin/qa-test-fulfilment" > "%TEMP%\settlemap_qa_code.txt" 2>&1

set /p HTTP_CODE=<"%TEMP%\settlemap_qa_code.txt"
echo HTTP Status: !HTTP_CODE!
echo.

%PYTHON% -c ^
"import json, sys; ^
raw = open(r'%TEMP%\settlemap_qa_result.json').read(); ^
print('Raw response:', raw[:500]); ^
print(); ^
try: ^
    d = json.loads(raw); ^
    print('sentTo:     ', d.get('sentTo', 'N/A')); ^
    print('sentAt:     ', d.get('sentAt', 'N/A')); ^
    print('product:    ', d.get('product', 'N/A')); ^
    print('allSuccess: ', d.get('allSuccess', 'N/A')); ^
    print('anySuccess: ', d.get('anySuccess', 'N/A')); ^
    print(); ^
    print('=== Per-product results ==='); ^
    results = d.get('results', []); ^
    [print(f'{r[\"product\"]}: {\"OK\" if r[\"success\"] else \"FAILED - \" + str(r.get(\"error\", \"\"))}') for r in results]; ^
    print(); ^
    d.get('error') and print('ERROR:', d['error']) ^
except Exception as e: ^
    print('Could not parse JSON:', e) ^
" 2>&1

echo.
if "!HTTP_CODE!"=="200" (
    echo RESULT: All products sent successfully. Check hellosettlemap@gmail.com.
) else if "!HTTP_CODE!"=="207" (
    echo RESULT: Partial success. Some products failed. Check results above.
) else if "!HTTP_CODE!"=="401" (
    echo RESULT: Unauthorized. Check your admin token.
) else if "!HTTP_CODE!"=="503" (
    echo RESULT: Service unavailable. Resend or admin token not configured in Vercel.
) else (
    echo RESULT: Unexpected HTTP status !HTTP_CODE!. Check output above.
)

echo.
echo ========================================================
pause
