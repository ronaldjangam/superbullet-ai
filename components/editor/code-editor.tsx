'use client'

import { useRef, useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { registerKnitIntelliSense, extractServicesFromProject, type KnitService } from '@/lib/editor/knit-intellisense'

interface CodeEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language?: string
  path?: string
  theme?: 'vs-dark' | 'light'
  projectFiles?: Array<{ path: string; content: string }>
}

export function CodeEditor({
  value,
  onChange,
  language = 'lua',
  path,
  theme = 'vs-dark',
  projectFiles = [],
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [intelliSenseRegistered, setIntelliSenseRegistered] = useState(false)

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: any) {
    editorRef.current = editor
    setIsEditorReady(true)
    
    // Configure editor for Lua
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: true },
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: false,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
    })

    // Register Knit IntelliSense for Lua files
    if (language === 'lua' && !intelliSenseRegistered) {
      try {
        // Extract services from project files
        const services: KnitService[] = extractServicesFromProject(projectFiles)
        
        // Register IntelliSense with Monaco
        registerKnitIntelliSense(monaco, services)
        
        setIntelliSenseRegistered(true)
        console.log('[Editor] Knit IntelliSense registered with', services.length, 'services')
      } catch (error) {
        console.error('[Editor] Failed to register IntelliSense:', error)
      }
    }
  }

  function handleEditorChange(value: string | undefined) {
    onChange(value)
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme}
        path={path}
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
