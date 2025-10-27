# 🚀 AI & IntelliSense Setup Guide

This guide explains how to enable AI code generation and IntelliSense in SuperBulletAI.

---

## 🤖 AI Code Generation Setup

### Step 1: Choose an AI Provider

You have three options:

#### Option 1: OpenAI (Recommended)
**Best for**: Production-ready code generation with GPT-4

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. **Cost**: ~$0.03 per 1K tokens (very affordable)

#### Option 2: Anthropic Claude
**Best for**: Long-form code generation and complex logic

1. Go to https://console.anthropic.com/
2. Create an account
3. Navigate to API Keys
4. Generate a new key (starts with `sk-ant-...`)
5. **Cost**: Similar to OpenAI

#### Option 3: GitHub Copilot API
**Best for**: If you already have Copilot subscription

1. Use your GitHub personal access token
2. Requires Copilot subscription ($10/month)

---

### Step 2: Add API Key to Vercel

For **Production** (vercel.app):

```bash
# Navigate to your project
cd /Users/ronaldgospeljangam/Desktop/stuff/SuperBullet

# Set environment variable in Vercel
export PATH="/usr/local/opt/node@20/bin:$PATH"
npx vercel env add OPENAI_API_KEY production --scope jangamronaldgospel-gmailcoms-projects
# When prompted, paste your API key: sk-...

# Redeploy to activate
npx vercel --prod --scope jangamronaldgospel-gmailcoms-projects --yes
```

For **Local Development**:

```bash
# Create .env.local file
echo 'OPENAI_API_KEY="sk-your-actual-key-here"' >> .env.local

# Or edit .env.local manually
nano .env.local
```

---

### Step 3: Test AI Generation

1. Go to https://superbullet-ai.vercel.app
2. Open any project
3. Click "Generate Knit Service"
4. Fill out the form with detailed descriptions:
   - Service Name: `PlayerStatsService`
   - Get Component: `GetPlayerLevel` - "Retrieve the current level of a player from the datastore"
   - Set Component: `SetPlayerLevel` - "Update player level and save to datastore with validation"
5. **Check the AI checkbox** ✅
6. Click "Generate Service"
7. Open the generated files - they should have AI-generated implementation code!

---

## 🧠 IntelliSense Integration

### What It Does

IntelliSense provides:
- ✅ Autocomplete for Knit framework methods
- ✅ Hover documentation
- ✅ Method signatures
- ✅ Parameter hints
- ✅ Your custom service methods

### How It Works

**Already Integrated!** 🎉

The IntelliSense is automatically enabled when you:
1. Open a `.lua` file in the editor
2. Start typing `Knit.` → See all Knit methods
3. Hover over any method → See documentation

### Try It Out

1. Open any Lua file in your IDE
2. Type: `Knit.`
3. You should see:
   ```
   Knit.CreateService()
   Knit.GetService()
   Knit.Start()
   Knit.OnStart()
   ```
4. Hover over `CreateService` to see:
   ```
   Knit.CreateService(serviceDefinition: table): Service
   Creates a new Knit service
   ```

### Custom Services

IntelliSense automatically detects your services:

```lua
-- If you have PlayerDataService/init.lua
local PlayerDataService = Knit.CreateService({ Name = "PlayerDataService" })

function PlayerDataService:GetCoins(playerId)
  -- ...
end

-- Then in another file, IntelliSense will suggest:
PlayerDataService.GetCoins(playerId)
```

---

## 🔧 Advanced Configuration

### Using Different AI Models

Edit `/lib/ai/code-generator.ts`:

```typescript
// Change GPT-4 to GPT-3.5 Turbo (faster, cheaper)
model: 'gpt-3.5-turbo',

// Or use GPT-4 Turbo (more capable)
model: 'gpt-4-turbo-preview',
```

### Customizing AI Prompts

Edit the `buildAIPrompt` function in `/lib/ai/code-generator.ts`:

```typescript
export function buildAIPrompt(request: CodeGenerationRequest): string {
  return `You are an expert Roblox Lua developer.
  
  Generate PRODUCTION-READY code for:
  Component: ${request.componentName}
  Type: ${request.componentType}
  Requirements: ${request.description}
  
  Include:
  - Error handling with pcall
  - Input validation
  - Type safety
  - Performance optimizations
  - Detailed comments
  
  Return ONLY Lua code, no explanations.`
}
```

### Adding More IntelliSense Items

Edit `/lib/editor/knit-intellisense.ts`:

```typescript
export const KNIT_CORE_API: KnitMethod[] = [
  // Add your custom framework methods here
  {
    name: 'YourCustomMethod',
    signature: 'Knit.YourCustomMethod(param: string): boolean',
    description: 'Does something awesome',
    returnType: 'boolean',
    params: [
      {
        name: 'param',
        type: 'string',
        description: 'The parameter description'
      }
    ]
  },
  // ... existing methods
]
```

---

## 💰 Cost Estimation

### OpenAI Pricing (GPT-4)

- **Input**: $0.03 per 1K tokens
- **Output**: $0.06 per 1K tokens

**Typical Usage**:
- Generate 1 component: ~500 tokens = $0.03
- Generate 10 components: ~5K tokens = $0.30
- Generate 100 components: ~50K tokens = $3.00

**For most indie developers**: ~$5-10/month

### Free Tier Options

If you want to avoid costs:
1. **Use templates** (already works without API key)
2. **Use Anthropic free tier** (some credits included)
3. **Use local AI** (Ollama, LM Studio)

---

## 🧪 Testing Without API Key

The system works WITHOUT an API key!

- ✅ Template-based code generation (no cost)
- ✅ IntelliSense works fully
- ✅ File scaffolding works
- ❌ AI-enhanced code generation (needs API key)

So you can use the platform for free and add AI when needed!

---

## 🐛 Troubleshooting

### "API Key Invalid"

```bash
# Verify your key is set in Vercel
npx vercel env ls production --scope jangamronaldgospel-gmailcoms-projects

# Should show: OPENAI_API_KEY = (Encrypted)
```

### "OpenAI API Error"

Check your API key:
1. Go to https://platform.openai.com/account/usage
2. Verify you have credits
3. Check if key has expired

### IntelliSense Not Working

1. Make sure you're editing a `.lua` file
2. Try refreshing the page (F5)
3. Check browser console for errors (F12)
4. Verify Monaco editor is loaded

### AI Generates Wrong Code

Improve your descriptions:

**Bad**: "Get data"  
**Good**: "Retrieve player's coin balance from DataStore2, return 0 if not found, cache result for 60 seconds"

More detail = Better AI code!

---

## 📊 Monitoring API Usage

### OpenAI Dashboard

1. Go to https://platform.openai.com/account/usage
2. View:
   - Daily usage
   - Cost breakdown
   - Token consumption
   - Model usage stats

### Set Budget Limits

```bash
# In OpenAI dashboard:
Settings → Billing → Usage limits
Set: $10/month (safe limit)
```

---

## 🎯 Quick Start Checklist

- [ ] Choose AI provider (OpenAI recommended)
- [ ] Get API key
- [ ] Add to Vercel environment variables
- [ ] Redeploy application
- [ ] Test with "Generate Knit Service" + AI checkbox
- [ ] Try IntelliSense by typing `Knit.` in editor
- [ ] Monitor API usage in provider dashboard

---

## 🆘 Need Help?

1. **Check API key**: `npx vercel env ls production`
2. **View logs**: `npx vercel logs https://superbullet-ai.vercel.app`
3. **Test locally**: Add key to `.env.local` and run `npm run dev`
4. **Check costs**: Visit provider's usage dashboard

---

## 🎉 Success!

Once set up, you'll have:
- 🤖 AI-powered code generation
- 🧠 Smart IntelliSense for Knit
- ⚡ Autocomplete for all your services
- 📝 Hover documentation
- 🚀 10x faster development

**Enjoy building with SuperBulletAI!** ✨

---

*Last Updated: October 26, 2025*
