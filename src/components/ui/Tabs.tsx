'use client'

import { ReactNode } from 'react'

type Tab = {
  id: string
  label: string
  icon: ReactNode
}

type TabsProps = {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex bg-foam p-1 rounded-xl gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={[
            'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg',
            'text-sm font-medium transition-all duration-200 min-h-[44px]',
            activeTab === tab.id
              ? 'bg-cream text-roast shadow-sm'
              : 'text-cocoa hover:text-mocha hover:bg-vanilla',
          ].join(' ')}
        >
          <span className="shrink-0 text-base">{tab.icon}</span>
          <span className="truncate">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
