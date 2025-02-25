'use client'

import { useEffect, useState } from 'react'
import { getTournaments } from '@/lib/supabase/queries'
import { TournamentList } from '@/components/TournamentList'
import type { Tournament } from '@/lib/supabase/types'

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTournaments() {
      try {
        const data = await getTournaments()
        console.log('Loaded tournaments:', data)
        setTournaments(data)
      } catch (err) {
        console.error('Error loading tournaments:', err)
        setError('Erro ao carregar torneios')
      } finally {
        setLoading(false)
      }
    }

    loadTournaments()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-ocean-700">Carregando torneios...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <TournamentList initialTournaments={tournaments} />
    </main>
  )
}