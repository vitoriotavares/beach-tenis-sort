'use client'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export function ParticipantsList() {
  const participants = [
    { id: 1, name: 'João Silva', paid: true, checkedIn: true },
    { id: 2, name: 'Maria Santos', paid: true, checkedIn: false },
    { id: 3, name: 'Pedro Oliveira', paid: false, checkedIn: false },
  ]

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Participantes</h2>
        <button
          type="button"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Sortear Duplas
        </button>
      </div>
      
      <ul role="list" className="divide-y divide-gray-200">
        {participants.map((participant) => (
          <li key={participant.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{participant.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {participant.paid ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm text-gray-500">Pagamento</span>
              </div>
              <div className="flex items-center gap-1">
                {participant.checkedIn ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm text-gray-500">Check-in</span>
              </div>
              <button
                type="button"
                className="rounded-md bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
