# SettleMap — Admin Handover for Ashu
**Prepared by: Ashish**
**Date: June 2026**
**While Ashish is travelling: Singapore → Bengaluru → Mumbai**

---

## A. What Is SettleMap?

SettleMap is a website that helps people plan international moves — for example, from India to Singapore, UK, Germany, or Australia.

Customers can buy a "pack" on the website that gives them a detailed checklist and guide for their move. There are two main packs:
- **Student Move Pack** — for students moving abroad (S$19)
- **Premium Relocation Pack** — for families and professionals (S$49)

The website runs on the internet. Ashish manages it. You do not need to understand the code.

**The website:** https://videshflow-demo.vercel.app
**Support email:** support@settlemap.app

---

## B. How to Check If the Site Is Live

1. Open https://videshflow-demo.vercel.app in Chrome
2. If the homepage loads — the site is working
3. If you see an error — message Ashish immediately

**Health check (more detailed):**
Open: https://videshflow-demo.vercel.app/api/stripe/health
You should see a page with many lines saying `true`.
If you see red text or the page doesn't load — the site has a problem.

Key things to look for:
- `"paymentsGlobalPauseActive": false` — means payments are running (good)
- `"maintenanceModeActive": false` — means the site is open (good)

---

## C. How to Pause Payments

Only do this if Ashish tells you to, OR if something looks very wrong with payments.

1. Open Chrome and go to: https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables
2. Log in with the SettleMap Vercel account (ask Ashish for the password)
3. Find the row that says `PAYMENTS_GLOBAL_PAUSED`
4. Click **Edit** next to it
5. Change the value from `false` to `true`
6. Click **Save**
7. Go to: https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments
8. Click the three dots (...) next to the top "Production" deployment
9. Click **Redeploy** → click **Confirm**
10. Wait 2 minutes
11. Check the health page — `paymentsGlobalPauseActive` should now say `true`

**To turn payments back on:** do the same steps but change the value to `false`.

---

## D. How to Check Stripe Transactions

Stripe is the payment system used by SettleMap. Every customer payment appears here.

1. Go to https://dashboard.stripe.com
2. Log in with the SettleMap Stripe account (ask Ashish for the password)
3. Click **Payments** in the left menu
4. You will see a list of all payments
5. Green = successful. Red = failed or refunded.
6. Click any payment to see the customer's name, email, amount, and date

---

## E. How to Refund Manually in Stripe

**Important:** Refunds must always be done manually by you. The website does NOT automatically refund anyone.

A customer refund request will come by email to support@settlemap.app.

**Steps to refund:**
1. Log in to https://dashboard.stripe.com
2. Click **Payments** in the left menu
3. Search for the customer by their email address
4. Click on their payment
5. Click the **Refund** button (top right)
6. For a full refund, leave the amount as-is
7. Click **Refund**

The customer will get their money back to their card in 5-10 business days.

**Check with Ashish before refunding if:**
- The amount is over S$50
- The customer is making a complaint that seems unusual
- You are not sure if the refund is valid

---

## F. How to Check Vercel Deployment

Vercel is where the website is hosted. Think of it as the server.

1. Go to https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments
2. Log in if needed
3. The top entry marked "Production" is the live version of the site
4. Green circle = working. Red = failed.

If the top deployment is red:
1. Find the most recent green deployment in the list
2. Click the three dots (...) next to it
3. Click **Redeploy** → confirm
4. Wait 2 minutes → check the site again

---

## G. What NOT to Touch

**Do NOT do any of the following without talking to Ashish first:**

- Delete anything in Vercel (env variables, deployments, or the project itself)
- Delete or change anything in the Stripe account (products, prices, webhooks)
- Change DNS or domain settings
- Share any passwords or secret keys with anyone
- Respond to customer emails promising refunds, legal action, or compensation without Ashish's approval
- Make any purchases or payments on behalf of the business
- Add new users to Vercel or Stripe

---

## H. Emergency Message Template to Send Ashish

If something goes wrong and you cannot reach Ashish by WhatsApp, send this by email to ashishabokil@gmail.com:

---

**Subject: SETTLEMAP URGENT — [brief description]**

Hi Ashish,

There is an issue with SettleMap. Here is what I can see:

**Time (Singapore time):** [time and date]

**What happened:** [describe what you noticed]

**Site status:** [is the homepage loading or not?]

**Health check result:** [copy the URL and what it shows — especially paymentsGlobalPauseActive and maintenanceModeActive]

**Steps I have taken:** [list what you did, if anything]

**What I need from you:** [what decision or action do you need Ashish to make?]

Please reply or call as soon as you can.

Ashu

---

## I. Useful Links Summary

| What | Link |
|------|------|
| SettleMap website | https://videshflow-demo.vercel.app |
| Health check | https://videshflow-demo.vercel.app/api/stripe/health |
| Vercel dashboard | https://vercel.com/salestradzlah-codes-projects/videshflow-demo |
| Vercel env vars | https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables |
| Vercel deployments | https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments |
| Stripe dashboard | https://dashboard.stripe.com |
| Support email | support@settlemap.app |
| Ashish email | ashishabokil@gmail.com |

---

*This document was prepared for the trip: Singapore → Bengaluru → Mumbai, June 2026.*
*Always check with Ashish before making any financial or infrastructure decisions.*
