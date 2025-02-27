'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PlayerAvatar } from './PlayerAvatar'
import { getTournamentParticipants, updateParticipant } from '@/lib/supabase/queries'
import type { Participant } from '@/lib/supabase/types'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { PaymentModal } from './PaymentModal'

interface UserRegistrationStatusProps {
  tournamentId: string
}

export function UserRegistrationStatus({ tournamentId }: UserRegistrationStatusProps) {
  const { user } = useAuth()
  const [userParticipant, setUserParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

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

  const handleOpenPayment = () => {
    if (userParticipant) {
      setIsPaymentModalOpen(true)
    }
  }

  const handlePaymentSuccess = async () => {
    if (!userParticipant) return
    
    try {
      await updateParticipant(userParticipant.id, { paid: true })
      setUserParticipant({
        ...userParticipant,
        paid: true
      })
      setIsPaymentModalOpen(false)
    } catch (err) {
      console.error('Error updating payment status:', err)
    }
  }

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

            {!userParticipant.paid && (
              <button
                onClick={handleOpenPayment}
                className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
              >
                <CreditCardIcon className="h-3.5 w-3.5" />
                Pagar
              </button>
            )}
          </div>
        </div>
      </div>

      {userParticipant && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          amount={50.00}
          participant={userParticipant.name}
        />
      )}
    </div>
  )
}
