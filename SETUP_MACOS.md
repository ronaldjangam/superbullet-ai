# 🎯 Pre-Deployment Setup for macOS

You need to install Node.js before deploying. Here are the easiest methods:

---

## ✅ Recommended: Install via Homebrew

### Step 1: Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Node.js

```bash
# Install Node.js LTS (Long Term Support)
brew install node@18

# Verify installation
node --version
npm --version
```

---

## Alternative: Official Installer

1. Download from: https://nodejs.org/en/download/
2. Choose **macOS Installer (.pkg)**
3. Download the **LTS version** (18.x or 20.x)
4. Run the installer
5. Follow the installation wizard

### Verify Installation

```bash
node --version  # Should show v18.x.x or v20.x.x
npm --version   # Should show 9.x.x or 10.x.x
```

---

## Quick Start After Node.js Installation

Once Node.js is installed, run:

```bash
# 1. Run the automated deployment helper
./deploy-vercel.sh

# OR follow manual steps:

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Test build
npm run build

# 5. Start development server
npm run dev
```

---

## What You'll Need

Before deploying to Vercel:

1. ✅ **Node.js** (installing now)
2. ✅ **GitHub Account** - Create at https://github.com/signup
3. ✅ **Vercel Account** - Create at https://vercel.com/signup
4. ✅ **PostgreSQL Database** - Use one of:
   - [Supabase](https://supabase.com) - Easiest, free tier
   - [Neon](https://neon.tech) - Serverless PostgreSQL
   - [Railway](https://railway.app) - Simple setup

---

## Next Steps

After installing Node.js:

1. Run `./deploy-vercel.sh` for guided setup
2. OR follow `DEPLOY_QUICK.md` for manual steps
3. OR read `VERCEL_DEPLOYMENT.md` for detailed guide

---

## Estimated Time

- Node.js installation: **5 minutes**
- Local setup & testing: **10 minutes**
- Database setup: **5 minutes**
- Vercel deployment: **5 minutes**

**Total: ~25 minutes** from zero to deployed! 🚀
