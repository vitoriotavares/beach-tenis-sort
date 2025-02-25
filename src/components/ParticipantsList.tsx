'use client'

import { useState } from 'react'
import { CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { PlayerAvatar } from './PlayerAvatar'
import { PaymentModal } from './PaymentModal'

interface Participant {
  id: number
  name: string
  paid: boolean
  checkedIn: boolean
}

export function ParticipantsList() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [participants] = useState<Participant[]>([
    { id: 1, name: 'João Silva', paid: false, checkedIn: false },
    { id: 2, name: 'Maria Santos', paid: true, checkedIn: true },
    { id: 3, name: 'Pedro Oliveira', paid: false, checkedIn: false },
    { id: 4, name: 'Ana Costa', paid: true, checkedIn: false },
  ])

  const handleOpenPayment = (participant: Participant) => {
    setSelectedParticipant(participant)
    setIsPaymentModalOpen(true)
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Participantes</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <PlayerAvatar name={participant.name} />
              <div>
                <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                <div className="flex items-center gap-3 mt-1">
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
                      participant.checkedIn 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {participant.checkedIn && <CheckCircleIcon className="h-3.5 w-3.5" />}
                    {participant.checkedIn ? 'Check-in realizado' : 'Aguardando check-in'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
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
          amount={50.00}
          participant={selectedParticipant.name}
        />
      )}
    </div>
  )
}