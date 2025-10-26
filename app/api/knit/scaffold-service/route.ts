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

    console.log('[Scaffold API] Received request:', { projectId, serviceName, components })

    // Validate input
    if (!projectId || !serviceName) {
      console.log('[Scaffold API] Missing required fields')
      return NextResponse.json(
        { error: 'Project ID and service name are required' },
        { status: 400 }
      )
    }

    // Verify project exists
    console.log('[Scaffold API] Checking if project exists...')
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      console.log('[Scaffold API] Project not found:', projectId)
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    console.log('[Scaffold API] Project found:', project.name)

    // Generate Knit service files
    const config: KnitServiceConfig = {
      serviceName,
      components: components || { get: [], set: [], others: [] }
    }
    
    console.log('[Scaffold API] Generating files for config:', config)
    const generatedFiles = generateKnitService(config)
    console.log('[Scaffold API] Generated', generatedFiles.length, 'files')

    // Create files in database
    console.log('[Scaffold API] Creating files in database...')
    const createdFiles = await Promise.all(
      generatedFiles.map(async (file) => {
        // Check if file already exists
        const existingFile = await prisma.file.findUnique({
          where: {
            projectId_path: {
              projectId,
              path: file.path,
            },
          },
        })

        if (existingFile) {
          // Update existing file
          console.log('[Scaffold API] Updating existing file:', file.path)
          return prisma.file.update({
            where: { id: existingFile.id },
            data: {
              content: file.content,
              fileType: file.fileType,
            },
          })
        } else {
          // Create new file
          console.log('[Scaffold API] Creating new file:', file.path)
          return prisma.file.create({
            data: {
              projectId,
              path: file.path,
              content: file.content,
              fileType: file.fileType,
            },
          })
        }
      })
    )
    console.log('[Scaffold API] Created/updated', createdFiles.length, 'files in database')

    // Update project structure
    console.log('[Scaffold API] Updating project structure...')
    const currentStructure = project.structure as any || {}
    const updatedStructure = updateProjectStructure(currentStructure, generatedFiles)

    await prisma.project.update({
      where: { id: projectId },
      data: { structure: updatedStructure },
    })
    console.log('[Scaffold API] Project structure updated')

    return NextResponse.json({
      success: true,
      files: createdFiles,
      message: `Generated ${serviceName} service with ${generatedFiles.length} files`,
    })
  } catch (error) {
    console.error('[Scaffold API] Error:', error)
    console.error('[Scaffold API] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { 
        error: 'Failed to scaffold service',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

/**
 * Update project structure with new files
 */
function updateProjectStructure(structure: any, files: Array<{ path: string; fileType: string }>) {
  // Start with existing structure or create a copy
  const updated = JSON.parse(JSON.stringify(structure))

  files.forEach(file => {
    const parts = file.path.split('/')
    
    // Find or create the root folder (e.g., "ReplicatedStorage")
    const rootFolderName = parts[0]
    if (!updated[rootFolderName]) {
      updated[rootFolderName] = {
        id: rootFolderName.toLowerCase().replace(/\s+/g, '-'),
        name: rootFolderName,
        type: 'folder',
        path: rootFolderName,
        children: [],
      }
    }

    // Navigate/create nested structure
    let currentNode = updated[rootFolderName]
    
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]
      const isLastPart = i === parts.length - 1
      const currentPath = parts.slice(0, i + 1).join('/')

      if (!currentNode.children) {
        currentNode.children = []
      }

      // Find existing child
      let childNode = currentNode.children.find((child: any) => child.name === part)

      if (!childNode) {
        // Create new node
        childNode = {
          id: currentPath.toLowerCase().replace(/[/\s]+/g, '-'),
          name: part,
          type: isLastPart ? 'file' : 'folder',
          path: currentPath,
          children: isLastPart ? undefined : [],
        }
        currentNode.children.push(childNode)
      }

      if (!isLastPart) {
        currentNode = childNode
      }
    }
  })

  return updated
}
