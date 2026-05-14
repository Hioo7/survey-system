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
    <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={[
            'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg',
            'text-sm font-medium transition-all duration-200 min-h-[44px]',
            activeTab === tab.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700',
          ].join(' ')}
        >
          <span className="shrink-0 text-base">{tab.icon}</span>
          <span className="truncate">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
