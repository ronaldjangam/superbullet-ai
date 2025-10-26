# ⚡ Quick Start Cheat Sheet

## 🚀 Setup in 5 Minutes

```bash
# 1. Navigate to project
cd /Users/ronaldgospeljangam/Desktop/stuff/SuperBullet

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your database URL

# 4. Set up database
npm run db:generate
npm run db:push

# 5. Start dev server
npm run dev
```

Open: http://localhost:3000

---

## 📝 Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Check code quality

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:studio        # Open database GUI

# Git
git add .
git commit -m "message"
git push origin main
```

---

## 🔑 Environment Variables (.env)

```env
# Required
DATABASE_URL="postgresql://user:pass@localhost:5432/superbullet?schema=public"
NEXTAUTH_SECRET="your-32-character-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

Generate secret:
```bash
openssl rand -base64 32
```

---

## 🗄️ Database Quick Setup

### Local PostgreSQL (macOS)
```bash
brew install postgresql@15
brew services start postgresql@15
createdb superbullet
```

### Cloud Database (Supabase - Free)
1. Go to https://supabase.com
2. Create account
3. Create project
4. Copy connection string
5. Paste in .env

---

## 📁 Project Structure

```
app/
├── api/              # Backend API routes
├── auth/             # Login/register pages
├── ide/[id]/         # IDE interface
├── projects/         # Project dashboard
└── page.tsx          # Landing page

components/
├── editor/           # Monaco, tabs, tree
└── ui/               # Buttons, inputs, etc.

lib/
├── auth.ts           # JWT helpers
├── prisma.ts         # Database client
└── utils.ts          # Utilities
```

---

## 🌐 API Routes

```
Auth
POST   /api/auth/register     # Create account
POST   /api/auth/login        # Login
GET    /api/auth/verify       # Check token

Projects
GET    /api/projects          # List projects
POST   /api/projects          # Create project
GET    /api/projects/:id      # Get project
DELETE /api/projects/:id      # Delete project

Files
GET    /api/projects/:id/files           # List files
POST   /api/projects/:id/files           # Create file
PUT    /api/projects/:id/files/:fileId   # Update file
```

---

## 🧪 Testing Flow

```bash
# 1. Start server
npm run dev

# 2. Open browser
open http://localhost:3000

# 3. Test flow
Register → Login → Create Project → Open IDE → Edit File → Save

# 4. Verify database
npm run db:studio
```

---

## 🐛 Common Issues

**"Cannot find module"**
```bash
npm install
```

**"Prisma Client not generated"**
```bash
npm run db:generate
```

**"Database connection failed"**
→ Check DATABASE_URL in .env

**"Unauthorized" errors**
→ Login again to get new token

---

## 🎨 Key Features

✅ User authentication (JWT)
✅ Project management (CRUD)
✅ Monaco code editor
✅ Multi-file editing
✅ File tree navigation
✅ Save functionality
✅ Roblox folder structure

---

## 🚀 Deploy to Production

### Quick Deploy (Vercel)
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to vercel.com
# 3. Import repository
# 4. Add environment variables
# 5. Deploy!
```

See `DEPLOYMENT.md` for details.

---

## 📊 Database Schema

```prisma
User
- id, email, passwordHash, tokensRemaining
- Projects[]

Project
- id, userId, name, description, structure
- Files[]

File
- id, projectId, path, content, fileType
```

---

## 🎯 Next Phase

**Phase 2: Knit Framework**
- Service scaffolding
- Component generation
- IntelliSense support

See `ROADMAP.md` for details.

---

## 📚 Documentation

- `README.md` - Main docs
- `DEVELOPMENT.md` - Dev guide
- `DATABASE_SETUP.md` - DB setup
- `DEPLOYMENT.md` - Deploy guide
- `ROADMAP.md` - Future plans

---

## 💡 Quick Tips

1. **Use Prisma Studio** for easy database viewing
   ```bash
   npm run db:studio
   ```

2. **Check browser console** for errors

3. **Token in localStorage** 
   ```javascript
   localStorage.getItem('token')
   ```

4. **Clear cache** if things act weird
   ```bash
   rm -rf .next
   npm run dev
   ```

5. **Database reset** (⚠️ deletes all data)
   ```bash
   npx prisma migrate reset
   ```

---

## 🎉 Success Checklist

- [ ] `npm install` works
- [ ] `.env` file created
- [ ] Database connected
- [ ] `npm run dev` starts server
- [ ] Can access localhost:3000
- [ ] Can register user
- [ ] Can login
- [ ] Can create project
- [ ] Can edit files
- [ ] Can save files

---

**All set! Happy coding! 🚀**

Quick help: Run `./setup.sh` for guided setup
