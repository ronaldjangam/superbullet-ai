import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DEFAULT_ROBLOX_STRUCTURE } from '@/lib/roblox-structure'

async function getUserFromToken() {
  const headersList = headers()
  const authorization = headersList.get('authorization')

  if (!authorization) {
    return null
  }

  const token = authorization.replace('Bearer ', '')
  const payload = await verifyToken(token)

  return payload as { userId: string; email: string } | null
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.userId },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // Create project with default Roblox structure
    const project = await prisma.project.create({
      data: {
        userId: user.userId,
        name,
        description: description || null,
        structure: DEFAULT_ROBLOX_STRUCTURE as any,
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
