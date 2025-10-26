import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log('[Register] Received registration request for:', email)

    // Validate input
    if (!email || !password) {
      console.log('[Register] Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log('[Register] Checking if user exists...')
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('[Register] User already exists:', email)
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('[Register] Hashing password...')
    const passwordHash = await hashPassword(password)

    // Create user
    console.log('[Register] Creating user in database...')
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
      },
    })

    console.log('[Register] User created successfully:', user.id)

    // Create token
    const token = await createToken({ userId: user.id, email: user.email })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tokensRemaining: user.tokensRemaining,
      },
      token,
    })
  } catch (error) {
    console.error('[Register] Registration error:', error)
    console.error('[Register] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
