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
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const file = await prisma.file.findFirst({
      where: {
        id: params.fileId,
        project: {
          userId: user.userId,
        },
      },
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ file })
  } catch (error) {
    console.error('Get file error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content } = await request.json()

    if (content === undefined) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const file = await prisma.file.findFirst({
      where: {
        id: params.fileId,
        project: {
          userId: user.userId,
        },
      },
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    const updatedFile = await prisma.file.update({
      where: { id: params.fileId },
      data: { content },
    })

    return NextResponse.json({ file: updatedFile })
  } catch (error) {
    console.error('Update file error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const user = await getUserFromToken()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const file = await prisma.file.findFirst({
      where: {
        id: params.fileId,
        project: {
          userId: user.userId,
        },
      },
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    await prisma.file.delete({
      where: { id: params.fileId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
