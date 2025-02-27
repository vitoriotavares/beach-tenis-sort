'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTournament } from '@/lib/supabase/queries'
import { useAuth } from '@/contexts/AuthContext'

export function TournamentForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Verificar se o usuário está logado
    if (!user) {
      setError('Você precisa estar logado para criar um torneio.')
      setIsSubmitting(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      start_time: formData.get('start_time') as string,
      end_time: formData.get('end_time') as string,
      max_participants: parseInt(formData.get('max_participants') as string),
      creator_id: user.id,
    }

    try {
      await createTournament(data)
      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Erro ao criar torneio. Por favor, tente novamente.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ocean-900">
          Nome do Torneio
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border border-sand-300 bg-white/50 py-2 px-3 shadow-sm focus:border-sunset-500 focus:outline-none focus:ring-1 focus:ring-sunset-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-ocean-900">
          Data
        </label>
        <input
          type="date"
          name="date"
          id="date"
          required
          className="mt-1 block w-full rounded-md border border-sand-300 bg-white/50 py-2 px-3 shadow-sm focus:border-sunset-500 focus:outline-none focus:ring-1 focus:ring-sunset-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-ocean-900">
            Horário de Início
          </label>
          <input
            type="time"
            name="start_time"
            id="start_time"
            required
            className="mt-1 block w-full rounded-md border border-sand-300 bg-white/50 py-2 px-3 shadow-sm focus:border-sunset-500 focus:outline-none focus:ring-1 focus:ring-sunset-500"
          />
        </div>

        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-ocean-900">
            Horário de Término
          </label>
          <input
            type="time"
            name="end_time"
            id="end_time"
            required
            className="mt-1 block w-full rounded-md border border-sand-300 bg-white/50 py-2 px-3 shadow-sm focus:border-sunset-500 focus:outline-none focus:ring-1 focus:ring-sunset-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-ocean-900">
          Local
        </label>
        <input
          type="text"
          name="location"
          id="location"
          required
          className="mt-1 block w-full rounded-md border border-sand-300 bg-white/50 py-2 px-3 shadow-sm focus:border-sunset-500 focus:outline-none focus:ring-1 focus:ring-sunset-500"
        />
      </div>

      <div>
        <label htmlFor="max_participants" className="block text-sm font-medium text-ocean-900">
          Número Máximo de Participantes
        </label>
        <input
          type="number"
          name="max_participants"
          id="max_participants"
          min="2"
          required
          className="mt-1 block w-full rounded-md border border-sand-300 bg-white/50 py-2 px-3 shadow-sm focus:border-sunset-500 focus:outline-none focus:ring-1 focus:ring-sunset-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !user}
          className="rounded-md bg-sunset-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sunset-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunset-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Criando...' : 'Criar Torneio'}
        </button>
      </div>
    </form>
  )
}
