import { supabase } from './client'
import type { Tournament, Participant, Match } from './types'

// Tournaments
export async function getTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching tournaments:', error)
    throw error
  }
  
  return data as Tournament[]
}

// Get Tournament by ID
export async function getTournamentById(id: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      participants: participants(count)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching tournament:', error)
    throw error
  }

  return data as Tournament & { participants: [{ count: number }] }
}

// Participants
export async function getTournamentParticipants(tournamentId: string) {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching participants:', error)
    throw error
  }

  return data as Participant[]
}

export async function addParticipant(participant: Omit<Participant, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('participants')
    .insert(participant)
    .select()
    .single()

  if (error) throw error
  return data as Participant
}

export async function updateParticipant(id: string, updates: {
  paid?: boolean
  checked_in?: boolean
}) {
  const { data, error } = await supabase
    .from('participants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating participant:', error)
    throw error
  }

  return data
}

// Create Participant
export async function createParticipant(participant: {
  tournament_id: string
  name: string
  email: string
  phone: string
}) {
  const { data, error } = await supabase
    .from('participants')
    .insert({
      ...participant,
      paid: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating participant:', error)
    throw error
  }

  return data
}

export async function getCheckedInParticipants(tournamentId: string) {
  const { data, error } = await supabase
    .from('participants')
    .select('id, name')
    .eq('tournament_id', tournamentId)
    .order('name')

  if (error) {
    console.error('Error fetching checked-in participants:', error)
    throw error
  }

  return data
}

// Matches
export async function getTournamentMatches(tournamentId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      court,
      score1,
      score2,
      status,
      team1_player1:team1_player1_id(id, name),
      team1_player2:team1_player2_id(id, name),
      team2_player1:team2_player1_id(id, name),
      team2_player2:team2_player2_id(id, name)
    `)
    .eq('tournament_id', tournamentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tournament matches:', error)
    throw error
  }

  return data.map(match => ({
    id: match.id,
    court: match.court,
    score1: match.score1,
    score2: match.score2,
    status: match.status,
    team1: [match.team1_player1.name, match.team1_player2.name],
    team2: [match.team2_player1.name, match.team2_player2.name]
  }))
}

export async function updateMatch(matchId: string, data: any) {
  const { data: updatedMatch, error } = await supabase
    .from('matches')
    .update(data)
    .eq('id', matchId)
    .select(`
      id,
      court,
      score1,
      score2,
      status,
      team1_player1:team1_player1_id(id, name),
      team1_player2:team1_player2_id(id, name),
      team2_player1:team2_player1_id(id, name),
      team2_player2:team2_player2_id(id, name)
    `)
    .single()

  if (error) {
    console.error('Error updating match:', error)
    throw error
  }

  return {
    id: updatedMatch.id,
    court: updatedMatch.court,
    score1: updatedMatch.score1,
    score2: updatedMatch.score2,
    status: updatedMatch.status,
    team1: [updatedMatch.team1_player1.name, updatedMatch.team1_player2.name],
    team2: [updatedMatch.team2_player1.name, updatedMatch.team2_player2.name]
  }
}

export async function createMatch(match: {
  tournament_id: string
  team1_player1_id: string
  team1_player2_id: string
  team2_player1_id: string
  team2_player2_id: string
  court: string
}) {
  const { data, error } = await supabase
    .from('matches')
    .insert({
      ...match,
      score1: 0,
      score2: 0,
      status: 'pending'
    })
    .select(`
      id,
      court,
      score1,
      score2,
      status,
      team1_player1:team1_player1_id(id, name),
      team1_player2:team1_player2_id(id, name),
      team2_player1:team2_player1_id(id, name),
      team2_player2:team2_player2_id(id, name)
    `)
    .single()

  if (error) {
    console.error('Error creating match:', error)
    throw error
  }

  return {
    id: data.id,
    court: data.court,
    score1: data.score1,
    score2: data.score2,
    status: data.status,
    team1: [data.team1_player1.name, data.team1_player2.name],
    team2: [data.team2_player1.name, data.team2_player2.name]
  }
}

// Tournament Status
export async function updateTournamentStatus(id: string, status: Tournament['status']) {
  const { data, error } = await supabase
    .from('tournaments')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Tournament
}

// Create Tournament
export async function createTournament(tournament: {
  title: string
  date: string
  location: string
  start_time: string
  end_time: string
  max_participants: number
}) {
  const { data, error } = await supabase
    .from('tournaments')
    .insert({
      ...tournament,
      status: 'upcoming',
    })
    .select()
    .single()

  if (error) throw error
  return data as Tournament
}
