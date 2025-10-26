'use client'

import { useRef, useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface CodeEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language?: string
  path?: string
  theme?: 'vs-dark' | 'light'
}

export function CodeEditor({
  value,
  onChange,
  language = 'lua',
  path,
  theme = 'vs-dark',
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
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
    })
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
