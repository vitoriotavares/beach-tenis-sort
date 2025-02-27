'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { getTournamentParticipants } from '@/lib/supabase/queries'

interface TabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tournamentId: string
}

export function Tabs({ activeTab, onTabChange, tournamentId }: TabsProps) {
  const { user } = useAuth()
  const [isUserCheckedIn, setIsUserCheckedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUserStatus() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const participants = await getTournamentParticipants(tournamentId)
        const userParticipant = participants.find(p => p.email === user.email)
        
        if (userParticipant && userParticipant.checked_in) {
          setIsUserCheckedIn(true)
        } else {
          setIsUserCheckedIn(false)
        }
      } catch (error) {
        console.error('Error checking user registration status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUserStatus()
  }, [user, tournamentId])

  // Definir as tabs disponíveis
  const tabs = [
    { id: 'participants', name: 'Participantes' },
    // A tab 'Partidas' só aparece se o usuário estiver inscrito e com check-in feito
    ...(isUserCheckedIn ? [{ id: 'matches', name: 'Partidas' }] : [])
  ]

  // Se a tab ativa for 'matches' mas o usuário não tem acesso a ela, mudar para 'participants'
  useEffect(() => {
    if (activeTab === 'matches' && !isUserCheckedIn) {
      onTabChange('participants')
    }
  }, [activeTab, isUserCheckedIn, onTabChange])

  if (loading) {
    return (
      <div className="border-b border-sand-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            className="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-sunset-500 text-sunset-600"
          >
            Participantes
          </button>
        </nav>
      </div>
    )
  }

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
