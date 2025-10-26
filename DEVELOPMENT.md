# SuperbulletAI Development Guide

## Quick Start

```bash
# 1. Run the setup script
./setup.sh

# 2. Start the development server
npm run dev

# 3. Open browser
open http://localhost:3000
```

## Development Workflow

### Creating a New User
1. Navigate to `/auth/register`
2. Enter email and password
3. System creates account with 1M free tokens
4. Automatically redirected to `/projects`

### Creating a New Project
1. From projects dashboard, click "New Project"
2. Enter project name and description
3. System creates project with default Roblox structure
4. Click "Open" to enter IDE

### Working in the IDE
1. **File Tree** (left sidebar) - Browse project structure
2. **Editor** (center) - Write code with Monaco Editor
3. **Tabs** (top) - Manage multiple open files
4. **Toolbar** (top) - Save, Run, Settings

### Saving Files
- Click "Save" button (or use Cmd/Ctrl + S in future)
- Orange dot on tab indicates unsaved changes
- Files are saved to PostgreSQL database

## Architecture Overview

### Frontend Flow
```
Landing Page (/)
    ↓
Auth Pages (/auth/login or /auth/register)
    ↓
Projects Dashboard (/projects)
    ↓
IDE Interface (/ide/[projectId])
```

### API Flow
```
User Action → Frontend Component → API Route → Prisma → PostgreSQL
                                      ↓
                               JWT Verification
```

### File Management Flow
```
1. User selects file from tree
2. Frontend checks if file exists in database
3. If yes: Load content from database
4. If no: Create new file with empty content
5. User edits in Monaco Editor
6. User clicks Save
7. Content sent to API
8. API updates database
9. Tab marked as clean
```

## Component Hierarchy

### IDE Page (`/app/ide/[id]/page.tsx`)
```
IDEPage
├── TopBar
│   ├── Menu Button (back to projects)
│   ├── Project Name
│   ├── Save Button
│   ├── Run Button
│   └── Settings Button
├── Sidebar (FileTree)
│   └── TreeNode (recursive)
│       ├── Folder Icon
│       ├── File Icon
│       └── Children
└── EditorArea
    ├── EditorTabs
    │   └── Tab
    │       ├── File Name
    │       ├── Dirty Indicator (•)
    │       └── Close Button (×)
    └── CodeEditor (Monaco)
```

## State Management

### IDE State
```typescript
- project: ProjectData | null           // Current project
- fileTree: FileNode[]                   // File structure
- openTabs: EditorTab[]                  // Open files
- activeTab: string | undefined          // Current tab ID
- fileContents: Map<string, string>      // File ID → Content
```

### Authentication State
```typescript
// Stored in localStorage
- token: string                          // JWT token
- user: { id, email, name, tokens }     // User info
```

## API Reference

### Authentication APIs

#### POST /api/auth/register
```typescript
Request: { email: string, password: string, name?: string }
Response: { user: User, token: string }
```

#### POST /api/auth/login
```typescript
Request: { email: string, password: string }
Response: { user: User, token: string }
```

#### GET /api/auth/verify
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { user: { userId, email } }
```

### Project APIs

#### GET /api/projects
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { projects: Project[] }
```

#### POST /api/projects
```typescript
Headers: { Authorization: "Bearer <token>" }
Request: { name: string, description?: string }
Response: { project: Project }
```

#### GET /api/projects/:id
```typescript
Headers: { Authorization: "Bearer <token>" }
Response: { project: Project & { files: File[] } }
```

### File APIs

#### POST /api/projects/:id/files
```typescript
Headers: { Authorization: "Bearer <token>" }
Request: { path: string, content: string, fileType: string }
Response: { file: File }
```

#### PUT /api/projects/:id/files/:fileId
```typescript
Headers: { Authorization: "Bearer <token>" }
Request: { content: string }
Response: { file: File }
```

## Database Queries

### Common Prisma Operations

#### Find user by email
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})
```

#### Create project with files
```typescript
const project = await prisma.project.create({
  data: {
    userId: user.id,
    name: 'My Project',
    structure: DEFAULT_ROBLOX_STRUCTURE,
    files: {
      create: [
        { path: 'init.lua', content: '', fileType: 'lua' }
      ]
    }
  },
  include: { files: true }
})
```

#### Update file content
```typescript
const file = await prisma.file.update({
  where: { id: fileId },
  data: { content: newContent }
})
```

## Testing Checklist

### Phase 1 Testing
- [ ] User registration works
- [ ] User login works
- [ ] Create project creates default structure
- [ ] File tree displays correctly
- [ ] Clicking file opens in editor
- [ ] Editing file shows dirty indicator
- [ ] Saving file persists changes
- [ ] Multiple tabs work
- [ ] Closing tab with unsaved changes prompts
- [ ] Deleting project works
- [ ] Logout clears token

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Run `npm install` to install dependencies

### Issue: "Prisma Client not generated"
**Solution**: Run `npm run db:generate`

### Issue: "Database connection failed"
**Solution**: Check DATABASE_URL in .env file

### Issue: "Unauthorized" errors
**Solution**: Check if token is stored in localStorage

### Issue: Monaco Editor not loading
**Solution**: Check browser console for errors, ensure @monaco-editor/react is installed

### Issue: File tree not updating
**Solution**: Currently no auto-refresh, reload page or implement WebSocket for Phase 2

## Performance Tips

1. **Debounce editor changes**: Don't save on every keystroke
2. **Lazy load files**: Only fetch content when tab is opened
3. **Cache file contents**: Store in state to avoid repeated API calls
4. **Optimize file tree**: Use React.memo for TreeNode components
5. **Use React.lazy**: Code split heavy components

## Security Best Practices

1. **Never expose JWT_SECRET**: Keep in environment variables
2. **Validate all inputs**: Use Prisma's type safety
3. **Hash passwords**: bcrypt with 12 rounds
4. **Sanitize user input**: Prevent XSS attacks
5. **Rate limit APIs**: Implement in Phase 3

## Debugging

### Enable Prisma Query Logs
```typescript
// In lib/prisma.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

### Check API Responses
```javascript
// In browser console
fetch('/api/projects', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
  .then(r => r.json())
  .then(console.log)
```

### Inspect Database
```bash
npm run db:studio
# Opens Prisma Studio at http://localhost:5555
```

## Next Phase Preparation

### Phase 2: Knit Framework
- Create service scaffolding API
- Add template insertion logic
- Implement component auto-generation
- Add Knit-specific IntelliSense

### Phase 3: AI Integration
- Set up Claude/GPT-4 API keys
- Build prompt construction system
- Implement token tracking
- Add AI generation UI

### Phase 4: Templates
- Set up vector database (Pinecone/Weaviate)
- Create template library
- Build semantic search
- Implement template adaptation

## Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/index.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction)

## Contributing

When adding new features:
1. Create a new branch
2. Follow existing code patterns
3. Add TypeScript types
4. Test thoroughly
5. Update documentation

---

Happy developing! 🚀
