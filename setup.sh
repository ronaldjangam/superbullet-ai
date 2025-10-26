#!/bin/bash

# SuperbulletAI Setup Script
# This script helps set up the development environment

echo "🚀 SuperbulletAI Setup"
echo "====================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Would you like to:"
    echo "   1. Install PostgreSQL locally (recommended for development)"
    echo "   2. Use a cloud database (Supabase, Neon, Railway)"
    echo ""
    echo "   To install locally on macOS:"
    echo "   brew install postgresql@15"
    echo "   brew services start postgresql@15"
    echo ""
else
    echo "✅ PostgreSQL detected"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your database credentials"
    echo "   DATABASE_URL=\"postgresql://username:password@localhost:5432/superbullet?schema=public\""
    echo "   NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\""
    echo ""
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo ""
echo "🔨 Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    echo "   Make sure your DATABASE_URL is correct in .env"
    exit 1
fi

echo "✅ Prisma client generated"

# Push database schema
echo ""
echo "📊 Setting up database..."
echo "   This will create all tables in your database."
echo ""
read -p "   Ready to push schema? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:push
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to push database schema"
        echo "   Check your DATABASE_URL in .env"
        exit 1
    fi
    
    echo "✅ Database schema created"
else
    echo "⏭️  Skipped database setup"
    echo "   Run 'npm run db:push' when ready"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your database credentials"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "Useful commands:"
echo "  npm run dev          # Start development server"
echo "  npm run db:studio    # Open Prisma Studio (database GUI)"
echo "  npm run build        # Build for production"
echo ""
echo "Happy coding! 🚀"
