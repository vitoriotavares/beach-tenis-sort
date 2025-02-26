'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { createMatch } from '@/lib/supabase/queries'

interface Participant {
  id: string
  name: string
}

interface CreateMatchModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateMatch: (match: {
    team1_player1_id: string
    team1_player2_id: string
    team2_player1_id: string
    team2_player2_id: string
    court: string
  }) => void
  availablePlayers: Participant[]
  tournamentId: string
}

export function CreateMatchModal({ isOpen, onClose, onCreateMatch, availablePlayers, tournamentId }: CreateMatchModalProps) {
  const [team1Player1, setTeam1Player1] = useState('')
  const [team1Player2, setTeam1Player2] = useState('')
  const [team2Player1, setTeam2Player1] = useState('')
  const [team2Player2, setTeam2Player2] = useState('')
  const [court, setCourt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onCreateMatch({
        team1_player1_id: team1Player1,
        team1_player2_id: team1Player2,
        team2_player1_id: team2Player1,
        team2_player2_id: team2Player2,
        court,
      })
      handleClose()
    } catch (err) {
      console.error('Error creating match:', err)
      setError('Erro ao criar partida')
    }
  }

  const handleClose = () => {
    setTeam1Player1('')
    setTeam1Player2('')
    setTeam2Player1('')
    setTeam2Player2('')
    setCourt('')
    onClose()
  }

  const isFormValid = () => {
    return team1Player1 !== '' &&
           team1Player2 !== '' &&
           team2Player1 !== '' &&
           team2Player2 !== '' &&
           court !== ''
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Criar Nova Partida
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Partida</h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Time 1
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={team1Player1}
                                onChange={(e) => setTeam1Player1(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                              >
                                <option value="">Selecione...</option>
                                {availablePlayers.map((player) => (
                                  <option
                                    key={player.id}
                                    value={player.id}
                                    disabled={
                                      player.id === team1Player2 ||
                                      player.id === team2Player1 ||
                                      player.id === team2Player2
                                    }
                                  >
                                    {player.name}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={team1Player2}
                                onChange={(e) => setTeam1Player2(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                              >
                                <option value="">Selecione...</option>
                                {availablePlayers.map((player) => (
                                  <option
                                    key={player.id}
                                    value={player.id}
                                    disabled={
                                      player.id === team1Player1 ||
                                      player.id === team2Player1 ||
                                      player.id === team2Player2
                                    }
                                  >
                                    {player.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Time 2
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={team2Player1}
                                onChange={(e) => setTeam2Player1(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                              >
                                <option value="">Selecione...</option>
                                {availablePlayers.map((player) => (
                                  <option
                                    key={player.id}
                                    value={player.id}
                                    disabled={
                                      player.id === team1Player1 ||
                                      player.id === team1Player2 ||
                                      player.id === team2Player2
                                    }
                                  >
                                    {player.name}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={team2Player2}
                                onChange={(e) => setTeam2Player2(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                              >
                                <option value="">Selecione...</option>
                                {availablePlayers.map((player) => (
                                  <option
                                    key={player.id}
                                    value={player.id}
                                    disabled={
                                      player.id === team1Player1 ||
                                      player.id === team1Player2 ||
                                      player.id === team2Player1
                                    }
                                  >
                                    {player.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="court"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Quadra
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="court"
                                id="court"
                                value={court}
                                onChange={(e) => setCourt(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                placeholder="Ex: Quadra 1"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="text-sm text-red-600">
                          {error}
                        </div>
                      )}

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!isFormValid()}
                        >
                          Criar Partida
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={handleClose}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
