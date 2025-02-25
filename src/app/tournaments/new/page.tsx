import { TournamentForm } from '@/components/TournamentForm'

export default function NewTournament() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Criar Novo Torneio</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <TournamentForm />
        </div>
      </div>
    </div>
  )
}
