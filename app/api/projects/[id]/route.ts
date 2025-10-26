import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
      include: {
        files: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description, structure } = await request.json()

    const project = await prisma.project.updateMany({
      where: {
        id: params.id,
        userId: user.userId,
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(structure && { structure }),
      },
    })

    if (project.count === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await prisma.project.deleteMany({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
