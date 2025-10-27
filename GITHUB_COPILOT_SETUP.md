# 🤖 GitHub Copilot API Setup Guide

Complete guide to integrate GitHub Copilot with SuperBulletAI for AI-powered code generation.

---

## 📋 Prerequisites

1. **Active GitHub Copilot Subscription**
   - Individual: $10/month or $100/year
   - Business: $19/user/month
   - Sign up at: https://github.com/features/copilot

2. **GitHub Account**
   - Must have Copilot access enabled
   - Personal or Organization account

---

## 🔑 Step 1: Get Your GitHub Token

### Method 1: Personal Access Token (Recommended)

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `SuperBulletAI Copilot`
4. Set expiration: **No expiration** (or custom)
5. Select scopes:
   - ✅ `copilot` (if available)
   - ✅ `read:user`
   - ✅ `user:email`
6. Click **"Generate token"**
7. **Copy the token immediately** (starts with `ghp_...`)
   - You won't be able to see it again!
   - Save it securely

### Method 2: Using GitHub CLI

```bash
# Install GitHub CLI if not already installed
brew install gh

# Login and authenticate
gh auth login

# Get your token
gh auth token
# Copy the output (starts with ghp_...)
```

---

## 🚀 Step 2: Add Token to Vercel (Production)

```bash
# Navigate to your project
cd /Users/ronaldgospeljangam/Desktop/stuff/SuperBullet

# Make sure you're using Node 20
export PATH="/usr/local/opt/node@20/bin:$PATH"

# Add GitHub token to Vercel production environment
npx vercel env add GITHUB_TOKEN production --scope jangamronaldgospel-gmailcoms-projects
```

When prompted:
1. Paste your GitHub token: `ghp_...`
2. Press Enter

Expected output:
```
✅ Added Environment Variable GITHUB_TOKEN to Project superbullet-ai [1s]
```

---

## 🔄 Step 3: Redeploy to Production

```bash
# Trigger a new production deployment
npx vercel --prod --scope jangamronaldgospel-gmailcoms-projects --yes
```

Wait for deployment to complete (~30-40 seconds):
```
✅ Production: https://superbullet-ai.vercel.app [1m]
```

---

## 💻 Step 4: Local Development Setup

Create or edit `.env.local`:

```bash
# Create .env.local file
cat > .env.local << 'EOF'
# GitHub Copilot API
GITHUB_TOKEN="ghp_your_actual_token_here"

# Database (use your Neon connection string)
DATABASE_URL="postgresql://neondb_owner:npg_IL3nq0ReVQKB@ep-dawn-dew-ahrmy777-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
EOF
```

Replace `ghp_your_actual_token_here` with your actual token.

---

## 🧪 Step 5: Test the Integration

### Production Test

1. Go to https://superbullet-ai.vercel.app
2. Log in to your account
3. Open any project
4. Click **"Generate Knit Service"**
5. Fill out the form:
   ```
   Service Name: TestService
   
   Get Component:
   - Name: GetPlayerData
   - Description: Retrieve player data from DataStore including level, coins, and inventory. Cache for 60 seconds to reduce API calls.
   
   Set Component:
   - Name: UpdatePlayerCoins
   - Description: Update player's coin balance with validation. Ensure value is positive number. Save to DataStore and fire changed event.
   ```
6. **✅ Check "Generate implementation code with AI"**
7. Click **"Generate Service"**
8. Open the generated files - they should have detailed AI-generated code!

### Local Test

```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Test as above
```

---

## 📊 Verify It's Working

### Check Vercel Logs

```bash
# View real-time logs
npx vercel logs https://superbullet-ai.vercel.app --scope jangamronaldgospel-gmailcoms-projects
```

Look for:
```
[AI] Using GitHub Copilot API
✅ Generated code successfully
```

### Check Browser Console

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Generate a service with AI enabled
4. Look for:
   ```
   [Knit Scaffold] Response data: {
     success: true,
     code: "-- AI-generated code...",
     explanation: "AI-generated GET component using GitHub Copilot"
   }
   ```

---

## 🎯 How It Works

### Priority Order

SuperBulletAI checks for API keys in this order:

1. **GitHub Copilot** (`GITHUB_TOKEN`) ⭐ Your choice!
2. OpenAI (`OPENAI_API_KEY`)
3. Anthropic (`ANTHROPIC_API_KEY`)
4. Template fallback (no AI)

Since you set `GITHUB_TOKEN`, it will always use GitHub Copilot first.

### API Endpoint

GitHub Copilot uses:
```
POST https://api.githubcopilot.com/chat/completions
```

With headers:
```
Authorization: Bearer ghp_...
Editor-Version: vscode/1.85.0
Editor-Plugin-Version: copilot-chat/0.11.1
```

---

## 💰 Cost & Limits

### GitHub Copilot Pricing

- **Individual**: $10/month or $100/year
- **Business**: $19/user/month
- **Unlimited API calls** (no per-token pricing!)

### Compared to OpenAI

| Provider | Cost | Limits |
|----------|------|--------|
| GitHub Copilot | $10/month flat | Unlimited |
| OpenAI GPT-4 | $0.03/1K tokens | Pay per use |
| Anthropic Claude | $0.015/1K tokens | Pay per use |

**Winner**: GitHub Copilot for unlimited usage! 🎉

---

## 🔧 Troubleshooting

### "Unauthorized" Error

**Problem**: GitHub token invalid or expired

**Solutions**:
```bash
# 1. Check if token is set in Vercel
npx vercel env ls production --scope jangamronaldgospel-gmailcoms-projects

# Should show:
# GITHUB_TOKEN = (Encrypted)

# 2. Verify token is valid
curl -H "Authorization: Bearer ghp_YOUR_TOKEN" https://api.github.com/user

# Should return your GitHub user info

# 3. Generate new token if expired
# Go to https://github.com/settings/tokens
```

### "Copilot Subscription Required"

**Problem**: GitHub account doesn't have active Copilot subscription

**Solution**:
1. Go to https://github.com/settings/copilot
2. Check if subscription is active
3. If not, subscribe at https://github.com/features/copilot

### AI Not Generating Code

**Check these**:

```bash
# 1. Environment variable is set
npx vercel env ls production | grep GITHUB_TOKEN

# 2. Recent deployment picked up the variable
npx vercel ls | head -3

# 3. Redeploy if needed
npx vercel --prod --yes
```

### Generated Code is Generic

**Problem**: Not enough context in description

**Solution**: Provide detailed descriptions:

❌ **Bad**:
```
Description: Get data
```

✅ **Good**:
```
Description: Retrieve player's persistent data from DataStore2 including level (number), coins (number), inventory (array of item IDs), and last login time (Unix timestamp). Implement error handling with pcall. Return default values if player is new: {level=1, coins=0, inventory={}, lastLogin=0}. Cache result in memory for 60 seconds to reduce API calls.
```

---

## 🎨 Customization

### Change AI Model

Edit `/lib/ai/code-generator.ts`:

```typescript
// In generateWithGitHubCopilot function:
body: JSON.stringify({
  messages: [...],
  model: 'gpt-4',  // Try: 'gpt-4-turbo', 'gpt-3.5-turbo'
  temperature: 0.7, // Lower = more deterministic (0-1)
  max_tokens: 1000, // Increase for longer code
  stream: false,
}),
```

### Customize Prompt

Edit the `buildAIPrompt` function:

```typescript
export function buildAIPrompt(request: CodeGenerationRequest): string {
  return `Generate a Roblox Lua Knit framework component.

Component Name: ${request.componentName}
Type: ${request.componentType}
Description: ${request.description}

Requirements:
- Use modern Lua 5.1 syntax
- Include type annotations in comments
- Add error handling with pcall
- Validate all inputs
- Add performance optimizations
- Include usage examples in comments
- Follow Roblox best practices
- Use DataStore2 for persistence
- Implement caching where appropriate

Return ONLY the Lua code, no markdown or explanations.`
}
```

---

## 📈 Monitoring Usage

### GitHub API Rate Limits

```bash
# Check your rate limit status
curl -H "Authorization: Bearer ghp_YOUR_TOKEN" \
  https://api.github.com/rate_limit
```

Response shows:
```json
{
  "resources": {
    "core": {
      "limit": 5000,
      "remaining": 4999,
      "reset": 1730000000
    }
  }
}
```

### Vercel Deployment Logs

```bash
# View all function logs
npx vercel logs https://superbullet-ai.vercel.app

# Filter for AI generation
npx vercel logs https://superbullet-ai.vercel.app | grep "\[AI\]"
```

---

## 🔐 Security Best Practices

### 1. Token Permissions

✅ **Do**:
- Use tokens with minimal required scopes
- Set expiration dates (rotate regularly)
- One token per application

❌ **Don't**:
- Share tokens publicly
- Commit tokens to git
- Use tokens with admin scopes

### 2. Environment Variables

✅ **Do**:
- Store tokens in environment variables only
- Use Vercel's encrypted storage
- Different tokens for dev/prod

❌ **Don't**:
- Hardcode tokens in source code
- Log tokens in console
- Store in client-side code

### 3. Token Rotation

```bash
# Every 3-6 months:
# 1. Generate new token
# 2. Update in Vercel
npx vercel env rm GITHUB_TOKEN production
npx vercel env add GITHUB_TOKEN production

# 3. Redeploy
npx vercel --prod --yes

# 4. Revoke old token at GitHub
# https://github.com/settings/tokens
```

---

## ✅ Success Checklist

- [ ] Active GitHub Copilot subscription ($10/month)
- [ ] Generated GitHub personal access token (ghp_...)
- [ ] Added GITHUB_TOKEN to Vercel production
- [ ] Redeployed application
- [ ] Added GITHUB_TOKEN to `.env.local` for local dev
- [ ] Tested AI generation in production
- [ ] Verified logs show "Using GitHub Copilot API"
- [ ] Generated code is detailed and production-ready

---

## 🎉 You're All Set!

Now when you generate Knit services:
- ✅ AI checkbox enabled = GitHub Copilot generates code
- ✅ Unlimited generations (included in subscription)
- ✅ High-quality, production-ready Lua code
- ✅ Context-aware based on your descriptions
- ✅ Faster than manual coding

**Start building faster with AI! 🚀**

---

## 📞 Need Help?

### Common Commands

```bash
# Check token in Vercel
npx vercel env ls production

# View logs
npx vercel logs https://superbullet-ai.vercel.app

# Redeploy
npx vercel --prod --yes

# Test token validity
curl -H "Authorization: Bearer ghp_YOUR_TOKEN" https://api.github.com/user
```

### Resources

- GitHub Copilot Docs: https://docs.github.com/en/copilot
- API Reference: https://docs.github.com/en/rest
- Vercel Docs: https://vercel.com/docs
- Knit Framework: https://sleitnick.github.io/Knit/

---

*Last Updated: October 26, 2025*
*Made with ❤️ for the Roblox development community*
