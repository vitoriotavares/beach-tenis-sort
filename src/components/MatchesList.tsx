'use client'

import { useState } from 'react'
import { PlusIcon, PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { CreateMatchModal } from './CreateMatchModal'
import { PlayerAvatar } from './PlayerAvatar'

interface Match {
  id: number
  team1: string[]
  team2: string[]
  score1: number
  score2: number
  court: string
  status: 'pending' | 'in_progress' | 'completed'
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
          key={player}
          name={player}
          size="sm"
          className={index === 0 ? '' : 'ring-2 ring-white'}
        />
      ))}
    </div>
  );
}

export function MatchesList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      team1: ['João Silva', 'Maria Santos'],
      team2: ['Pedro Oliveira', 'Ana Costa'],
      score1: 2,
      score2: 1,
      court: 'Quadra 1',
      status: 'pending',
    },
  ])

  // Simulating available players - in a real app, this would come from props or context
  const availablePlayers = [
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Costa',
    'Carlos Souza',
    'Beatriz Lima'
  ]

  const handleScoreUpdate = (matchId: number, team: 1 | 2) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          score1: team === 1 ? match.score1 + 1 : match.score1,
          score2: team === 2 ? match.score2 + 1 : match.score2,
        }
      }
      return match
    }))
  }

  const handleCreateMatch = ({
    team1,
    team2,
    court,
  }: {
    team1: string[]
    team2: string[]
    court: string
  }) => {
    const newMatch: Match = {
      id: matches.length + 1,
      team1,
      team2,
      score1: 0,
      score2: 0,
      court,
      status: 'pending',
    }
    setMatches([...matches, newMatch])
  }

  const handleStartMatch = (matchId: number) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          status: 'in_progress',
        }
      }
      return match
    }))
  }

  const handleFinishMatch = (matchId: number) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          status: 'completed',
        }
      }
      return match
    }))
  }

  const handleReopenMatch = (matchId: number) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          status: 'in_progress',
        }
      }
      return match
    }))
  }

  const getStatusBadgeColor = (status: Match['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
    }
  }

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'pending':
        return 'Aguardando'
      case 'in_progress':
        return 'Em andamento'
      case 'completed':
        return 'Finalizada'
    }
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{match.court}</span>
                  <div className="flex items-center gap-2">
                    {match.status === 'pending' && (
                      <button
                        onClick={() => handleStartMatch(match.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        <PlayIcon className="h-4 w-4" />
                        Iniciar
                      </button>
                    )}
                    {match.status === 'in_progress' && (
                      <button
                        onClick={() => handleFinishMatch(match.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                      >
                        <StopIcon className="h-4 w-4" />
                        Finalizar
                      </button>
                    )}
                    {match.status === 'completed' && (
                      <button
                        onClick={() => handleReopenMatch(match.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                        Reabrir
                      </button>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(match.status)}`}>
                  {getStatusText(match.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <TeamAvatars players={match.team1} />
                  {match.status === 'in_progress' && (
                    <button
                      onClick={() => handleScoreUpdate(match.id, 1)}
                      className="mt-2 btn-secondary text-xs"
                    >
                      + Ponto
                    </button>
                  )}
                </div>

                <div className="mx-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {match.score1} - {match.score2}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-end">
                  <TeamAvatars players={match.team2} />
                  {match.status === 'in_progress' && (
                    <button
                      onClick={() => handleScoreUpdate(match.id, 2)}
                      className="mt-2 btn-secondary text-xs"
                    >
                      + Ponto
                    </button>
                  )}
                </div>
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
      />
    </>
  )
}
