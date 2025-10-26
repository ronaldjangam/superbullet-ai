import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateKnitService, type KnitServiceConfig } from '@/lib/knit/templates'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, serviceName, components } = body as {
      projectId: string
      serviceName: string
      components: KnitServiceConfig['components']
    }

    // Validate input
    if (!projectId || !serviceName) {
      return NextResponse.json(
        { error: 'Project ID and service name are required' },
        { status: 400 }
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Generate Knit service files
    const config: KnitServiceConfig = {
      serviceName,
      components: components || { get: [], set: [], others: [] }
    }
    
    const generatedFiles = generateKnitService(config)

    // Create files in database
    const createdFiles = await Promise.all(
      generatedFiles.map(file =>
        prisma.file.create({
          data: {
            projectId,
            path: file.path,
            content: file.content,
            fileType: file.fileType,
          },
        })
      )
    )

    // Update project structure
    const currentStructure = project.structure as any || {}
    const updatedStructure = updateProjectStructure(currentStructure, generatedFiles)

    await prisma.project.update({
      where: { id: projectId },
      data: { structure: updatedStructure },
    })

    return NextResponse.json({
      success: true,
      files: createdFiles,
      message: `Generated ${serviceName} service with ${generatedFiles.length} files`,
    })
  } catch (error) {
    console.error('Scaffold service error:', error)
    return NextResponse.json(
      { error: 'Failed to scaffold service' },
      { status: 500 }
    )
  }
}

/**
 * Update project structure with new files
 */
function updateProjectStructure(structure: any, files: Array<{ path: string }>) {
  const updated = { ...structure }

  files.forEach(file => {
    const parts = file.path.split('/')
    let current = updated

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // File node
        if (!current.children) current.children = {}
        current.children[part] = {
          type: 'file',
          path: file.path,
        }
      } else {
        // Folder node
        if (!current.children) current.children = {}
        if (!current.children[part]) {
          current.children[part] = {
            type: 'folder',
            children: {},
          }
        }
        current = current.children[part]
      }
    })
  })

  return updated
}
