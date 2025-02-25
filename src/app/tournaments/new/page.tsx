import { TournamentForm } from '@/components/TournamentForm'

export default function NewTournament() {
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
