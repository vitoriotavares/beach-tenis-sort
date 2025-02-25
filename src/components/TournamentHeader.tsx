'use client'

import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import type { Tournament } from '@/lib/supabase/types'

interface TournamentHeaderProps {
  tournament: Tournament & { participants?: [{ count: number }] }
}

export function TournamentHeader({ tournament }: TournamentHeaderProps) {
  // Formatar a data para exibição
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  // Formatar horário para exibição
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    return `${hours}:${minutes}`
  }

  // Número de participantes
  const participantCount = tournament.participants?.[0]?.count || 0

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-sand-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-ocean-900 font-display">{tournament.title}</h1>
            <div className="mt-4 flex flex-col gap-2 text-sm text-ocean-700">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-sunset-500" />
                <span>{formatDate(tournament.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-sunset-500" />
                <div className="flex items-center gap-1">
                  <span>Início: {formatTime(tournament.start_time)}</span>
                  <span className="text-ocean-400 mx-1">•</span>
                  <span>Término: {formatTime(tournament.end_time)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-sunset-500" />
                <span>{tournament.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-sunset-500" />
                <span>{participantCount}/{tournament.max_participants} participantes</span>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            className="rounded-md bg-sunset-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sunset-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunset-600 transition-colors"
          >
            Inscrever-se
          </button>
        </div>
      </div>
    </div>
  )
}
