'use client'

import { useState } from 'react'

interface Tab {
  name: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

export function Tabs({ tabs }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div>
      <div className="border-b border-sand-200">
        <nav className="-mb-px flex gap-2" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setSelectedTab(index)}
              className={`
                whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors
                ${
                  selectedTab === index
                    ? 'bg-white text-ocean-700 border-x border-t border-sand-200'
                    : 'text-ocean-500 hover:text-ocean-700 hover:bg-sand-50'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-4">{tabs[selectedTab].content}</div>
    </div>
  )
}
