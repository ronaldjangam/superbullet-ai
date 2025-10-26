# Deployment Guide

## Overview

This guide covers deploying SuperbulletAI to production. The recommended stack is:
- **Frontend + API**: Vercel
- **Database**: Supabase or Neon
- **File Storage**: (Future: AWS S3 or Vercel Blob)

---

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier)
- Database set up (see DATABASE_SETUP.md)

### Steps

#### 1. Push to GitHub
```bash
cd /Users/ronaldgospeljangam/Desktop/stuff/SuperBullet

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Phase 1 complete"

# Create repo on GitHub and push
git remote add origin https://github.com/yourusername/superbullet-ai.git
git branch -M main
git push -u origin main
```

#### 2. Connect to Vercel
1. Go to https://vercel.com/
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

#### 3. Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://your-cloud-database-url
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-characters
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### 4. Deploy
```bash
# Automatic deployment on push
git push origin main

# Or use Vercel CLI
npm i -g vercel
vercel --prod
```

#### 5. Configure Database
After first deployment, run migrations:
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run Prisma commands
npx prisma generate
npx prisma db push
```

### Vercel Configuration (vercel.json)
Create `vercel.json` in root:
```json
{
  "buildCommand": "npx prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  }
}
```

---

## Option 2: Deploy to Railway

### Steps

#### 1. Install Railway CLI
```bash
npm i -g @railway/cli
```

#### 2. Login
```bash
railway login
```

#### 3. Initialize Project
```bash
cd /Users/ronaldgospeljangam/Desktop/stuff/SuperBullet
railway init
```

#### 4. Add PostgreSQL
```bash
railway add postgresql
```

#### 5. Deploy
```bash
railway up
```

#### 6. Set Environment Variables
```bash
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NODE_ENV=production
```

Railway automatically sets `DATABASE_URL` when you add PostgreSQL.

#### 7. Generate Domain
```bash
railway domain
```

---

## Option 3: Deploy to Render

### Steps

#### 1. Create Account
- Go to https://render.com/
- Sign up with GitHub

#### 2. Create PostgreSQL Database
1. Dashboard → New → PostgreSQL
2. Name: superbullet-db
3. Select free tier
4. Copy "Internal Database URL"

#### 3. Create Web Service
1. Dashboard → New → Web Service
2. Connect GitHub repository
3. Configure:
   - **Name**: superbullet-ai
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

#### 4. Environment Variables
Add in Render dashboard:
```env
DATABASE_URL=your-render-postgres-url
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://superbullet-ai.onrender.com
NODE_ENV=production
```

#### 5. Deploy
Render auto-deploys on git push.

---

## Post-Deployment Checklist

### 1. Database Migration
```bash
# Via Vercel CLI
vercel env pull .env.production
npx prisma db push

# Or via Railway
railway run npx prisma db push
```

### 2. Test Authentication
1. Visit your deployed URL
2. Register new account
3. Verify email stored in database
4. Login with credentials
5. Create test project

### 3. Verify API Endpoints
```bash
# Test login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test projects (with token)
curl https://your-app.vercel.app/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Monitor Performance
- Check Vercel Analytics
- Monitor database connection pool
- Check API response times

### 5. Set Up Error Tracking (Optional)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Environment Variables Reference

### Required for All Deployments
```env
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_SECRET          # 32+ character random string
NEXTAUTH_URL             # Your app's public URL
NODE_ENV                 # "production"
```

### Optional (Future Phases)
```env
ANTHROPIC_API_KEY        # For Claude AI (Phase 3)
OPENAI_API_KEY           # For GPT-4 (Phase 3)
PINECONE_API_KEY         # For vector search (Phase 4)
AWS_ACCESS_KEY_ID        # For S3 storage (Phase 6)
AWS_SECRET_ACCESS_KEY    # For S3 storage (Phase 6)
```

---

## Database Migration Strategy

### Development
```bash
# Make schema changes in prisma/schema.prisma
npx prisma db push
```

### Production
```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Commit migration files
git add prisma/migrations
git commit -m "Add migration for new feature"

# Deploy triggers automatic migration
git push origin main
```

### Vercel Build Configuration
Update `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., superbullet.ai)
3. Add DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Railway
```bash
railway domain add yourdomain.com
```
Then add CNAME record:
```
CNAME: yourdomain.com → your-project.railway.app
```

---

## SSL/HTTPS

All major platforms (Vercel, Railway, Render) provide automatic SSL certificates via Let's Encrypt. No configuration needed!

---

## Performance Optimization

### 1. Enable Next.js Caching
```typescript
// next.config.js
module.exports = {
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  // Production optimizations
  swcMinify: true,
  reactStrictMode: true,
  compress: true,
}
```

### 2. Database Connection Pooling
```env
# Optimize connection string
DATABASE_URL="postgresql://...?connection_limit=10&pool_timeout=20"
```

### 3. Enable Vercel Edge Functions (Future)
Move API routes to edge for lower latency.

---

## Monitoring & Analytics

### Vercel Analytics (Free)
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Database Monitoring
- Supabase: Built-in dashboard
- Neon: Query insights panel
- Railway: Metrics tab

---

## Backup Strategy

### Automated Backups (Supabase)
- Free tier: Daily backups (7 days retention)
- Pro tier: Point-in-time recovery

### Manual Backups
```bash
# Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Store in secure location
# - AWS S3
# - GitHub (encrypted)
# - Local encrypted storage
```

---

## Troubleshooting Deployment

### Build Fails
**Error**: "Cannot find module '@prisma/client'"
```bash
# Add to package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Connection Fails
**Check**:
1. DATABASE_URL is set correctly
2. Database allows connections from Vercel IPs
3. SSL mode is correct (`?sslmode=require`)

### 502 Bad Gateway
**Possible causes**:
1. Build timeout (increase in Vercel settings)
2. Memory limit exceeded
3. Database connection pool exhausted

### API Routes Return 500
**Debug**:
1. Check Vercel Function Logs
2. Add error logging:
```typescript
console.error('Error details:', error)
```
3. Check database permissions

---

## Cost Estimation

### Free Tier (Sufficient for Phase 1)
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Supabase**: 500MB database, 2GB bandwidth
- **Total**: $0/month

### When to Upgrade
- **Vercel Pro** ($20/month): 1TB bandwidth, faster builds
- **Supabase Pro** ($25/month): 8GB database, daily backups
- **Total**: ~$45/month (for production app)

---

## Security Checklist

- [ ] HTTPS enabled (automatic on all platforms)
- [ ] Environment variables not committed to git
- [ ] DATABASE_URL not exposed in client code
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] CORS configured for API routes
- [ ] Rate limiting implemented (Phase 3)
- [ ] SQL injection prevented (Prisma handles this)
- [ ] XSS protection enabled
- [ ] Dependencies up to date (`npm audit`)

---

## Rollback Strategy

### Vercel
1. Go to Deployments tab
2. Click "..." on previous deployment
3. Select "Promote to Production"

### Railway
```bash
railway rollback
```

### Database
```bash
# Restore from backup
psql $DATABASE_URL < backup-20231027.sql
```

---

## Next Steps After Deployment

1. **Set up monitoring**: Vercel Analytics + Sentry
2. **Configure CI/CD**: Automatic testing on PR
3. **Add E2E tests**: Playwright or Cypress
4. **Set up staging environment**: Test before production
5. **Document API**: Swagger/OpenAPI (Phase 3)

---

**Deployment complete! 🚀**

Your SuperbulletAI instance is now live and ready for users!
