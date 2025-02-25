'use client'

interface TabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  const tabs = [
    { id: 'participants', name: 'Participantes' },
    { id: 'matches', name: 'Partidas' },
  ]

  return (
    <div className="border-b border-sand-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? 'border-sunset-500 text-sunset-600'
                  : 'border-transparent text-ocean-500 hover:border-ocean-300 hover:text-ocean-700'
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  )
}
