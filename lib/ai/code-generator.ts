/**
 * AI Code Generation System for SuperBulletAI
 * Phase 3: Generate implementation code for Knit components
 */

export interface CodeGenerationRequest {
  componentName: string
  componentType: 'get' | 'set' | 'other'
  description: string
  context?: {
    serviceName: string
    relatedComponents?: string[]
    dataStructure?: string
  }
}

export interface CodeGenerationResponse {
  code: string
  explanation: string
  dependencies?: string[]
  warnings?: string[]
}

/**
 * Generate implementation code for a Knit component using AI
 */
export async function generateComponentCode(
  request: CodeGenerationRequest
): Promise<CodeGenerationResponse> {
  const { componentName, componentType, description, context } = request
  
  // Check for API keys in order of preference
  const openAIKey = process.env.OPENAI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  
  // Try GitHub Copilot first (if token provided)
  if (githubToken && githubToken !== 'ghp_...') {
    console.log('[AI] Using GitHub Copilot API')
    return generateWithGitHubCopilot(request, githubToken)
  }
  
  // Try OpenAI
  if (openAIKey && openAIKey !== 'sk-...') {
    console.log('[AI] Using OpenAI API')
    return generateWithOpenAI(request, openAIKey)
  }
  
  // Try Anthropic
  if (anthropicKey && anthropicKey !== 'sk-ant-...') {
    console.log('[AI] Using Anthropic API')
    return generateWithAnthropic(request, anthropicKey)
  }
  
  // Fallback to enhanced templates if no API key
  console.log('[AI] No API key found, using template fallback')
  
  switch (componentType) {
    case 'get':
      return generateGetCode(componentName, description, context)
    case 'set':
      return generateSetCode(componentName, description, context)
    case 'other':
      return generateOtherCode(componentName, description, context)
    default:
      throw new Error(`Unknown component type: ${componentType}`)
  }
}

/**
 * Generate code using GitHub Copilot API
 */
async function generateWithGitHubCopilot(
  request: CodeGenerationRequest,
  token: string
): Promise<CodeGenerationResponse> {
  try {
    const prompt = buildAIPrompt(request)
    
    const response = await fetch('https://api.githubcopilot.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Editor-Version': 'vscode/1.85.0',
        'Editor-Plugin-Version': 'copilot-chat/0.11.1',
        'User-Agent': 'GitHubCopilotChat/0.11.1',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert Roblox Lua developer specializing in the Knit framework. Generate production-ready, well-documented Lua code.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[AI] GitHub Copilot API error:', error)
      throw new Error(`GitHub Copilot API error: ${error.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const generatedCode = data.choices[0]?.message?.content || ''

    return {
      code: generatedCode,
      explanation: `AI-generated ${request.componentType.toUpperCase()} component using GitHub Copilot`,
      dependencies: [],
      warnings: ['Review the generated code before using in production'],
    }
  } catch (error) {
    console.error('[AI] GitHub Copilot generation failed:', error)
    // Fallback to templates on error
    return fallbackToTemplate(request)
  }
}

/**
 * Generate code using OpenAI GPT-4
 */
async function generateWithOpenAI(
  request: CodeGenerationRequest,
  apiKey: string
): Promise<CodeGenerationResponse> {
  try {
    const prompt = buildAIPrompt(request)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Roblox Lua developer specializing in the Knit framework. Generate production-ready, well-documented Lua code.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const generatedCode = data.choices[0]?.message?.content || ''

    return {
      code: generatedCode,
      explanation: `AI-generated ${request.componentType.toUpperCase()} component using GPT-4`,
      dependencies: [],
      warnings: ['Review the generated code before using in production'],
    }
  } catch (error) {
    console.error('[AI] OpenAI generation failed:', error)
    return fallbackToTemplate(request)
  }
}

/**
 * Generate code using Anthropic Claude
 */
async function generateWithAnthropic(
  request: CodeGenerationRequest,
  apiKey: string
): Promise<CodeGenerationResponse> {
  try {
    const prompt = buildAIPrompt(request)
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are an expert Roblox Lua developer specializing in the Knit framework.\n\n${prompt}`
          }
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const generatedCode = data.content[0]?.text || ''

    return {
      code: generatedCode,
      explanation: `AI-generated ${request.componentType.toUpperCase()} component using Claude`,
      dependencies: [],
      warnings: ['Review the generated code before using in production'],
    }
  } catch (error) {
    console.error('[AI] Anthropic generation failed:', error)
    return fallbackToTemplate(request)
  }
}

/**
 * Fallback to template generation
 */
function fallbackToTemplate(request: CodeGenerationRequest): CodeGenerationResponse {
  const { componentName, componentType, description, context } = request
  switch (componentType) {
    case 'get':
      return generateGetCode(componentName, description, context)
    case 'set':
      return generateSetCode(componentName, description, context)
    case 'other':
      return generateOtherCode(componentName, description, context)
    default:
      throw new Error(`Unknown component type: ${componentType}`)
  }
}

/**
 * Generate GET component code (read operations)
 */
function generateGetCode(
  name: string,
  description: string,
  context?: CodeGenerationRequest['context']
): CodeGenerationResponse {
  const code = `-- ${name} Component
-- Type: Get (Read operation)
-- Description: ${description}
-- AI-Generated by SuperBulletAI

local ${name} = {}

--[[
    ${description}
    
    @param playerId: number - The player's user ID
    @return any - The requested data
]]
function ${name}.Get(playerId)
    -- TODO: Implement data retrieval logic
    -- Example: Fetch from datastore, cache, or game state
    
    local success, data = pcall(function()
        -- Your implementation here
        return nil
    end)
    
    if success then
        return data
    else
        warn("[${name}] Failed to get data:", data)
        return nil
    end
end

return ${name}
`

  return {
    code,
    explanation: `Generated a GET component for ${description}. Includes error handling and pcall wrapper for safe execution.`,
    dependencies: [],
    warnings: ['Remember to implement actual data retrieval logic'],
  }
}

/**
 * Generate SET component code (write operations)
 */
function generateSetCode(
  name: string,
  description: string,
  context?: CodeGenerationRequest['context']
): CodeGenerationResponse {
  const code = `-- ${name} Component
-- Type: Set (Write operation)
-- Description: ${description}
-- AI-Generated by SuperBulletAI

local ${name} = {}

--[[
    ${description}
    
    @param playerId: number - The player's user ID
    @param value: any - The value to set
    @return boolean - Success status
]]
function ${name}.Set(playerId, value)
    -- Validate input
    if not playerId or not value then
        warn("[${name}] Invalid parameters")
        return false
    end
    
    -- TODO: Implement data modification logic
    local success, result = pcall(function()
        -- Your implementation here
        return true
    end)
    
    if success then
        return result
    else
        warn("[${name}] Failed to set data:", result)
        return false
    end
end

return ${name}
`

  return {
    code,
    explanation: `Generated a SET component for ${description}. Includes input validation and error handling.`,
    dependencies: [],
    warnings: ['Ensure proper data validation before saving'],
  }
}

/**
 * Generate OTHER component code (specialized operations)
 */
function generateOtherCode(
  name: string,
  description: string,
  context?: CodeGenerationRequest['context']
): CodeGenerationResponse {
  const code = `-- ${name} Component
-- Type: Other (Specialized operation)
-- Description: ${description}
-- AI-Generated by SuperBulletAI

local ${name} = {}

--[[
    ${description}
    
    Specialized component for business logic
]]
function ${name}.Execute(...)
    -- TODO: Implement specialized logic
    local args = {...}
    
    local success, result = pcall(function()
        -- Your implementation here
        return true
    end)
    
    if success then
        return result
    else
        warn("[${name}] Execution failed:", result)
        return false
    end
end

return ${name}
`

  return {
    code,
    explanation: `Generated an OTHER component for ${description}. Flexible structure for specialized operations.`,
    dependencies: [],
    warnings: ['Define clear function signatures for your use case'],
  }
}

/**
 * AI Prompt builder for external AI APIs
 */
export function buildAIPrompt(request: CodeGenerationRequest): string {
  const { componentName, componentType, description, context } = request
  
  return `You are an expert Roblox Lua developer specializing in the Knit framework.

Generate a Lua module for a Knit service component with the following specifications:

Component Name: ${componentName}
Component Type: ${componentType.toUpperCase()} (${getTypeDescription(componentType)})
Description: ${description}
${context?.serviceName ? `Service: ${context.serviceName}` : ''}
${context?.relatedComponents?.length ? `Related Components: ${context.relatedComponents.join(', ')}` : ''}

Requirements:
1. Follow Knit framework best practices
2. Include proper error handling with pcall
3. Add detailed comments and documentation
4. Use type annotations where applicable
5. Handle edge cases and validation
6. Return proper success/failure indicators
7. Follow Roblox Lua conventions

Generate only the Lua code, properly formatted and production-ready.`
}

function getTypeDescription(type: CodeGenerationRequest['componentType']): string {
  switch (type) {
    case 'get':
      return 'Read operation - retrieves data without side effects'
    case 'set':
      return 'Write operation - modifies data or state'
    case 'other':
      return 'Specialized operation - custom business logic'
  }
}
