import TournamentList from '@/components/TournamentList'
import { CreateTournamentButton } from '@/components/CreateTournamentButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex h-16 justify-between items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Beach Tennis</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Torneios</h2>
          <CreateTournamentButton />
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <TournamentList />
        </div>
      </main>
    </div>
  )
}
