# SettleMap — Mac Setup Guide
**For: Ashish travelling with MacBook**
**GitHub repo:** salestradzlah-code/videshflow-demo

This guide gets you from a fresh MacBook to a working SettleMap development environment.
You do not need to complete local setup to manage the live site — see Section H for browser-only admin.

---

## A. Install Chrome

1. Go to https://www.google.com/chrome
2. Download and install Chrome
3. Sign in to your Google account to sync bookmarks and extensions

---

## B. Install GitHub Desktop

GitHub Desktop lets you push and pull code without using Terminal.

1. Go to https://desktop.github.com
2. Download and install GitHub Desktop
3. Open it → Sign in to your GitHub account (salestradzlah-code)
4. You will clone the repo in Step E

---

## C. Install VS Code

VS Code is the code editor used for SettleMap.

1. Go to https://code.visualstudio.com
2. Download the Mac version (Apple Silicon if your Mac has M1/M2/M3, Intel if older)
3. Install it — drag to Applications folder
4. Open VS Code → install these extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features (built-in)

---

## D. Install Node LTS

SettleMap requires Node.js version 22.

**Option 1 — Homebrew (recommended):**
1. Open Terminal (press Cmd+Space, type Terminal)
2. Install Homebrew if not installed:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Install Node 22:
   ```
   brew install node@22
   ```
4. Verify: `node --version` should show v22.x.x

**Option 2 — Direct download:**
1. Go to https://nodejs.org
2. Download the LTS version (22.x)
3. Run the installer

---

## E. Clone the GitHub Repo

**Using GitHub Desktop (easiest):**
1. Open GitHub Desktop
2. Click File → Clone Repository
3. Search for `videshflow-demo` or paste:
   `https://github.com/salestradzlah-code/videshflow-demo`
4. Choose where to save it (e.g. `~/Documents/videshflow-demo`)
5. Click Clone

**Using Terminal:**
```bash
cd ~/Documents
git clone https://github.com/salestradzlah-code/videshflow-demo.git
cd videshflow-demo
```

---

## F. Copy Environment Variables

The `.env.local` file contains secret keys and is NOT in GitHub (for security).
You must create it manually on the Mac.

1. Open the cloned folder in VS Code
2. Create a new file called `.env.local` in the root folder
3. Go to Vercel Dashboard → Project Settings → Environment Variables
4. Copy each variable and its value into `.env.local`
5. Use `.env.local.example` as a guide for which variables to include

**Never commit `.env.local` to GitHub.**

---

## G. Run npm install and TypeScript Check

Open Terminal and run:

```bash
# Navigate to your project folder
cd ~/Documents/videshflow-demo

# Install all dependencies
npm install

# Check for TypeScript errors (should show no src/ errors)
npx tsc --noEmit 2>&1 | grep "^src/"

# Start the development server
npm run dev
```

Then open http://localhost:3000 in Chrome to see the site running locally.

---

## H. Work Through Browser Only (No Local Setup Needed)

If you do not have time to set up the Mac locally, you can still manage everything through your browser:

### Managing the live site (Vercel):
- **See health:** https://videshflow-demo.vercel.app/api/stripe/health
- **Pause payments / AI / maintenance mode:** https://vercel.com/salestradzlah-codes-projects/videshflow-demo/settings/environment-variables
- **See deployments / rollback:** https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments

### Making code changes (GitHub web editor):
1. Go to https://github.com/salestradzlah-code/videshflow-demo
2. Navigate to the file you want to edit
3. Click the pencil icon (Edit) — top right of the file view
4. Make your change
5. Scroll down → write a commit message → click "Commit changes"
6. Vercel will automatically deploy the new code (wait 2-3 minutes)

### Using GitHub Codespaces (full VS Code in browser — no Mac setup needed):
See the Codespaces section in this repo's README.

---

## I. Pushing Changes from Mac

After making code changes locally on the Mac:

**Using GitHub Desktop:**
1. Open GitHub Desktop → your changes appear automatically
2. Write a commit message (e.g. "V12.12.10: description of change")
3. Click "Commit to main"
4. Click "Push origin"
5. Vercel deploys automatically — check https://vercel.com/salestradzlah-codes-projects/videshflow-demo/deployments

**Using Terminal:**
```bash
cd ~/Documents/videshflow-demo
git add -A
git commit -m "V12.12.10: your change description here"
git push origin main
```

---

## J. Useful Commands

```bash
# Start local dev server
npm run dev

# Check TypeScript (no src/ errors = good)
npx tsc --noEmit 2>&1 | grep "^src/"

# Pull latest changes from GitHub
git pull origin main

# See what changed
git status

# See recent commits
git log --oneline -5
```

---

*Last updated: V12.12.9 — Travel-ready edition*
