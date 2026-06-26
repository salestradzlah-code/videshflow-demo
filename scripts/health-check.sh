#!/bin/bash
# SettleMap Health Check — Mac/Linux
# Run: bash scripts/health-check.sh

HEALTH_URL="https://videshflow-demo.vercel.app/api/stripe/health"
EXPECTED_VERSION="V12.12.9"

echo ""
echo "========================================================"
echo " SettleMap Health Check"
echo " ${HEALTH_URL}"
echo "========================================================"
echo ""

# Fetch health endpoint
if ! command -v curl &> /dev/null; then
  echo "ERROR: curl not found. Install it with: brew install curl"
  exit 1
fi

RESPONSE=$(curl -s --max-time 10 "$HEALTH_URL")

if [ -z "$RESPONSE" ]; then
  echo "ERROR: No response from health endpoint. Site may be down."
  echo "Check Vercel: https://vercel.com/salestradzlah-codes-projects/videshflow-demo"
  exit 1
fi

# Parse key fields using python3 (available on all Macs)
python3 - <<EOF
import json, sys

data = json.loads('''$RESPONSE''')

def show(label, key, warn_if_true=False, warn_if_false=False):
    val = data.get(key, 'NOT FOUND')
    flag = ''
    if warn_if_true and val == True:
        flag = '  ⚠ WARNING'
    if warn_if_false and val == False:
        flag = '  ⚠ WARNING'
    print(f"  {label:<38} {str(val)}{flag}")

print("=== VERSION ===")
ver = data.get('fulfilmentVersion', 'unknown')
expected = '${EXPECTED_VERSION}'
match = '✓' if ver == expected else f'⚠ expected {expected}'
print(f"  fulfilmentVersion                      {ver}  {match}")

print("")
print("=== EMERGENCY FLAGS (all should be false) ===")
show("paymentsGlobalPauseActive", "paymentsGlobalPauseActive", warn_if_true=True)
show("maintenanceModeActive", "maintenanceModeActive", warn_if_true=True)
show("aiGlobalPauseActive", "aiGlobalPauseActive", warn_if_true=True)

print("")
print("=== CORE CONFIG (all should be true) ===")
show("stripeConfigured", "stripeConfigured", warn_if_false=True)
show("resendConfigured", "resendConfigured", warn_if_false=True)
show("adminTokenConfigured", "adminTokenConfigured", warn_if_false=True)
show("clientSecretExposureBlocked", "clientSecretExposureBlocked", warn_if_false=True)

print("")
print("=== V12.12.8 INCIDENT FIXES ===")
show("webhookEmailSenderFixed", "webhookEmailSenderFixed")
show("webhookEmailFailureNonFatal", "webhookEmailFailureNonFatal")
show("voiceGuideHardDisabled", "voiceGuideHardDisabled")
show("successPageFalseEmailClaimRemoved", "successPageFalseEmailClaimRemoved")
show("refundRequestApiRouteReady", "refundRequestApiRouteReady")
EOF

echo ""
echo "Full health JSON: ${HEALTH_URL}"
echo "Vercel dashboard: https://vercel.com/salestradzlah-codes-projects/videshflow-demo"
echo ""
