# Database Setup Guide

## Option 1: Local PostgreSQL (Recommended for Development)

### macOS Installation
```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb superbullet

# Verify installation
psql -d superbullet -c "SELECT version();"
```

### Ubuntu/Debian Installation
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb superbullet

# Create user (optional)
sudo -u postgres psql -c "CREATE USER superbullet WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE superbullet TO superbullet;"
```

### Windows Installation
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run installer and follow wizard
3. Remember the password you set for postgres user
4. Use pgAdmin or command line to create database:
```sql
CREATE DATABASE superbullet;
```

### Connection String
```
DATABASE_URL="postgresql://localhost:5432/superbullet?schema=public"
```

Or with credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/superbullet?schema=public"
```

---

## Option 2: Supabase (Free Cloud Database)

### Steps:
1. Go to https://supabase.com/
2. Click "Start your project"
3. Create account (free)
4. Create new project
5. Wait for database to provision (~2 minutes)
6. Go to Settings → Database
7. Copy "Connection string" under "Connection pooling"

### Connection String Format:
```
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
```

### Advantages:
✅ Free tier (500MB database, 2GB bandwidth)
✅ No local installation needed
✅ Automatic backups
✅ Built-in dashboard
✅ Real-time subscriptions (for future phases)

---

## Option 3: Neon (Serverless Postgres)

### Steps:
1. Go to https://neon.tech/
2. Sign up (free)
3. Create new project
4. Select region closest to you
5. Copy connection string

### Connection String Format:
```
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

### Advantages:
✅ Free tier (3GB storage, 100 hours compute)
✅ Serverless (auto-suspend when idle)
✅ Branching (like Git for databases)
✅ Fast cold starts

---

## Option 4: Railway (All-in-one Platform)

### Steps:
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create "New Project"
4. Click "Provision PostgreSQL"
5. Go to database → Connect tab
6. Copy "Postgres Connection URL"

### Connection String Format:
```
DATABASE_URL="postgresql://postgres:[password]@[host]:[port]/railway"
```

### Advantages:
✅ Free trial ($5 credit)
✅ One-click deployment
✅ Can deploy entire app + database
✅ Automatic SSL
✅ Multiple environments

---

## Option 5: ElephantSQL (Managed PostgreSQL)

### Steps:
1. Go to https://www.elephantsql.com/
2. Create account
3. Create "Tiny Turtle" instance (free)
4. Select region
5. Copy connection string from details page

### Connection String Format:
```
DATABASE_URL="postgresql://[username]:[password]@[server]/[database]"
```

### Advantages:
✅ Free tier (20MB)
✅ Simple setup
✅ Dedicated dashboard
✅ Multiple regions

---

## Verifying Your Database Connection

### Test connection with Prisma
```bash
# From project root
npm run db:generate
npm run db:push
```

If successful, you should see:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema
```

### Test with psql command line
```bash
psql "your_connection_string_here"
```

Then run:
```sql
\dt  -- List all tables
SELECT * FROM "User" LIMIT 1;  -- Query users table
```

---

## Troubleshooting

### Error: "Can't reach database server"
**Solutions:**
1. Check if PostgreSQL is running: `brew services list` (macOS)
2. Verify connection string format
3. Check firewall settings
4. For cloud databases, check IP whitelist

### Error: "SSL connection required"
**Solution:** Add `?sslmode=require` to connection string:
```
DATABASE_URL="postgresql://...?sslmode=require"
```

### Error: "Authentication failed"
**Solution:** 
1. Verify username and password
2. Check if user has permissions: `GRANT ALL PRIVILEGES ON DATABASE superbullet TO username;`

### Error: "Database does not exist"
**Solution:** Create it:
```bash
createdb superbullet
# or
psql -c "CREATE DATABASE superbullet;"
```

### Error: "Too many connections"
**Solution:** Use connection pooling:
```
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=20"
```

---

## Migration Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create migration (production)
npx prisma migrate dev --name init

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI for database)
npm run db:studio
```

---

## Security Best Practices

1. **Never commit .env file**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use different databases for dev/prod**
   ```bash
   # .env.local (development)
   DATABASE_URL="postgresql://localhost:5432/superbullet_dev"
   
   # .env.production
   DATABASE_URL="postgresql://cloud-host/superbullet_prod"
   ```

3. **Rotate credentials regularly**
   - Change database passwords every 90 days
   - Use strong passwords (20+ characters)

4. **Enable SSL for production**
   ```
   DATABASE_URL="postgresql://...?sslmode=require"
   ```

5. **Backup regularly**
   ```bash
   # Export database
   pg_dump superbullet > backup.sql
   
   # Import database
   psql superbullet < backup.sql
   ```

---

## Recommended Setup for Different Use Cases

### Learning/Development (Local Machine)
→ **Local PostgreSQL**
- Fast, no internet needed
- Full control
- Free forever

### Portfolio/Demo Project (Show to others)
→ **Supabase** or **Neon**
- Always online
- Free tier sufficient
- Professional dashboard

### Production App (Scaling needed)
→ **Railway** or **Supabase**
- Auto-scaling
- Backups
- Monitoring
- Support

---

## Quick Setup Command (macOS)

```bash
# Install & setup everything
brew install postgresql@15
brew services start postgresql@15
createdb superbullet
echo 'DATABASE_URL="postgresql://localhost:5432/superbullet?schema=public"' >> .env
npm run db:generate
npm run db:push
```

Done! 🎉
