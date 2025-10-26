'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FileNode } from '@/lib/roblox-structure'
import { CodeEditor } from '@/components/editor/code-editor'
import { FileTree } from '@/components/editor/file-tree'
import { EditorTabs, EditorTab } from '@/components/editor/editor-tabs'
import { Button } from '@/components/ui/button'
import { Save, Play, Settings, Menu } from 'lucide-react'

interface ProjectData {
  id: string
  name: string
  description: string | null
  structure: any
  files: FileData[]
}

interface FileData {
  id: string
  path: string
  content: string
  fileType: string
}

export default function IDEPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<ProjectData | null>(null)
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([])
  const [activeTab, setActiveTab] = useState<string | undefined>()
  const [fileContents, setFileContents] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const res = await fetch(`/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        router.push('/projects')
        return
      }

      const data = await res.json()
      setProject(data.project)

      // Build file tree from structure
      if (data.project.structure) {
        const tree = Object.values(data.project.structure) as FileNode[]
        setFileTree(tree)
      }

      // Load file contents
      const contents = new Map<string, string>()
      data.project.files.forEach((file: FileData) => {
        contents.set(file.id, file.content)
      })
      setFileContents(contents)
    } catch (err) {
      console.error('Failed to fetch project:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file: FileNode) => {
    if (file.type !== 'file') return

    // Check if tab already exists
    const existingTab = openTabs.find(tab => tab.path === file.path)
    if (existingTab) {
      setActiveTab(existingTab.id)
      return
    }

    // Find file data
    const fileData = project?.files.find(f => f.path === file.path)
    if (!fileData) {
      // Create new file
      createNewFile(file)
      return
    }

    // Open new tab
    const newTab: EditorTab = {
      id: fileData.id,
      title: file.name,
      path: file.path,
    }
    setOpenTabs([...openTabs, newTab])
    setActiveTab(newTab.id)
  }

  const createNewFile = async (file: FileNode) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: file.path,
          content: '',
          fileType: 'lua',
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create file')
      }

      const data = await res.json()
      
      // Update project with new file
      if (project) {
        setProject({
          ...project,
          files: [...project.files, data.file],
        })
      }

      setFileContents(new Map(fileContents.set(data.file.id, '')))

      // Open tab
      const newTab: EditorTab = {
        id: data.file.id,
        title: file.name,
        path: file.path,
      }
      setOpenTabs([...openTabs, newTab])
      setActiveTab(newTab.id)
    } catch (err) {
      console.error('Failed to create file:', err)
      alert('Failed to create file')
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!activeTab || value === undefined) return

    setFileContents(new Map(fileContents.set(activeTab, value)))
    
    // Mark tab as dirty
    setOpenTabs(openTabs.map(tab => 
      tab.id === activeTab ? { ...tab, isDirty: true } : tab
    ))
  }

  const handleSave = async () => {
    if (!activeTab) return

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const content = fileContents.get(activeTab) || ''

      const res = await fetch(`/api/projects/${projectId}/files/${activeTab}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) {
        throw new Error('Failed to save file')
      }

      // Mark tab as clean
      setOpenTabs(openTabs.map(tab => 
        tab.id === activeTab ? { ...tab, isDirty: false } : tab
      ))
    } catch (err) {
      console.error('Failed to save file:', err)
      alert('Failed to save file')
    } finally {
      setSaving(false)
    }
  }

  const handleTabClose = (tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId)
    if (tab?.isDirty) {
      if (!confirm('You have unsaved changes. Close anyway?')) {
        return
      }
    }

    const newTabs = openTabs.filter(t => t.id !== tabId)
    setOpenTabs(newTabs)

    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1]?.id)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Project not found</p>
      </div>
    )
  }

  const activeFileContent = activeTab ? fileContents.get(activeTab) || '' : ''

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">{project.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving || !activeTab}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="ghost" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-64 border-r bg-card overflow-hidden">
          <div className="p-2 border-b">
            <p className="text-sm font-medium">Project Files</p>
          </div>
          <FileTree
            rootNodes={fileTree}
            onFileSelect={handleFileSelect}
            selectedFile={openTabs.find(t => t.id === activeTab) ? 
              fileTree.find(n => n.path === openTabs.find(t => t.id === activeTab)?.path) : undefined
            }
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {openTabs.length > 0 ? (
            <>
              <EditorTabs
                tabs={openTabs}
                activeTab={activeTab}
                onTabClick={setActiveTab}
                onTabClose={handleTabClose}
              />
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  value={activeFileContent}
                  onChange={handleEditorChange}
                  language="lua"
                  path={openTabs.find(t => t.id === activeTab)?.path}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">No files open</p>
                <p className="text-sm">Select a file from the file tree to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
