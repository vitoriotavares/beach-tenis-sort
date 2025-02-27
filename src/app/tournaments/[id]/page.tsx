'use client'

import { useEffect, useState, useCallback } from 'react'
import { getTournamentById } from '@/lib/supabase/queries'
import { TournamentHeader } from '@/components/TournamentHeader'
import { ParticipantsList } from '@/components/ParticipantsList'
import { MatchesList } from '@/components/MatchesList'
import { Tabs } from '@/components/Tabs'
import { UserRegistrationStatus } from '@/components/UserRegistrationStatus'
import type { Tournament } from '@/lib/supabase/types'

interface PageProps {
  params: {
    id: string
  }
}

export default function TournamentPage({ params }: PageProps) {
  const [tournament, setTournament] = useState<Tournament & { participants?: [{ count: number }] }>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('participants')

  const loadTournament = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTournamentById(params.id)
      setTournament(data)
    } catch (err) {
      console.error('Error loading tournament:', err)
      setError('Erro ao carregar torneio')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadTournament()
  }, [loadTournament])

  // Função para recarregar os dados do torneio quando um novo participante se inscrever
  const handleParticipantRegistered = useCallback(() => {
    loadTournament()
    // Mudar para a aba de participantes
    setActiveTab('participants')
  }, [loadTournament])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-ocean-700">Carregando torneio...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error || 'Torneio não encontrado'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <TournamentHeader 
        tournament={tournament} 
        onParticipantRegistered={handleParticipantRegistered} 
      />
      <div className="container mx-auto px-4 py-6">
        <UserRegistrationStatus tournamentId={params.id} />
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sand-200 p-6">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tournamentId={params.id} />
          <div className="mt-6">
            {activeTab === 'participants' && (
              <ParticipantsList tournamentId={params.id} />
            )}
            {activeTab === 'matches' && (
              <MatchesList tournamentId={params.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
