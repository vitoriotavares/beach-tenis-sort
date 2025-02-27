'use client'

import { useState, useEffect } from 'react'
import { CheckCircleIcon, CreditCardIcon } from '@heroicons/react/24/solid'
import { PlayerAvatar } from './PlayerAvatar'
import { PaymentModal } from './PaymentModal'
import { getTournamentParticipants, updateParticipant } from '@/lib/supabase/queries'

interface ParticipantsListProps {
  tournamentId: string
}

interface Participant {
  id: string
  name: string
  email: string
  phone: string
  paid: boolean
  checked_in: boolean
  avatar_url?: string
  tournament_id: string
  created_at: string
  updated_at: string
}

export function ParticipantsList({ tournamentId }: ParticipantsListProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadParticipants() {
      try {
        const data = await getTournamentParticipants(tournamentId)
        setParticipants(data)
      } catch (err) {
        console.error('Error loading participants:', err)
        setError('Erro ao carregar participantes')
      } finally {
        setLoading(false)
      }
    }

    loadParticipants()
  }, [tournamentId])

  const handleOpenPayment = (participant: Participant) => {
    setSelectedParticipant(participant)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = async (participantId: string) => {
    try {
      const updatedParticipant = await updateParticipant(participantId, { paid: true })
      setParticipants(participants.map(p => 
        p.id === participantId ? { ...p, paid: true } : p
      ))
      setIsPaymentModalOpen(false)
    } catch (err) {
      console.error('Error updating payment:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 text-center text-sm text-gray-500">
          Carregando participantes...
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
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Participantes</h2>
      </div>

      <div className="divide-y divide-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {participants.map((participant) => (
            <li key={participant.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PlayerAvatar 
                    name={participant.name} 
                    imageUrl={participant.avatar_url}
                    className="h-10 w-10" 
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{participant.name}</div>
                    <div className="text-sm text-gray-500">{participant.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Status de Pagamento */}
                  <div className="flex items-center gap-2">
                    <span 
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        participant.paid 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {participant.paid && <CheckCircleIcon className="h-3.5 w-3.5" />}
                      {participant.paid ? 'Pago' : 'Pendente'}
                    </span>
                    {!participant.paid && (
                      <button
                        onClick={() => handleOpenPayment(participant)}
                        className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
                      >
                        <CreditCardIcon className="h-3.5 w-3.5" />
                        Pagar
                      </button>
                    )}
                  </div>

                  {/* Status de Check-in */}
                  <span 
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      participant.checked_in 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {participant.checked_in && <CheckCircleIcon className="h-3.5 w-3.5" />}
                    {participant.checked_in ? 'Check-in realizado' : 'Aguardando check-in'}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {participants.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-500">
          Nenhum participante registrado ainda.
        </div>
      )}

      {selectedParticipant && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => handlePaymentSuccess(selectedParticipant.id)}
          amount={50.00}
          participant={selectedParticipant.name}
        />
      )}
    </div>
  )
}