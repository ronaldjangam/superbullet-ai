# 🚀 Vercel Deployment Guide for SuperbulletAI

This guide will walk you through deploying SuperbulletAI to Vercel in **under 10 minutes**.

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ A **Vercel account** - [Sign up at vercel.com](https://vercel.com/signup)
2. ✅ A **GitHub account** - Your code should be in a GitHub repository
3. ✅ A **PostgreSQL database** - Use one of these cloud providers:
   - [Supabase](https://supabase.com) (Recommended - Free tier)
   - [Neon](https://neon.tech) (Serverless PostgreSQL)
   - [Railway](https://railway.app) (Simple setup)
   - [PlanetScale](https://planetscale.com) (MySQL alternative)

---

## 🎯 Quick Deploy (Recommended)

### Step 1: Push to GitHub

If you haven't already, initialize a git repository and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SuperbulletAI Phase 1"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/superbullet.git

# Push to GitHub
git push -u origin main
```

### Step 2: Set Up Database

**Option A: Supabase (Recommended)**

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to provision (~2 minutes)
3. Go to **Settings > Database**
4. Copy the **Connection String** (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password
6. Your URL should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```

**Option B: Neon**

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Copy the connection string from the dashboard
3. It should look like:
   ```
   postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb
   ```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..." → Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

5. Add **Environment Variables**:

   ```
   DATABASE_URL = postgresql://your-connection-string-here
   NEXTAUTH_SECRET = your-random-secret-here
   NEXTAUTH_URL = https://your-app.vercel.app
   ```

   **To generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   # Or use: https://generate-secret.vercel.app/32
   ```

   **NEXTAUTH_URL:** Will be your Vercel deployment URL (add this after first deploy, then redeploy)

6. Click **"Deploy"**

### Step 4: Run Database Migrations

After your first deployment:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   **Note:** These commands use your local connection to update the remote database.

5. Redeploy to ensure Prisma Client is up-to-date:
   ```bash
   vercel --prod
   ```

---

## 🔧 Manual Deployment via CLI

If you prefer using the Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? superbullet-ai
# - In which directory is your code located? ./
# - Want to override settings? No

# After deployment, add environment variables:
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# Redeploy with environment variables
vercel --prod
```

---

## 🔐 Environment Variables Setup

Your Vercel project needs these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | JWT secret (32+ random chars) | `your-32-char-random-string` |
| `NEXTAUTH_URL` | Your production URL | `https://superbullet.vercel.app` |

### How to Add Environment Variables in Vercel Dashboard:

1. Go to your project on Vercel
2. Click **Settings**
3. Click **Environment Variables**
4. Add each variable:
   - Key: `DATABASE_URL`
   - Value: Your database connection string
   - Environment: **Production**, **Preview**, **Development** (check all)
5. Click **"Save"**
6. Repeat for `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
7. Redeploy your project

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain:

1. Go to your Vercel project
2. Click **Settings → Domains**
3. Enter your domain (e.g., `superbullet.ai`)
4. Follow DNS configuration instructions:
   - Add an **A Record** or **CNAME** to your domain provider
   - Wait for DNS propagation (~5-10 minutes)
5. Update `NEXTAUTH_URL` to your custom domain
6. Redeploy

---

## 🧪 Testing Your Deployment

After deployment:

1. Visit your Vercel URL (e.g., `https://superbullet-abc123.vercel.app`)
2. Test the registration flow:
   - Click **"Get Started"**
   - Create an account
   - Verify you can log in
3. Test project creation:
   - Create a new project
   - Open the IDE
   - Create/edit files
   - Save changes
4. Check database:
   - Verify data is being saved
   - Check your database dashboard (Supabase/Neon)

---

## 🐛 Troubleshooting

### Issue: "Prisma Client Not Found"

**Solution:**
```bash
# Add postinstall script to package.json
# This is already configured in your package.json:
"postinstall": "prisma generate"
```

Then redeploy:
```bash
vercel --prod
```

### Issue: "Cannot Connect to Database"

**Causes:**
- Incorrect `DATABASE_URL`
- Database not publicly accessible
- SSL connection required but not configured

**Solution:**
1. Verify connection string format:
   ```
   postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
   ```
2. Test connection locally:
   ```bash
   npx prisma db push
   ```
3. Check database provider allows external connections

### Issue: "500 Internal Server Error"

**Solution:**
1. Check Vercel **Function Logs**:
   - Go to your project on Vercel
   - Click **Deployments → [Latest] → Functions**
   - Look for error messages
2. Common causes:
   - Missing environment variables
   - Database connection timeout
   - Prisma schema not generated

### Issue: "Authentication Not Working"

**Solution:**
1. Verify `NEXTAUTH_SECRET` is set correctly
2. Check `NEXTAUTH_URL` matches your deployment URL
3. Ensure cookies are enabled in browser
4. Check CORS settings (should work by default on Vercel)

### Issue: "Build Failed"

**Common causes:**
- TypeScript errors → Fix locally first
- Missing dependencies → Run `npm install` locally
- Environment variables needed at build time → Add to Vercel

**Solution:**
```bash
# Test build locally
npm run build

# If successful, push and redeploy
git add .
git commit -m "Fix build errors"
git push
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in):
- Go to your project → **Analytics**
- View page views, performance metrics, errors

### Database Monitoring:
- **Supabase:** Dashboard → Database → Logs
- **Neon:** Dashboard → Operations

### Set Up Alerts:
1. Go to Vercel project → **Settings → Notifications**
2. Enable:
   - Deployment failures
   - Build errors
   - Function errors

---

## 🔄 Continuous Deployment

Every push to your `main` branch will automatically trigger a deployment:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push
   ```
3. Vercel automatically:
   - Builds your app
   - Runs tests
   - Deploys to production
   - Updates your live site

### Preview Deployments:

For pull requests or feature branches:
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

Vercel creates a preview deployment with a unique URL to test before merging.

---

## 💰 Pricing & Limits

### Vercel Free Tier:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL
- ✅ Preview deployments
- ✅ Serverless functions (10 second timeout)
- ❌ No custom domains on free tier (but .vercel.app works)

### Database Free Tiers:
- **Supabase:** 500MB database, 2GB bandwidth
- **Neon:** 3GB storage, 300 hours compute
- **Railway:** $5 free credit monthly

**Upgrade when:**
- You exceed bandwidth limits
- Need longer function execution times (Pro: 60s, Enterprise: 900s)
- Want custom domains
- Need team collaboration

---

## 🚀 Production Checklist

Before going live:

- [ ] Database is set up and accessible
- [ ] All environment variables are configured
- [ ] Test registration and login flows
- [ ] Test project creation and file editing
- [ ] Verify file saves persist to database
- [ ] Check error handling (try invalid inputs)
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Configure error monitoring
- [ ] Set up automated backups for database

---

## 📞 Support

**Vercel Issues:**
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support
- Community: https://github.com/vercel/next.js/discussions

**Database Issues:**
- Supabase Discord: https://discord.supabase.com
- Neon Docs: https://neon.tech/docs

**SuperbulletAI Issues:**
- Check `DEVELOPMENT.md` for troubleshooting
- Review API logs in Vercel dashboard

---

## 🎉 You're Live!

Once deployed, your SuperbulletAI platform is live at:
```
https://your-project.vercel.app
```

Share it with users and start building amazing Roblox games! 🎮

---

**Next Steps After Deployment:**
1. Monitor initial user feedback
2. Set up error tracking (e.g., Sentry)
3. Plan Phase 2: Modified Knit Framework
4. Scale database as needed
5. Optimize performance (caching, CDN)

Happy deploying! 🚀
