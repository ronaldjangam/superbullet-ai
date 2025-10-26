'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface EditorTab {
  id: string
  title: string
  path: string
  isDirty?: boolean
}

interface EditorTabsProps {
  tabs: EditorTab[]
  activeTab?: string
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
}

export function EditorTabs({
  tabs,
  activeTab,
  onTabClick,
  onTabClose,
}: EditorTabsProps) {
  return (
    <div className="flex items-center bg-muted/50 border-b border-border">
      <ScrollArea className="flex-1">
        <div className="flex">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                'flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer hover:bg-accent/50 transition-colors min-w-[120px] max-w-[200px]',
                activeTab === tab.id && 'bg-background'
              )}
              onClick={() => onTabClick(tab.id)}
            >
              <span className="truncate text-sm flex-1">
                {tab.isDirty && <span className="text-orange-500">• </span>}
                {tab.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
                className="hover:bg-accent rounded-sm p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
