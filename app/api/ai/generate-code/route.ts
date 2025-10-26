import { NextResponse } from 'next/server'
import { generateComponentCode, type CodeGenerationRequest } from '@/lib/ai/code-generator'

export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/generate-code
 * Generate implementation code for a Knit component
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as CodeGenerationRequest

    // Validate input
    if (!body.componentName || !body.componentType || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields: componentName, componentType, description' },
        { status: 400 }
      )
    }

    // Generate code
    const result = await generateComponentCode(body)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('[AI Generate Code] Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate code',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
