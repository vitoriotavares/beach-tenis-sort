import { TournamentHeader } from '@/components/TournamentHeader'
import { ParticipantsList } from '@/components/ParticipantsList'
import { MatchesList } from '@/components/MatchesList'
import { RankingList } from '@/components/RankingList'
import { Tabs } from '@/components/Tabs'

export default function TournamentDetail() {
  return (
    <div className="min-h-screen">
      <TournamentHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-sand-200 p-1">
          <Tabs
            tabs={[
              { name: 'Participantes', content: <ParticipantsList /> },
              { name: 'Partidas', content: <MatchesList /> },
              { name: 'Ranking', content: <RankingList /> },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
