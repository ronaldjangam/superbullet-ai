#!/bin/bash

# 🚀 SuperbulletAI Vercel Deployment Script
# This script helps you deploy to Vercel step-by-step

set -e

echo "🚀 SuperbulletAI Vercel Deployment Helper"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Recommended version: 18.x or higher"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm --version) detected${NC}"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    echo "Please install Git from https://git-scm.com/"
    exit 1
fi

echo -e "${GREEN}✅ Git detected${NC}"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules exists. Run 'npm install' manually if needed${NC}"
fi
echo ""

# Step 2: Check for .env file
echo "🔐 Step 2: Checking environment variables..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env with your actual values:${NC}"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - NEXTAUTH_URL (will be your Vercel URL)"
    echo ""
    read -p "Press Enter after you've configured .env..."
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Step 3: Test database connection
echo "🗄️  Step 3: Testing database connection..."
if npx prisma db push --skip-generate 2>/dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${YELLOW}⚠️  Could not connect to database${NC}"
    echo "This is okay if you'll set up the database later"
fi
echo ""

# Step 4: Build test
echo "🏗️  Step 4: Testing build..."
if npm run build; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    echo "Please fix build errors before deploying"
    exit 1
fi
echo ""

# Step 5: Check for git repository
echo "📚 Step 5: Checking Git repository..."
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Not a git repository${NC}"
    read -p "Initialize git repository? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        git add .
        git commit -m "Initial commit - SuperbulletAI Phase 1"
        echo -e "${GREEN}✅ Git repository initialized${NC}"
    fi
else
    echo -e "${GREEN}✅ Git repository exists${NC}"
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
        read -p "Commit changes? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            read -p "Enter commit message: " commit_msg
            git commit -m "$commit_msg"
            echo -e "${GREEN}✅ Changes committed${NC}"
        fi
    fi
fi
echo ""

# Step 6: Check for GitHub remote
echo "🌐 Step 6: Checking GitHub remote..."
if git remote get-url origin &> /dev/null; then
    echo -e "${GREEN}✅ GitHub remote configured:${NC} $(git remote get-url origin)"
else
    echo -e "${YELLOW}⚠️  No GitHub remote configured${NC}"
    echo "To push to GitHub:"
    echo "  1. Create a new repository on GitHub"
    echo "  2. Run: git remote add origin https://github.com/yourusername/superbullet.git"
    echo "  3. Run: git push -u origin main"
fi
echo ""

# Step 7: Install Vercel CLI
echo "🔧 Step 7: Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not installed${NC}"
    read -p "Install Vercel CLI globally? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI installed${NC}"
    else
        echo "You can install it later with: npm install -g vercel"
    fi
else
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
fi
echo ""

# Step 8: Deployment options
echo "🚀 Step 8: Ready to deploy!"
echo ""
echo "Choose your deployment method:"
echo ""
echo "Option A: Deploy via Vercel Dashboard (Recommended for first time)"
echo "  1. Go to https://vercel.com"
echo "  2. Click 'Add New' → 'Project'"
echo "  3. Import your GitHub repository"
echo "  4. Add environment variables:"
echo "     - DATABASE_URL"
echo "     - NEXTAUTH_SECRET"
echo "     - NEXTAUTH_URL"
echo "  5. Click 'Deploy'"
echo ""
echo "Option B: Deploy via CLI"
if command -v vercel &> /dev/null; then
    echo "  Run: vercel --prod"
else
    echo "  First install Vercel CLI: npm install -g vercel"
    echo "  Then run: vercel --prod"
fi
echo ""

# Database setup reminder
echo -e "${BLUE}📝 Don't forget:${NC}"
echo "  1. Set up a PostgreSQL database (Supabase/Neon/Railway)"
echo "  2. Add DATABASE_URL to Vercel environment variables"
echo "  3. After first deploy, run: npx prisma db push"
echo "  4. Update NEXTAUTH_URL with your Vercel deployment URL"
echo "  5. Redeploy to apply changes"
echo ""

# Final checklist
echo -e "${GREEN}✅ Pre-deployment checklist:${NC}"
echo "  ✓ Dependencies installed"
echo "  ✓ Build successful"
echo "  ✓ Git repository ready"
echo "  ✓ Ready for deployment"
echo ""

echo "📖 For detailed instructions, see VERCEL_DEPLOYMENT.md"
echo ""
echo -e "${GREEN}🎉 You're ready to deploy!${NC}"
