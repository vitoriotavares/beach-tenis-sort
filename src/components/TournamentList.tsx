'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, MapPinIcon, UserGroupIcon, ArrowRightIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Tournament, Participant } from '@/lib/supabase/types'
import { useAuth } from '@/contexts/AuthContext'
import { getTournamentParticipants } from '@/lib/supabase/queries'
import { PlayerAvatar } from './PlayerAvatar'

interface TournamentListProps {
  initialTournaments: Tournament[]
}

interface TournamentWithParticipants extends Tournament {
  participants: Participant[]
  participantCount: number
  userIsRegistered: boolean
}

export function TournamentList({ initialTournaments }: TournamentListProps) {
  const { user } = useAuth()
  const [tournaments, setTournaments] = useState<TournamentWithParticipants[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadParticipantsData() {
      try {
        const tournamentsWithParticipants = await Promise.all(
          initialTournaments.map(async (tournament) => {
            // Buscar participantes para este torneio
            const participants = await getTournamentParticipants(tournament.id)
            
            // Verificar se o usuário atual está inscrito
            const userIsRegistered = user 
              ? participants.some((p: Participant) => p.email === user.email)
              : false
              
            return {
              ...tournament,
              participants,
              participantCount: participants.length,
              userIsRegistered
            }
          })
        )
        
        setTournaments(tournamentsWithParticipants)
      } catch (error) {
        console.error('Error loading participants data:', error)
        // Fallback para os dados iniciais sem participantes
        setTournaments(
          initialTournaments.map(tournament => ({
            ...tournament,
            participants: [],
            participantCount: 0,
            userIsRegistered: false
          }))
        )
      } finally {
        setLoading(false)
      }
    }
    
    loadParticipantsData()
  }, [initialTournaments, user])

  const getStatusBadge = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center rounded-full bg-ocean-50 px-2 py-1 text-xs font-medium text-ocean-700">
            Em breve
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center rounded-full bg-sunset-50 px-2 py-1 text-xs font-medium text-sunset-700">
            Em andamento
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-sand-100 px-2 py-1 text-xs font-medium text-sand-700">
            Finalizado
          </span>
        )
    }
  }

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

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-ocean-900 font-display">
              Torneios
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-ocean-700">Carregando torneios...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-ocean-900 font-display">
            Torneios
          </h1>
          <Link
            href="/tournaments/new"
            className="rounded-md bg-sunset-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sunset-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunset-600 transition-colors"
          >
            Criar Torneio
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/tournaments/${tournament.id}`}
              className="group block"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sand-200 p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-2">
                    <h2 className="text-xl font-semibold text-ocean-900 group-hover:text-ocean-700 transition-colors">
                      {tournament.title}
                    </h2>
                    {tournament.userIsRegistered && (
                      <CheckBadgeIcon className="h-5 w-5 text-green-500" title="Você está inscrito neste torneio" />
                    )}
                  </div>
                  {getStatusBadge(tournament.status)}
                </div>

                <div className="space-y-3 text-sm text-ocean-700">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-sunset-500" />
                    <span>{formatDate(tournament.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-sunset-500" />
                    <span>{tournament.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-sunset-500" />
                    <span>
                      {tournament.participantCount}/{tournament.max_participants} participantes
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  {/* Avatares sobrepostos */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {tournament.participants.slice(0, 5).map((participant: Participant, index) => (
                      <div key={participant.id} className="inline-block" style={{ zIndex: 5 - index }}>
                        <PlayerAvatar 
                          name={participant.name} 
                          imageUrl={participant.avatar_url}
                          size="sm"
                          className="ring-2 ring-white" 
                        />
                      </div>
                    ))}
                    {tournament.participantCount > 5 && (
                      <div 
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white"
                        style={{ zIndex: 0 }}
                      >
                        +{tournament.participantCount - 5}
                      </div>
                    )}
                  </div>
                  
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-ocean-600 group-hover:text-ocean-700">
                    Ver detalhes
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ocean-700">Nenhum torneio encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
