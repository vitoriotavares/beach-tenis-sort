'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { CreateMatchModal } from './CreateMatchModal'
import { PlayerAvatar } from './PlayerAvatar'
import { getAllParticipants, getTournamentMatches, updateMatch, createMatch } from '@/lib/supabase/queries'

interface Participant {
  id: string
  name: string
}

interface Match {
  id: string
  court: string
  score1: number
  score2: number
  status: 'pending' | 'in_progress' | 'completed'
  team1: string[]
  team2: string[]
}

interface TeamAvatarsProps {
  players: string[]
  className?: string
}

function TeamAvatars({ players, className = '' }: TeamAvatarsProps) {
  return (
    <div className={`flex -space-x-3 ${className}`}>
      {players.map((player, index) => (
        <PlayerAvatar
          key={`${player}-${index}`}
          name={player}
          size="sm"
          className={index === 0 ? '' : 'ring-2 ring-white'}
        />
      ))}
    </div>
  );
}

export function MatchesList({ tournamentId }: { tournamentId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [players, matchesData] = await Promise.all([
          getAllParticipants(tournamentId),
          getTournamentMatches(tournamentId)
        ])
        console.log('Loaded players:', players)
        setAvailablePlayers(players)
        setMatches(matchesData as Match[])
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [tournamentId])

  const handleScoreUpdate = async (matchId: string, team: 1 | 2) => {
    try {
      const match = matches.find(m => m.id === matchId)
      if (!match) return

      const updatedMatch = await updateMatch(matchId, {
        score1: team === 1 ? match.score1 + 1 : match.score1,
        score2: team === 2 ? match.score2 + 1 : match.score2
      })

      setMatches(matches.map(m => m.id === matchId ? updatedMatch : m))
    } catch (err) {
      console.error('Error updating match score:', err)
    }
  }

  const handleCreateMatch = async ({
    team1_player1_id,
    team1_player2_id,
    team2_player1_id,
    team2_player2_id,
    court,
  }: {
    team1_player1_id: string
    team1_player2_id: string
    team2_player1_id: string
    team2_player2_id: string
    court: string
  }) => {
    try {
      console.log('Creating match with:', {
        team1_player1_id,
        team1_player2_id,
        team2_player1_id,
        team2_player2_id,
        court,
      })

      const match = await createMatch({
        tournament_id: tournamentId,
        team1_player1_id,
        team1_player2_id,
        team2_player1_id,
        team2_player2_id,
        court,
      })
      
      setMatches([match, ...matches])
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error creating match:', err)
    }
  }

  const handleStartMatch = async (matchId: string) => {
    try {
      const updatedMatch = await updateMatch(matchId, { status: 'in_progress' })
      setMatches(matches.map(m => m.id === matchId ? updatedMatch : m))
    } catch (err) {
      console.error('Error starting match:', err)
    }
  }

  const handleFinishMatch = async (matchId: string) => {
    try {
      const updatedMatch = await updateMatch(matchId, { status: 'completed' })
      setMatches(matches.map(m => m.id === matchId ? updatedMatch : m))
    } catch (err) {
      console.error('Error finishing match:', err)
    }
  }

  const handleReopenMatch = async (matchId: string) => {
    try {
      const updatedMatch = await updateMatch(matchId, { status: 'in_progress' })
      setMatches(matches.map(m => m.id === matchId ? updatedMatch : m))
    } catch (err) {
      console.error('Error reopening match:', err)
    }
  }

  const getStatusBadgeColor = (status: Match['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 text-center text-sm text-gray-500">
          Carregando dados...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 text-center text-sm text-red-500">
          {error}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Partidas</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="h-4 w-4" />
            Nova Partida
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {matches.map((match) => (
            <div key={match.id} className="p-4">
              {/* Status e Quadra */}
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-gray-500">{match.court}</span>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeColor(match.status)}`}>
                  {match.status === 'pending' && 'Aguardando'}
                  {match.status === 'in_progress' && 'Em andamento'}
                  {match.status === 'completed' && 'Finalizada'}
                </span>
              </div>

              {/* Times e Placar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Time 1 */}
                <div className="flex items-center gap-3 flex-1">
                  <TeamAvatars players={match.team1} />
                  <div className="text-sm text-gray-900">
                    {match.team1.join(' & ')}
                  </div>
                </div>

                {/* Placar */}
                <div className="flex items-center justify-center gap-3 font-mono text-xl font-semibold text-gray-900 min-w-[80px]">
                  <span>{match.score1}</span>
                  <span className="text-gray-400">-</span>
                  <span>{match.score2}</span>
                </div>

                {/* Time 2 */}
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <div className="text-sm text-gray-900 text-right">
                    {match.team2.join(' & ')}
                  </div>
                  <TeamAvatars players={match.team2} />
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end mt-3 gap-2">
                {match.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleStartMatch(match.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                  >
                    <PlayIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Iniciar</span>
                  </button>
                )}

                {match.status === 'in_progress' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleScoreUpdate(match.id, 1)}
                      className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                    >
                      +1 T1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScoreUpdate(match.id, 2)}
                      className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                    >
                      +1 T2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFinishMatch(match.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                    >
                      <StopIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Finalizar</span>
                    </button>
                  </>
                )}

                {match.status === 'completed' && (
                  <button
                    type="button"
                    onClick={() => handleReopenMatch(match.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Reabrir</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Nenhuma partida foi criada ainda. Clique no botão "Nova Partida" para criar uma partida manualmente.
          </div>
        )}
      </div>

      <CreateMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateMatch={handleCreateMatch}
        availablePlayers={availablePlayers}
        tournamentId={tournamentId}
      />
    </>
  )
}
