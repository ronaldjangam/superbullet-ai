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

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const files = await prisma.file.findMany({
      where: { projectId: params.id },
      orderBy: { path: 'asc' },
    })

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Get files error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
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

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const { path, content, fileType } = await request.json()

    if (!path || content === undefined) {
      return NextResponse.json(
        { error: 'Path and content are required' },
        { status: 400 }
      )
    }

    // Check if file already exists
    const existingFile = await prisma.file.findUnique({
      where: {
        projectId_path: {
          projectId: params.id,
          path,
        },
      },
    })

    if (existingFile) {
      return NextResponse.json(
        { error: 'File already exists' },
        { status: 400 }
      )
    }

    const file = await prisma.file.create({
      data: {
        projectId: params.id,
        path,
        content,
        fileType: fileType || 'lua',
      },
    })

    return NextResponse.json({ file })
  } catch (error) {
    console.error('Create file error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
