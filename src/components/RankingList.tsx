'use client'

import { PlayerAvatar } from './PlayerAvatar'
import { TrophyIcon } from '@heroicons/react/24/outline'

interface RankingPlayer {
  id: number
  name: string
  points: number
  position: number
}

export function RankingList() {
  // Simulando dados do ranking - em uma aplicação real, isso viria de uma API
  const players: RankingPlayer[] = [
    { id: 1, name: 'João Silva', points: 120, position: 1 },
    { id: 2, name: 'Maria Santos', points: 115, position: 2 },
    { id: 3, name: 'Pedro Oliveira', points: 100, position: 3 },
    { id: 4, name: 'Ana Costa', points: 95, position: 4 },
    { id: 5, name: 'Carlos Souza', points: 90, position: 5 },
    { id: 6, name: 'Beatriz Lima', points: 85, position: 6 },
  ]

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'text-yellow-500' // Ouro
      case 2:
        return 'text-gray-400' // Prata
      case 3:
        return 'text-amber-600' // Bronze
      default:
        return 'text-gray-500'
    }
  }

  const getPositionSize = (position: number) => {
    switch (position) {
      case 1:
        return 'h-6 w-6' // Maior para o primeiro lugar
      case 2:
      case 3:
        return 'h-5 w-5' // Médio para segundo e terceiro
      default:
        return 'h-4 w-4' // Padrão para os demais
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Ranking</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8">
                <TrophyIcon 
                  className={`${getPositionColor(player.position)} ${getPositionSize(player.position)}`}
                />
              </div>
              <PlayerAvatar name={player.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900">{player.name}</p>
                <p className="text-xs text-gray-500">{player.points} pontos</p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              #{player.position}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
