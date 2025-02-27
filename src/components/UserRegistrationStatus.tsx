'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PlayerAvatar } from './PlayerAvatar'
import { getTournamentParticipants } from '@/lib/supabase/queries'
import type { Participant } from '@/lib/supabase/types'

interface UserRegistrationStatusProps {
  tournamentId: string
}

export function UserRegistrationStatus({ tournamentId }: UserRegistrationStatusProps) {
  const { user } = useAuth()
  const [userParticipant, setUserParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUserRegistration() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const participants = await getTournamentParticipants(tournamentId)
        const userParticipant = participants.find(p => p.email === user.email)
        
        if (userParticipant) {
          setUserParticipant(userParticipant)
        }
      } catch (error) {
        console.error('Error checking user registration:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUserRegistration()
  }, [user, tournamentId])

  if (!user || loading) {
    return null
  }

  if (!userParticipant) {
    return null
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <PlayerAvatar 
          name={userParticipant.name} 
          imageUrl={userParticipant.avatar_url} 
          size="md"
        />
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">Seu status de inscrição</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userParticipant.paid 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {userParticipant.paid ? 'Pagamento confirmado' : 'Pagamento pendente'}
            </span>
            
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userParticipant.checked_in 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {userParticipant.checked_in ? 'Check-in realizado' : 'Aguardando check-in'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
