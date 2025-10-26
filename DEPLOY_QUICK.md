# 🚀 Quick Vercel Deployment Reference

## One-Command Deploy

```bash
./deploy-vercel.sh
```

---

## Manual Deploy Steps

### 1️⃣ Prerequisites (One-time setup)

```bash
# Install Node.js (if not installed)
# Download from: https://nodejs.org/

# Verify installation
node --version  # Should be 18.x or higher
npm --version
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Database

**Quick Option: Supabase (Free)**

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Wait 2 minutes for setup
4. Go to Settings → Database
5. Copy the Connection String (URI)
6. Replace `[YOUR-PASSWORD]` with your password

Your URL format:
```
postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
```

### 4️⃣ Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Generate secret
openssl rand -base64 32

# Edit .env with:
# - DATABASE_URL (from step 3)
# - NEXTAUTH_SECRET (from openssl command)
# - NEXTAUTH_URL (add after first deploy)
```

### 5️⃣ Test Build Locally

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Test build
npm run build

# Test locally
npm run dev
# Visit: http://localhost:3000
```

### 6️⃣ Push to GitHub

```bash
# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create GitHub repo at: https://github.com/new

# Add remote (replace with your URL)
git remote add origin https://github.com/yourusername/superbullet.git

# Push
git push -u origin main
```

### 7️⃣ Deploy on Vercel

**Option A: Dashboard (Easiest)**

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Add Environment Variables:
   ```
   DATABASE_URL = your-postgres-url
   NEXTAUTH_SECRET = your-secret-from-openssl
   NEXTAUTH_URL = https://your-app.vercel.app
   ```
5. Click **Deploy**

**Option B: CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts, then add env vars in dashboard
```

### 8️⃣ Post-Deploy

```bash
# Update NEXTAUTH_URL in Vercel dashboard
# with your actual deployment URL:
# https://your-app-name.vercel.app

# Then redeploy (automatic on git push)
```

---

## 🔍 Testing Checklist

After deployment, test:

- [ ] Visit your Vercel URL
- [ ] Register a new account
- [ ] Login works
- [ ] Create a project
- [ ] Open IDE
- [ ] Create/edit files
- [ ] Save changes
- [ ] Files persist after refresh

---

## 🆘 Quick Troubleshooting

### Build Failed
```bash
# Fix locally first
npm run build

# If successful, push again
git add .
git commit -m "Fix build"
git push
```

### "Prisma Client Not Found"
- Check: `package.json` has `"postinstall": "prisma generate"`
- Redeploy after confirming

### Can't Connect to Database
- Verify DATABASE_URL format in Vercel dashboard
- Ensure database accepts external connections
- Add `?sslmode=require` to connection string

### Authentication Errors
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches deployment URL
- Redeploy after updating

---

## 📊 Useful Commands

```bash
# View deployment logs
vercel logs

# Check build status
vercel inspect

# List deployments
vercel ls

# Roll back deployment
vercel rollback

# Open project in browser
vercel open
```

---

## 🔗 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployment Guide:** See `VERCEL_DEPLOYMENT.md`
- **Supabase Dashboard:** https://supabase.com/dashboard
- **GitHub Repo:** https://github.com/yourusername/superbullet

---

## 💡 Pro Tips

1. **Custom Domain:** Add in Vercel → Settings → Domains
2. **Environment Variables:** Add to all environments (Production, Preview, Development)
3. **Automatic Deploys:** Every `git push` triggers a deploy
4. **Preview Deploys:** Feature branches get unique URLs
5. **Monitoring:** Check Vercel → Analytics for performance

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Project Docs:** Check `DEVELOPMENT.md`

---

**Total Time: ~10 minutes** ⏱️

🎉 **You're live!** Share your deployment URL and start building!
