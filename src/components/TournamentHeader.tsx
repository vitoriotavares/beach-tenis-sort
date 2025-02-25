'use client'

import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline'

export function TournamentHeader() {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-sand-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-ocean-900 font-display">Torneio de Verão 2025</h1>
            <div className="mt-4 flex flex-col gap-2 text-sm text-ocean-700">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-sunset-500" />
                <span>25 de Fevereiro, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-sunset-500" />
                <div className="flex items-center gap-1">
                  <span>Início: 09:00</span>
                  <span className="text-ocean-400 mx-1">•</span>
                  <span>Término: 18:00</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-sunset-500" />
                <span>Arena Beach Tennis</span>
              </div>
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-sunset-500" />
                <span>12/24 participantes</span>
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
