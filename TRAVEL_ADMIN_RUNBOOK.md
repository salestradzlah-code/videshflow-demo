# SettleMap Travel Admin Runbook
**For: Ashish and Ashu**
**Version: V12.12.9 — Updated for travel from Singapore to Bengaluru / Mumbai**

This document tells you everything you need to manage SettleMap while Ashish is travelling.
No coding knowledge is required for most tasks. Everything is done through a web browser.

---

## Quick Reference Links

| What | Link |
|------|------|
| Live site | https://videshflow-demo.vercel.app |
| Health check | https://videshflow-demo.vercel.app/api/stripe/health |
| Vercel dashboard | https://vercel.com/salestradzlah-codes-projects/videshflow-demo |
| Vercel env vars | https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables |
| Vercel deployments | https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments |
| Stripe dashboard | https://dashboard.stripe.com |
| GitHub repo | https://github.com/salestradzlah-code/videshflow-demo |

---

## A. How to Check If the Website Is Live

1. Open https://videshflow-demo.vercel.app in your browser.
2. If the homepage loads — the site is live.
3. If you see an error page — go to Section I (Rollback).

**Quick health check:** Open https://videshflow-demo.vercel.app/api/stripe/health
You should see a page full of `true` values. Key fields to look for:
- `"stripeWebhookEndpoint": "available"` — Stripe is connected
- `"paymentsGlobalPauseActive": false` — payments are running (false = running, true = paused)
- `"maintenanceModeActive": false` — site is not in maintenance mode

---

## B. How to Check Health

Open this URL in any browser:
```
https://videshflow-demo.vercel.app/api/stripe/health
```

The page shows all system flags. Everything should say `true` except:
- `paymentsGlobalPauseActive` — should be `false` (unless you paused payments)
- `maintenanceModeActive` — should be `false` (unless you turned on maintenance mode)
- `aiGlobalPauseActive` — should be `false` (unless you paused AI)

---

## C. How to Pause Payments (Emergency)

Use this when: something is wrong with payments and you want to stop new purchases immediately.

**This does NOT affect people who have already paid. It only stops NEW payments.**

**Steps:**
1. Go to https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables
2. Log in if needed (use the SettleMap Vercel account)
3. Find the variable called `PAYMENTS_GLOBAL_PAUSED`
4. Click Edit → change the value from `false` to `true` → Save
5. Go to https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments
6. Click the three dots (...) on the top "Production" deployment → click "Redeploy" → confirm
7. Wait 2 minutes → check health: `paymentsGlobalPauseActive` should now say `true`

**To re-enable payments:** Repeat the steps above but change the value back to `false`.

---

## D. How to Pause the AI Assistant

Use this when: the AI is giving wrong answers or you want to stop it temporarily.

**Steps:**
1. Go to Vercel env vars (same link as above)
2. Find `AI_GLOBAL_PAUSED`
3. Change from `false` to `true` → Save
4. Redeploy from the Deployments page
5. Check health: `aiGlobalPauseActive` should say `true`

---

## E. How to Turn On Maintenance Mode

Use this when: you want to show a "Site is under maintenance" message to all visitors.

**Steps:**
1. Go to Vercel env vars
2. Find `SITE_MAINTENANCE_MODE`
3. Change from `false` to `true` → Save
4. Redeploy
5. Check health: `maintenanceModeActive` should say `true`

---

## F. How to Check Stripe Payments

1. Go to https://dashboard.stripe.com
2. Log in with the SettleMap Stripe account
3. Click "Payments" in the left menu
4. You can see all transactions — successful, failed, pending
5. Click any payment to see details including customer email, amount, and status

**Test mode vs Live mode:** Make sure you are in the right mode. The toggle is at the top of the Stripe dashboard. For real customer payments, use Live mode.

---

## G. How to Refund Manually in Stripe

**Important:** SettleMap does NOT auto-refund. All refunds are done manually in Stripe.

**Steps:**
1. Go to https://dashboard.stripe.com → Payments
2. Find the payment you want to refund (search by customer email or payment ID)
3. Click on the payment
4. Click the "Refund" button (top right of the payment detail page)
5. Enter the amount (leave blank for full refund)
6. Add a reason (optional)
7. Click "Refund"

The customer will receive a refund to their original payment method within 5-10 business days.

**Note:** You cannot refund more than the original payment amount.

---

## H. How to Check Vercel Deployments

1. Go to https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments
2. You will see a list of all deployments
3. The one marked "Production" at the top is the live site
4. Green = successful. Red = failed. Blue = building.

---

## I. How to Roll Back to a Previous Deployment

Use this when: a new deployment broke something and you need to go back to the previous version.

**Steps:**
1. Go to https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments
2. Find the last deployment that was working (green, not the current one)
3. Click the three dots (...) on that deployment
4. Click "Redeploy"
5. Confirm — do NOT change any settings
6. Wait 2 minutes for it to go live
7. Check the site and health endpoint to confirm it is working

---

## J. What NOT to Do

- **Do not delete any environment variables** in Vercel — only change values
- **Do not delete any Stripe products or prices** — this will break checkout
- **Do not change the Stripe webhook URL** — payments will stop working
- **Do not change DNS settings** — the site will go offline
- **Do not commit .env.local to GitHub** — this contains secret keys
- **Do not share API keys or secret values** in email or WhatsApp
- **Do not run Stripe refunds for amounts the customer did not pay**
- **Do not create new Stripe products** without Ashish
- **Do not merge or delete branches on GitHub** without Ashish

---

## K. Who to Contact

- **Ashish (owner):** ashishabokil@gmail.com — WhatsApp for emergencies
- **Vercel support:** https://vercel.com/support (for deployment issues)
- **Stripe support:** https://support.stripe.com (for payment issues)
- **Resend support:** https://resend.com (for email delivery issues)

---

*Last updated: V12.12.9 — Travel-ready edition*
