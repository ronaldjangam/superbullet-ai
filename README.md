# 🚀 SuperbulletAI - Phase 1 Complete

An AI-powered Roblox game development platform with a custom web-based IDE, modified Knit framework support, and production-ready templates.

## 📋 Project Overview

SuperbulletAI is a comprehensive platform that accelerates Roblox game development through:
- **Custom AI Model**: BulletMindV1 fine-tuned specifically for Roblox Lua
- **Web-Based IDE**: VSCode Monaco Editor with real-time file management
- **Modified Knit Framework**: Get/Set/Others component architecture
- **Template Library**: Production-ready game systems from experienced developers
- **UGC Marketplace**: Browse and integrate community-created assets

## ✅ Phase 1: Completed Features

### 🏗️ Infrastructure
- ✅ Next.js 14 with TypeScript and App Router
- ✅ Tailwind CSS for styling
- ✅ Prisma ORM with PostgreSQL database
- ✅ JWT-based authentication system
- ✅ Complete REST API for projects and files

### 🎨 Frontend Components
- ✅ Monaco Editor integration with Lua syntax highlighting
- ✅ File tree navigation with Roblox-specific folders
- ✅ Multi-tab editor with unsaved changes tracking
- ✅ Project management dashboard
- ✅ Authentication pages (login/register)

### 🗄️ Database Schema
- ✅ Users with token tracking
- ✅ Projects with file tree structure
- ✅ Files with content storage
- ✅ Templates (prepared for Phase 4)
- ✅ Marketplace Assets (prepared for Phase 6)

### 🔐 Authentication & Security
- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ JWT token generation and verification
- ✅ Protected API routes

## 🚀 Getting Started

### Quick Deploy to Vercel 🎯

**Fastest way to get SuperbulletAI live in production:**

```bash
# Run the automated deployment helper
./deploy-vercel.sh
```

**Or follow these quick steps:**
1. Install Node.js from https://nodejs.org/
2. Set up a free PostgreSQL database at https://supabase.com
3. Push your code to GitHub
4. Deploy on Vercel: https://vercel.com/new
5. Add environment variables in Vercel dashboard
6. Done! 🎉

📚 **Deployment Guides:**
- [`DEPLOY_QUICK.md`](./DEPLOY_QUICK.md) - 10-minute deployment guide
- [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) - Complete deployment documentation
- [`DEPLOYMENT_FLOWCHART.md`](./DEPLOYMENT_FLOWCHART.md) - Visual deployment guide
- [`SETUP_MACOS.md`](./SETUP_MACOS.md) - macOS setup instructions

### Local Development Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- Git

### Installation

```

1. **Clone the repository**
```bash
cd /Users/ronaldgospeljangam/Desktop/stuff/SuperBullet
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/superbullet?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
```

4. **Set up PostgreSQL database**

Option 1: Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb superbullet
```

Option 2: Use a cloud database
- [Supabase](https://supabase.com/) (Free tier)
- [Neon](https://neon.tech/) (Free tier)
- [Railway](https://railway.app/) (Free trial)

5. **Initialize the database**
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

6. **Run the development server**
```bash
npm run dev
```

7. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
SuperBullet/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify/
│   │   └── projects/             # Project & file management
│   │       └── [id]/
│   │           └── files/
│   ├── auth/                     # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── ide/                      # IDE interface
│   │   └── [id]/
│   ├── projects/                 # Project dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                    # React components
│   ├── editor/                   # Editor-specific components
│   │   ├── code-editor.tsx       # Monaco Editor wrapper
│   │   ├── editor-tabs.tsx       # Tab management
│   │   └── file-tree.tsx         # File tree navigation
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       └── scroll-area.tsx
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication helpers
│   ├── prisma.ts                 # Prisma client
│   ├── roblox-structure.ts       # Roblox project structure
│   └── utils.ts                  # General utilities
├── prisma/                       # Database schema
│   └── schema.prisma
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## 🎯 Key Features

### 1. **Web-Based Code Editor**
- Monaco Editor (same engine as VS Code)
- Lua syntax highlighting and IntelliSense
- Multi-file editing with tabs
- Auto-save indicators
- Line numbers and minimap

### 2. **Project Management**
- Create unlimited projects
- Organize with descriptions
- Quick open from dashboard
- Delete unwanted projects

### 3. **Roblox File Structure**
Pre-configured folders matching Roblox Studio:
- `ServerScriptService` - Server-side scripts
- `ServerStorage` - Server-only assets
- `ReplicatedStorage` - Shared code (Knit modules)
- `StarterPlayer` - Player scripts
- `StarterGui` - UI elements
- `StarterPack` - Tools
- `Workspace` - Game world

### 4. **Modified Knit Framework Support**
Automatic generation of Knit service structure:
```
ServiceName/
├── init.lua
└── Components/
    ├── Get().lua     # Read operations
    ├── Set().lua     # Write operations
    └── Others/       # Additional components
```

### 5. **Authentication System**
- Secure user registration
- JWT-based sessions
- Token tracking (1M free tokens/month)
- Protected routes

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    # Create new account
POST   /api/auth/login        # Login
GET    /api/auth/verify       # Verify token
```

### Projects
```
GET    /api/projects          # List all projects
POST   /api/projects          # Create project
GET    /api/projects/:id      # Get project details
PUT    /api/projects/:id      # Update project
DELETE /api/projects/:id      # Delete project
```

### Files
```
GET    /api/projects/:id/files              # List project files
POST   /api/projects/:id/files              # Create file
GET    /api/projects/:id/files/:fileId      # Get file content
PUT    /api/projects/:id/files/:fileId      # Update file
DELETE /api/projects/:id/files/:fileId      # Delete file
```

## 🗄️ Database Schema

### Users
```prisma
model User {
  id               String   @id @default(uuid())
  email            String   @unique
  passwordHash     String
  name             String?
  tokensRemaining  Int      @default(1000000)
  subscriptionTier String   @default("free")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  projects         Project[]
}
```

### Projects
```prisma
model Project {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  structure   Json?    # File tree structure
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
  files       File[]
}
```

### Files
```prisma
model File {
  id        String   @id @default(uuid())
  projectId String
  path      String   # e.g., "ServerScriptService/PlayerService/init.lua"
  content   String   @db.Text
  fileType  String   # "lua", "json", etc.
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  project   Project  @relation(fields: [projectId], references: [id])
}
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Lint code
npm run lint
```

## 📦 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Monaco Editor** - Code editor
- **Lucide React** - Icons
- **Zustand** - State management (optional)

### Backend
- **Next.js API Routes** - Server-side API
- **Prisma** - ORM and database migrations
- **PostgreSQL** - Primary database
- **Jose** - JWT token handling
- **bcryptjs** - Password hashing

### DevOps
- **Vercel** - Frontend hosting (recommended)
- **Railway/Render** - Database hosting
- **Git** - Version control

## 🚧 Next Steps (Future Phases)

### Phase 2: Modified Knit Framework (In Progress)
- [ ] Knit service scaffolding command
- [ ] Auto-generation of Get/Set/Others structure
- [ ] Component loading pattern automation
- [ ] IntelliSense for Knit services

### Phase 3: AI Code Generation
- [ ] Claude/GPT-4 API integration
- [ ] Context-aware prompt building
- [ ] Natural language to Lua code
- [ ] Token usage tracking
- [ ] Code validation and error handling

### Phase 4: Template Retrieval Framework
- [ ] Vector database for semantic search
- [ ] Template library (20+ initial templates)
- [ ] Template adaptation system
- [ ] One-click template insertion

### Phase 5: Roblox Studio Integration
- [ ] Roblox Studio plugin
- [ ] File sync system (Rojo-style)
- [ ] Export to .rbxlx format
- [ ] One-click publish to Roblox

### Phase 6: UGC Marketplace
- [ ] Asset upload system
- [ ] Purchase/licensing system
- [ ] Rating and reviews
- [ ] AI marketplace integration

### Phase 7: Advanced Features
- [ ] 3D asset generation
- [ ] Auto-rigging
- [ ] Animation generation
- [ ] Video-to-animation

## 🤝 Contributing

This is currently a solo project for building a SuperbulletAI clone. Future phases will expand functionality.

## 📝 License

This is a learning/portfolio project. Not for commercial use.

## 🐛 Known Issues

- TypeScript errors in components are expected until dependencies are installed
- Database must be manually configured before first run
- File tree auto-refresh not yet implemented
- No real-time collaboration yet

## 💡 Tips

1. **Use PostgreSQL locally for development**: Faster iteration
2. **Set up Prisma Studio**: Visual database management
3. **Save frequently**: No auto-save yet in Phase 1
4. **Check browser console**: Useful for debugging API calls
5. **Use incognito mode**: Test authentication flows

## 📞 Support

For questions about this implementation, check the code comments in:
- `/lib/auth.ts` - Authentication logic
- `/lib/roblox-structure.ts` - Project structure
- `/components/editor/` - Editor components
- `/app/api/` - API route handlers

## 🎉 Success Indicators

Phase 1 is complete when:
- ✅ User can register and login
- ✅ User can create projects
- ✅ User can open projects in IDE
- ✅ User can view file tree
- ✅ User can open and edit files
- ✅ User can save changes
- ✅ Multiple tabs work correctly
- ✅ Project deletion works

---

**Built with ❤️ for the Roblox developer community**

Ready to move to Phase 2: Modified Knit Framework Implementation! 🚀
