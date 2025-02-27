'use client'

import { TournamentForm } from '@/components/TournamentForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewTournament() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirecionar usuários não logados para a página inicial
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Mostrar um estado de carregamento enquanto verificamos o login
  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-ocean-700">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  // Se o usuário não estiver logado, não renderizar nada (o redirecionamento acontecerá)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-ocean-900 font-display mb-8">
            Criar Novo Torneio
          </h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sand-200 p-6">
            <TournamentForm />
          </div>
        </div>
      </div>
    </div>
  )
}
