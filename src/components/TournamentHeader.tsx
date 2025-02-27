'use client'

import { useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import type { Tournament } from '@/lib/supabase/types'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { registerUserForTournament } from '@/lib/supabase/queries'

interface TournamentHeaderProps {
  tournament: Tournament & { participants?: [{ count: number }] }
  onParticipantRegistered?: () => void
}

export function TournamentHeader({ tournament, onParticipantRegistered }: TournamentHeaderProps) {
  const { user, signInWithGoogle, loading } = useAuth()
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  
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
  
  // Função para lidar com a inscrição
  const handleRegister = async () => {
    try {
      // Se o usuário não estiver logado, inicia o fluxo de autenticação
      if (!user) {
        await signInWithGoogle()
        return
      }
      
      setRegistering(true)
      
      // Registra o usuário no torneio
      await registerUserForTournament(tournament.id, {
        id: user.id,
        name: user.user_metadata.name || user.email?.split('@')[0] || 'Usuário',
        email: user.email || '',
        avatar_url: user.user_metadata.avatar_url
      })
      
      setRegistered(true)
      if (onParticipantRegistered) {
        onParticipantRegistered()
      }
    } catch (error) {
      console.error('Error registering for tournament:', error)
      alert('Erro ao se inscrever no torneio. Tente novamente.')
    } finally {
      setRegistering(false)
    }
  }
  
  // Determina o texto do botão
  const getButtonText = () => {
    if (loading || registering) return 'Carregando...'
    if (registered) return 'Inscrito'
    if (!user) return 'Inscrever-se'
    return 'Confirmar inscrição'
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-sand-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <Link href="/" className="flex items-center text-ocean-600 hover:text-ocean-800 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Voltar para torneios</span>
          </Link>
        </div>
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
            onClick={handleRegister}
            disabled={loading || registering || registered || participantCount >= tournament.max_participants}
            className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
              registered 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : participantCount >= tournament.max_participants
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-sunset-500 text-white hover:bg-sunset-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunset-600'
            }`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  )
}
