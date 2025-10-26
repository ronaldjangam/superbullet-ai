# 🔧 Fix: Database Secret Error

**Error:** "database secret accesses some secret which doesn't exist"

**Cause:** Vercel is trying to build your app but DATABASE_URL environment variable isn't set yet.

---

## ✅ Quick Fix (5 minutes)

### Option 1: Set Up Supabase Database (Recommended - Free)

1. **Go to Supabase:**
   - Visit: https://supabase.com/dashboard
   - Click "Sign in" or "Start your project"
   - Sign up with GitHub (easiest)

2. **Create New Project:**
   - Click "New Project"
   - Organization: Choose or create one
   - Name: `superbullet-ai`
   - Database Password: Create a strong password (SAVE THIS!)
   - Region: Choose closest to you (e.g., `us-east-1`)
   - Click "Create new project"
   - ⏳ Wait ~2 minutes for database to provision

3. **Get Connection String:**
   - Once ready, go to: **Settings** (⚙️ icon in sidebar)
   - Click **Database**
   - Scroll down to "Connection string"
   - Select **URI** tab
   - Copy the connection string (looks like):
   ```
   postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
   - **Replace `[YOUR-PASSWORD]` with the password you created in step 2**

4. **Important:** Your final DATABASE_URL should look like this:
   ```
   postgresql://postgres.abcdefghijk:MyPassword123!@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

---

### Option 2: Neon Database (Alternative - Faster Setup)

1. **Go to Neon:**
   - Visit: https://console.neon.tech
   - Sign in with GitHub

2. **Create Project:**
   - Click "Create a project"
   - Name: `superbullet-ai`
   - Region: Choose closest to you
   - Click "Create project"
   - ⏳ Instant setup!

3. **Copy Connection String:**
   - Automatically shown on screen
   - Copy the connection string (format):
   ```
   postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
   ```

---

## 🚀 Add to Vercel

Now that you have your DATABASE_URL:

### Method 1: Vercel Dashboard (Easiest)

1. **Go to your Vercel project:**
   - Visit: https://vercel.com/dashboard
   - Find your `superbullet-ai` project
   - Click on it

2. **Add Environment Variables:**
   - Click **Settings** tab
   - Click **Environment Variables** in sidebar
   - Add these three variables:

   **Variable 1:**
   ```
   Name: DATABASE_URL
   Value: [Paste your connection string from above]
   Environment: Production, Preview, Development (check all 3)
   ```

   **Variable 2:**
   ```
   Name: NEXTAUTH_SECRET
   Value: t6wCHEk1yfGJnjHTHKpRUB7u3qHSX7D1TLeLfx4HISM=
   Environment: Production, Preview, Development (check all 3)
   ```

   **Variable 3:**
   ```
   Name: NEXTAUTH_URL
   Value: (leave blank for now, we'll add after deployment)
   Environment: Production, Preview, Development (check all 3)
   ```

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click the **⋮** (three dots) on the latest deployment
   - Click **Redeploy**
   - Check **Use existing Build Cache** (uncheck it)
   - Click **Redeploy**

---

### Method 2: Using Vercel CLI

If you prefer command line:

```bash
# Make sure Node.js is in PATH
export PATH="/usr/local/opt/node@20/bin:$PATH"

# Add DATABASE_URL
vercel env add DATABASE_URL production
# Paste your database connection string when prompted
# Press Enter to also add to Preview and Development

# Add NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET production
# Paste: t6wCHEk1yfGJnjHTHKpRUB7u3qHSX7D1TLeLfx4HISM=
# Press Enter to also add to Preview and Development

# Redeploy
vercel --prod
```

---

## ⏭️ After Deployment Succeeds

Once your deployment is successful:

1. **Copy your Vercel URL** (e.g., `https://superbullet-ai.vercel.app`)

2. **Update NEXTAUTH_URL:**
   - Go back to Vercel → Settings → Environment Variables
   - Add or edit `NEXTAUTH_URL`
   - Value: Your full Vercel URL (e.g., `https://superbullet-ai.vercel.app`)
   - Save

3. **Initialize Database:**
   ```bash
   export PATH="/usr/local/opt/node@20/bin:$PATH"
   npx prisma generate
   npx prisma db push
   ```

4. **Final Redeploy:**
   - Vercel will automatically redeploy when you update env vars
   - OR manually trigger redeploy in Vercel dashboard

---

## ✅ Verification

Test your deployment:

1. Visit your Vercel URL
2. Click "Get Started"
3. Register a new account
4. Should redirect to /projects
5. Create a project
6. Open IDE
7. Success! 🎉

---

## 🆘 Still Having Issues?

### Error: "Prisma Client initialization failed"
**Fix:** Database schema not pushed yet
```bash
npx prisma db push
```

### Error: "Invalid connection string"
**Check:**
- Connection string format is correct
- Password doesn't have special characters that need escaping
- Add `?sslmode=require` to end of URL if needed:
  ```
  postgresql://user:pass@host:5432/db?sslmode=require
  ```

### Error: "Can't reach database server"
**Check:**
- Database is running (check Supabase/Neon dashboard)
- Connection string is exactly as provided (no extra spaces)
- Region is accessible

---

## 📝 Quick Reference

**Your credentials:**
```
NEXTAUTH_SECRET: t6wCHEk1yfGJnjHTHKpRUB7u3qHSX7D1TLeLfx4HISM=
DATABASE_URL: [Get from Supabase/Neon]
NEXTAUTH_URL: [Your Vercel URL after first deploy]
```

**Important links:**
- Supabase: https://supabase.com/dashboard
- Neon: https://console.neon.tech
- Vercel: https://vercel.com/dashboard

---

**Estimated time to fix: 5-7 minutes**

Start with setting up Supabase or Neon database above, then add the environment variables to Vercel! 🚀
