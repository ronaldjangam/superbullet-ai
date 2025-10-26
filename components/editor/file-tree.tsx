'use client'

import { useState } from 'react'
import { FileNode } from '@/lib/roblox-structure'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FileTreeProps {
  rootNodes: FileNode[]
  onFileSelect: (file: FileNode) => void
  selectedFile?: FileNode
  onCreateFile?: (parentPath: string) => void
  onCreateFolder?: (parentPath: string) => void
}

function TreeNode({
  node,
  level = 0,
  onFileSelect,
  selectedFile,
}: {
  node: FileNode
  level?: number
  onFileSelect: (file: FileNode) => void
  selectedFile?: FileNode
}) {
  const [isOpen, setIsOpen] = useState(true)
  const isSelected = selectedFile?.id === node.id

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen)
    } else {
      onFileSelect(node)
    }
  }

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-accent rounded-sm text-sm',
          isSelected && 'bg-accent'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <span className="w-4 h-4 flex items-center justify-center">
            {isOpen ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
        {node.type === 'file' && <span className="w-4" />}
        
        {node.type === 'folder' ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-yellow-500" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-500" />
          )
        ) : (
          <File className="w-4 h-4 text-blue-500" />
        )}
        
        <span className="truncate">{node.name}</span>
      </div>
      
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({
  rootNodes,
  onFileSelect,
  selectedFile,
}: FileTreeProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {rootNodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
