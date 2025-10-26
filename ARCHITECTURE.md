# SuperbulletAI Architecture Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Landing    │  │  Auth Pages  │  │   Projects   │      │
│  │    Page     │→ │ Login/Signup │→ │   Dashboard  │      │
│  └─────────────┘  └──────────────┘  └──────┬───────┘      │
│                                              ↓               │
│                                     ┌────────────────┐      │
│                                     │   IDE Page     │      │
│                                     │  - File Tree   │      │
│                                     │  - Editor Tabs │      │
│                                     │  - Monaco      │      │
│                                     └────────┬───────┘      │
└──────────────────────────────────────────────┼──────────────┘
                                               │ HTTP Requests
                                               ↓
┌─────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  API Routes (REST)                    │  │
│  │                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │    Auth     │  │  Projects   │  │    Files    │  │  │
│  │  │  /register  │  │  /projects  │  │ /files/:id  │  │  │
│  │  │   /login    │  │ /projects/:id│  │   (CRUD)    │  │  │
│  │  │   /verify   │  │   (CRUD)    │  │             │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │
│  └─────────┼────────────────┼────────────────┼─────────┘  │
│            │                │                │             │
│            └────────────────┴────────────────┘             │
│                             │                              │
│                    ┌────────▼────────┐                     │
│                    │  JWT Middleware │                     │
│                    │   (Verify Token)│                     │
│                    └────────┬────────┘                     │
│                             │                              │
│                    ┌────────▼────────┐                     │
│                    │ Prisma ORM      │                     │
│                    │ - Type Safety   │                     │
│                    │ - Query Builder │                     │
│                    └────────┬────────┘                     │
└──────────────────────────────┼──────────────────────────────┘
                               │ SQL Queries
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                     POSTGRESQL DATABASE                      │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐  │
│  │  User   │  │ Project  │  │  File  │  │   Template   │  │
│  ├─────────┤  ├──────────┤  ├────────┤  ├──────────────┤  │
│  │ id      │  │ id       │  │ id     │  │ id           │  │
│  │ email   │  │ userId   │  │ projId │  │ name         │  │
│  │ passHash│  │ name     │  │ path   │  │ category     │  │
│  │ tokens  │  │ struct   │  │ content│  │ files (JSON) │  │
│  └─────────┘  └──────────┘  └────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

```
┌──────────┐
│  Browser │
└────┬─────┘
     │
     │ 1. POST /api/auth/register
     │    { email, password }
     ↓
┌─────────────┐
│  API Route  │
├─────────────┤
│ 2. Hash     │
│  password   │
│             │
│ 3. Create   │
│  user in DB │
│             │
│ 4. Generate │
│  JWT token  │
└────┬────────┘
     │
     │ 5. Return { user, token }
     ↓
┌──────────┐
│  Browser │
├──────────┤
│ 6. Store │
│  token in│
│ localStorage│
└──────────┘

Subsequent Requests:
┌──────────┐
│  Browser │──┐
└──────────┘  │
              │ Headers: { Authorization: "Bearer <token>" }
              ↓
         ┌─────────────┐
         │ API Route   │
         ├─────────────┤
         │ 1. Extract  │
         │  token      │
         │             │
         │ 2. Verify   │
         │  JWT        │
         │             │
         │ 3. Get user │
         │  from token │
         └─────────────┘
```

---

## 📁 File Management Flow

```
User clicks file in tree
         │
         ↓
    ┌─────────────┐
    │ FileTree    │ Check if tab already open?
    │ Component   │ ──Yes→ Switch to tab
    └──────┬──────┘
           │ No
           ↓
    Check if file exists in database?
           │
           ├─Yes─→ Load from database
           │       │
           │       ↓
           │  ┌──────────────┐
           │  │ GET /api/    │
           │  │ projects/:id/│
           │  │ files/:fileId│
           │  └──────┬───────┘
           │         │
           │         ↓
           │  Return { content }
           │         │
           └─No──→   │
                     ↓
              ┌──────────────┐
              │ POST /api/   │
              │ projects/:id/│
              │ files        │
              │ { path,      │
              │   content:"" }│
              └──────┬───────┘
                     │
                     ↓
              Create in database
                     │
                     ↓
              ┌──────────────┐
              │ Open new tab │
              │ with Monaco  │
              │ Editor       │
              └──────┬───────┘
                     │
        User edits content
                     │
                     ↓
              ┌──────────────┐
              │ Mark tab as  │
              │ dirty (•)    │
              └──────┬───────┘
                     │
        User clicks Save
                     │
                     ↓
              ┌──────────────┐
              │ PUT /api/    │
              │ projects/:id/│
              │ files/:fileId│
              │ { content }  │
              └──────┬───────┘
                     │
                     ↓
              Update database
                     │
                     ↓
              ┌──────────────┐
              │ Mark tab as  │
              │ clean        │
              └──────────────┘
```

---

## 🗂️ Component Hierarchy

```
app/ide/[id]/page.tsx (IDE Page)
│
├─ TopBar
│  ├─ MenuButton (← Back to projects)
│  ├─ ProjectName
│  ├─ SaveButton
│  ├─ RunButton (Future)
│  └─ SettingsButton
│
├─ MainLayout (flex row)
│  │
│  ├─ Sidebar (w-64)
│  │  │
│  │  └─ FileTree
│  │     └─ TreeNode (recursive)
│  │        ├─ Icon (Folder/File)
│  │        ├─ Name
│  │        └─ Children[]
│  │           └─ TreeNode
│  │              └─ TreeNode...
│  │
│  └─ EditorArea (flex-1)
│     │
│     ├─ EditorTabs
│     │  └─ Tab[]
│     │     ├─ Name
│     │     ├─ DirtyIndicator (•)
│     │     └─ CloseButton (×)
│     │
│     └─ CodeEditor
│        └─ Monaco Editor
│           ├─ Line Numbers
│           ├─ Syntax Highlighting
│           ├─ Minimap
│           └─ Autocomplete
```

---

## 💾 State Management

```
IDE Page State
├─ project: ProjectData | null
│  ├─ id
│  ├─ name
│  ├─ description
│  ├─ structure (JSON)
│  └─ files[]
│
├─ fileTree: FileNode[]
│  └─ FileNode
│     ├─ id
│     ├─ name
│     ├─ type (file/folder)
│     ├─ path
│     └─ children[]
│
├─ openTabs: EditorTab[]
│  └─ EditorTab
│     ├─ id (fileId)
│     ├─ title
│     ├─ path
│     └─ isDirty (boolean)
│
├─ activeTab: string | undefined
│
├─ fileContents: Map<fileId, content>
│
└─ loading, saving (booleans)
```

---

## 🔐 Security Flow

```
┌──────────────┐
│ User Request │
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│ Extract Token    │ Headers["Authorization"]
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ Verify JWT       │ jose.jwtVerify(token, secret)
└──────┬───────────┘
       │
       ├─ Valid ──→ Continue
       │
       └─ Invalid ─→ Return 401 Unauthorized

After verification:
       │
       ↓
┌──────────────────┐
│ Extract User ID  │ payload.userId
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ Check Resource   │ project.userId === user.userId
│ Ownership        │
└──────┬───────────┘
       │
       ├─ Authorized ──→ Continue
       │
       └─ Not Owned ───→ Return 403 Forbidden
```

---

## 🚀 Deployment Architecture

```
┌────────────────────────────────────────┐
│            GitHub Repository            │
│  - Source code                          │
│  - Configuration files                  │
│  - Database schema                      │
└────────────┬───────────────────────────┘
             │ git push
             ↓
┌────────────────────────────────────────┐
│         Vercel (Auto Deploy)           │
│                                         │
│  ┌────────────────────────────────┐   │
│  │  Build Process                 │   │
│  │  1. npm install                │   │
│  │  2. prisma generate            │   │
│  │  3. next build                 │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────┐   │
│  │  Production Server              │   │
│  │  - Next.js API Routes          │   │
│  │  - Static Assets               │   │
│  │  - Edge Functions              │   │
│  └────────────────────────────────┘   │
│                                         │
│  Environment Variables:                │
│  - DATABASE_URL                        │
│  - NEXTAUTH_SECRET                     │
│  - NEXTAUTH_URL                        │
└────────────┬───────────────────────────┘
             │ Prisma Client
             ↓
┌────────────────────────────────────────┐
│      Cloud Database (Supabase/Neon)   │
│  - PostgreSQL                          │
│  - Automatic backups                   │
│  - SSL connections                     │
│  - Connection pooling                  │
└────────────────────────────────────────┘

Users access via:
https://your-app.vercel.app
```

---

## 📊 Data Flow Example: Editing a File

```
1. User clicks "PlayerService/init.lua" in file tree

2. FileTree Component
   ├─ Checks if tab already open
   └─ If not, calls onFileSelect(file)

3. IDE Page Handler
   ├─ Finds file in project.files by path
   ├─ If found: Gets content from database
   └─ If not: Creates new file with empty content

4. Create Tab
   ├─ Add to openTabs array
   ├─ Set as activeTab
   └─ Load content into fileContents Map

5. Monaco Editor
   ├─ Receives content via props
   ├─ Displays with syntax highlighting
   └─ User starts typing...

6. On Change Handler
   ├─ Updates fileContents Map
   └─ Marks tab as dirty (isDirty: true)

7. User Clicks Save Button
   ├─ Gets content from fileContents
   ├─ Makes PUT request to API
   └─ Waits for response...

8. API Route
   ├─ Verifies JWT token
   ├─ Checks file ownership
   ├─ Updates database with new content
   └─ Returns success

9. Success Handler
   ├─ Marks tab as clean (isDirty: false)
   └─ Shows success indicator
```

---

## 🎯 Future Architecture (Phases 2-7)

```
Current (Phase 1):
Browser ←→ Next.js API ←→ PostgreSQL

Phase 3 (AI):
Browser ←→ Next.js API ←→ PostgreSQL
               ↓
        Claude/GPT-4 API

Phase 4 (Templates):
Browser ←→ Next.js API ←→ PostgreSQL
               ↓
        Vector Database (Pinecone)

Phase 5 (Roblox):
Browser ←→ Next.js API ←→ PostgreSQL
               ↓              ↓
        Roblox Plugin    WebSocket Server

Phase 6 (Marketplace):
Browser ←→ Next.js API ←→ PostgreSQL
               ↓              ↓
           Stripe API    S3 Storage
```

---

These diagrams help visualize how SuperbulletAI works under the hood! 🚀
