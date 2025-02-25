'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface CreateMatchModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateMatch: (match: {
    team1: string[]
    team2: string[]
    court: string
  }) => void
  availablePlayers: string[]
}

export function CreateMatchModal({ isOpen, onClose, onCreateMatch, availablePlayers }: CreateMatchModalProps) {
  const [team1Players, setTeam1Players] = useState<string[]>(['', ''])
  const [team2Players, setTeam2Players] = useState<string[]>(['', ''])
  const [court, setCourt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateMatch({
      team1: team1Players,
      team2: team2Players,
      court,
    })
    // Reset form
    setTeam1Players(['', ''])
    setTeam2Players(['', ''])
    setCourt('')
    onClose()
  }

  const updateTeam1Player = (index: number, value: string) => {
    const newTeam = [...team1Players]
    newTeam[index] = value
    setTeam1Players(newTeam)
  }

  const updateTeam2Player = (index: number, value: string) => {
    const newTeam = [...team2Players]
    newTeam[index] = value
    setTeam2Players(newTeam)
  }

  const getAvailablePlayers = (team: string[], currentIndex: number) => {
    return availablePlayers.filter(player => 
      !team1Players.includes(player) && 
      !team2Players.includes(player) || 
      team[currentIndex] === player
    )
  }

  const isFormValid = () => {
    return team1Players.every(player => player !== '') &&
           team2Players.every(player => player !== '') &&
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

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Criar Nova Partida
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Time 1</label>
                        <div className="mt-2 space-y-2">
                          <select
                            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                            value={team1Players[0]}
                            onChange={(e) => updateTeam1Player(0, e.target.value)}
                            required
                          >
                            <option value="">Selecione o primeiro jogador</option>
                            {getAvailablePlayers(team1Players, 0).map((player) => (
                              <option key={player} value={player}>
                                {player}
                              </option>
                            ))}
                          </select>
                          <select
                            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                            value={team1Players[1]}
                            onChange={(e) => updateTeam1Player(1, e.target.value)}
                            required
                          >
                            <option value="">Selecione o segundo jogador</option>
                            {getAvailablePlayers(team1Players, 1).map((player) => (
                              <option key={player} value={player}>
                                {player}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Time 2</label>
                        <div className="mt-2 space-y-2">
                          <select
                            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                            value={team2Players[0]}
                            onChange={(e) => updateTeam2Player(0, e.target.value)}
                            required
                          >
                            <option value="">Selecione o primeiro jogador</option>
                            {getAvailablePlayers(team2Players, 0).map((player) => (
                              <option key={player} value={player}>
                                {player}
                              </option>
                            ))}
                          </select>
                          <select
                            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                            value={team2Players[1]}
                            onChange={(e) => updateTeam2Player(1, e.target.value)}
                            required
                          >
                            <option value="">Selecione o segundo jogador</option>
                            {getAvailablePlayers(team2Players, 1).map((player) => (
                              <option key={player} value={player}>
                                {player}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quadra</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          placeholder="Ex: Quadra 1"
                          value={court}
                          onChange={(e) => setCourt(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!isFormValid()}
                        >
                          Criar Partida
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={onClose}
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
