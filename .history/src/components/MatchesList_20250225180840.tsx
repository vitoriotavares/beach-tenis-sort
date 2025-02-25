'use client'

import { useState } from 'react'

interface Match {
  id: number
  team1: string[]
  team2: string[]
  score1: number
  score2: number
  court: string
  status: 'pending' | 'in_progress' | 'completed'
}

export function MatchesList() {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      team1: ['João Silva', 'Maria Santos'],
      team2: ['Pedro Oliveira', 'Ana Costa'],
      score1: 6,
      score2: 4,
      court: 'Quadra 1',
      status: 'completed'
    },
    {
      id: 2,
      team1: ['Carlos Lima', 'Paula Souza'],
      team2: ['Roberto Dias', 'Lucia Ferreira'],
      score1: 3,
      score2: 2,
      court: 'Quadra 2',
      status: 'in_progress'
    }
  ])

  const handleScoreUpdate = (matchId: number, team: 1 | 2) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          [`score${team}`]: match[`score${team}`] + 1
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
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
    }
  }

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'in_progress':
        return 'Em Andamento'
      case 'completed':
        return 'Concluída'
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Partidas</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {matches.map((match) => (
          <div key={match.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{match.court}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(match.status)}`}>
                {getStatusText(match.status)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {match.team1.join(' & ')}
                </div>
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

              <div className="flex-1 text-right">
                <div className="text-sm font-medium text-gray-900">
                  {match.team2.join(' & ')}
                </div>
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
          Nenhuma partida foi criada ainda. Use o botão "Sortear Duplas" na aba de participantes para criar as partidas.
        </div>
      )}
    </div>
  )
}
