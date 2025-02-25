const { createParticipant } = require('../lib/supabase/queries')

async function seedParticipants() {
  const tournamentId = '56f0e266-cdaf-4c6c-abe3-8d4a300a7d01' // ID do torneio existente

  const participants = [
    {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '11999991111',
    },
    {
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '11999992222',
    },
    {
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      phone: '11999993333',
    },
    {
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '11999994444',
    },
  ]

  console.log('Inserindo participantes...')
  
  for (const participant of participants) {
    try {
      const data = await createParticipant({
        tournament_id: tournamentId,
        ...participant,
      })
      console.log('Participante inserido:', data)
    } catch (error) {
      console.error('Erro ao inserir participante:', participant.name, error)
    }
  }

  console.log('Participantes inseridos com sucesso!')
}

seedParticipants().catch(console.error)
