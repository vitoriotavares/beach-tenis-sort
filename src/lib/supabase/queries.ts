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
    .select('id, name, email, phone, paid, checked_in, avatar_url, created_at, updated_at')
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
      checked_in: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating participant:', error)
    throw error
  }

  return data
}

export async function getCheckedInParticipants(tournamentId: string): Promise<Participant[]> {
  console.log('Fetching checked-in participants for tournament:', tournamentId)
  
  try {
    // Primeiro, tentamos com o filtro checked_in
    const { data, error } = await supabase
      .from('participants')
      .select('id, name, email, phone, paid, checked_in, avatar_url')
      .eq('tournament_id', tournamentId)
      .eq('checked_in', true)
      .order('name')

    if (error) {
      // Se ocorrer um erro relacionado à coluna checked_in, buscamos todos os participantes
      if (error.code === '42703') { // código de erro para "coluna não existe"
        console.log('checked_in column does not exist yet, fetching all participants')
        return getAllParticipants(tournamentId)
      }
      
      console.error('Error fetching checked-in participants:', error)
      throw error
    }

    return data || []
  } catch (err) {
    console.error('Error in getCheckedInParticipants:', err)
    // Em caso de qualquer outro erro, retornamos todos os participantes
    return getAllParticipants(tournamentId)
  }
}

export async function getAllParticipants(tournamentId: string): Promise<Participant[]> {
  const { data, error } = await supabase
    .from('participants')
    .select('id, name, email, phone, paid, checked_in, avatar_url')
    .eq('tournament_id', tournamentId)
    .order('name')

  if (error) {
    console.error('Error fetching participants:', error)
    throw error
  }

  return data || []
}

// Matches
interface MatchResult {
  id: string;
  court: string;
  score1: number;
  score2: number;
  status: 'pending' | 'in_progress' | 'completed';
  team1: string[];
  team2: string[];
}

export async function getTournamentMatches(tournamentId: string): Promise<MatchResult[]> {
  const { data: matches, error } = await supabase
    .from('matches')
    .select(`
      id,
      court,
      score1,
      score2,
      status,
      team1_player1:team1_player1_id(name),
      team1_player2:team1_player2_id(name),
      team2_player1:team2_player1_id(name),
      team2_player2:team2_player2_id(name)
    `)
    .eq('tournament_id', tournamentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching matches:', error)
    throw error
  }

  if (!matches) return []

  // Process the data to ensure it has the correct structure
  return matches.map((match: any) => {
    // Safely extract player names
    let team1Player1Name = '';
    let team1Player2Name = '';
    let team2Player1Name = '';
    let team2Player2Name = '';
    
    // Handle team1_player1
    if (match.team1_player1) {
      if (Array.isArray(match.team1_player1) && match.team1_player1.length > 0) {
        team1Player1Name = match.team1_player1[0]?.name ?? '';
      } else if (typeof match.team1_player1 === 'object') {
        team1Player1Name = (match.team1_player1 as any)?.name ?? '';
      }
    }
    
    // Handle team1_player2
    if (match.team1_player2) {
      if (Array.isArray(match.team1_player2) && match.team1_player2.length > 0) {
        team1Player2Name = match.team1_player2[0]?.name ?? '';
      } else if (typeof match.team1_player2 === 'object') {
        team1Player2Name = (match.team1_player2 as any)?.name ?? '';
      }
    }
    
    // Handle team2_player1
    if (match.team2_player1) {
      if (Array.isArray(match.team2_player1) && match.team2_player1.length > 0) {
        team2Player1Name = match.team2_player1[0]?.name ?? '';
      } else if (typeof match.team2_player1 === 'object') {
        team2Player1Name = (match.team2_player1 as any)?.name ?? '';
      }
    }
    
    // Handle team2_player2
    if (match.team2_player2) {
      if (Array.isArray(match.team2_player2) && match.team2_player2.length > 0) {
        team2Player2Name = match.team2_player2[0]?.name ?? '';
      } else if (typeof match.team2_player2 === 'object') {
        team2Player2Name = (match.team2_player2 as any)?.name ?? '';
      }
    }

    return {
      id: match.id,
      court: match.court,
      score1: match.score1 || 0,
      score2: match.score2 || 0,
      status: match.status,
      team1: [team1Player1Name, team1Player2Name],
      team2: [team2Player1Name, team2Player2Name]
    } as MatchResult;
  });
}

export async function updateMatch(matchId: string, data: any): Promise<MatchResult> {
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

  // Safely extract player names
  let team1Player1Name = '';
  let team1Player2Name = '';
  let team2Player1Name = '';
  let team2Player2Name = '';
  
  // Handle team1_player1
  if (updatedMatch.team1_player1) {
    if (Array.isArray(updatedMatch.team1_player1) && updatedMatch.team1_player1.length > 0) {
      team1Player1Name = updatedMatch.team1_player1[0]?.name ?? '';
    } else if (typeof updatedMatch.team1_player1 === 'object') {
      team1Player1Name = (updatedMatch.team1_player1 as any)?.name ?? '';
    }
  }
  
  // Handle team1_player2
  if (updatedMatch.team1_player2) {
    if (Array.isArray(updatedMatch.team1_player2) && updatedMatch.team1_player2.length > 0) {
      team1Player2Name = updatedMatch.team1_player2[0]?.name ?? '';
    } else if (typeof updatedMatch.team1_player2 === 'object') {
      team1Player2Name = (updatedMatch.team1_player2 as any)?.name ?? '';
    }
  }
  
  // Handle team2_player1
  if (updatedMatch.team2_player1) {
    if (Array.isArray(updatedMatch.team2_player1) && updatedMatch.team2_player1.length > 0) {
      team2Player1Name = updatedMatch.team2_player1[0]?.name ?? '';
    } else if (typeof updatedMatch.team2_player1 === 'object') {
      team2Player1Name = (updatedMatch.team2_player1 as any)?.name ?? '';
    }
  }
  
  // Handle team2_player2
  if (updatedMatch.team2_player2) {
    if (Array.isArray(updatedMatch.team2_player2) && updatedMatch.team2_player2.length > 0) {
      team2Player2Name = updatedMatch.team2_player2[0]?.name ?? '';
    } else if (typeof updatedMatch.team2_player2 === 'object') {
      team2Player2Name = (updatedMatch.team2_player2 as any)?.name ?? '';
    }
  }

  return {
    id: updatedMatch.id,
    court: updatedMatch.court,
    score1: updatedMatch.score1,
    score2: updatedMatch.score2,
    status: updatedMatch.status,
    team1: [team1Player1Name, team1Player2Name],
    team2: [team2Player1Name, team2Player2Name]
  } as MatchResult;
}

export async function createMatch(match: {
  tournament_id: string
  team1_player1_id: string
  team1_player2_id: string
  team2_player1_id: string
  team2_player2_id: string
  court: string
}): Promise<MatchResult> {
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

  // Safely extract player names
  let team1Player1Name = '';
  let team1Player2Name = '';
  let team2Player1Name = '';
  let team2Player2Name = '';
  
  // Handle team1_player1
  if (data.team1_player1) {
    if (Array.isArray(data.team1_player1) && data.team1_player1.length > 0) {
      team1Player1Name = data.team1_player1[0]?.name ?? '';
    } else if (typeof data.team1_player1 === 'object') {
      team1Player1Name = (data.team1_player1 as any)?.name ?? '';
    }
  }
  
  // Handle team1_player2
  if (data.team1_player2) {
    if (Array.isArray(data.team1_player2) && data.team1_player2.length > 0) {
      team1Player2Name = data.team1_player2[0]?.name ?? '';
    } else if (typeof data.team1_player2 === 'object') {
      team1Player2Name = (data.team1_player2 as any)?.name ?? '';
    }
  }
  
  // Handle team2_player1
  if (data.team2_player1) {
    if (Array.isArray(data.team2_player1) && data.team2_player1.length > 0) {
      team2Player1Name = data.team2_player1[0]?.name ?? '';
    } else if (typeof data.team2_player1 === 'object') {
      team2Player1Name = (data.team2_player1 as any)?.name ?? '';
    }
  }
  
  // Handle team2_player2
  if (data.team2_player2) {
    if (Array.isArray(data.team2_player2) && data.team2_player2.length > 0) {
      team2Player2Name = data.team2_player2[0]?.name ?? '';
    } else if (typeof data.team2_player2 === 'object') {
      team2Player2Name = (data.team2_player2 as any)?.name ?? '';
    }
  }

  return {
    id: data.id,
    court: data.court,
    score1: data.score1,
    score2: data.score2,
    status: data.status,
    team1: [team1Player1Name, team1Player2Name],
    team2: [team2Player1Name, team2Player2Name]
  } as MatchResult;
}

// User Registration
export async function registerUserForTournament(tournamentId: string, userData: {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}) {
  console.log('Registering user for tournament:', { tournamentId, userData })
  
  // Verificar se o usuário já está inscrito neste torneio
  const { data: existingParticipant, error: checkError } = await supabase
    .from('participants')
    .select('id')
    .eq('tournament_id', tournamentId)
    .eq('email', userData.email)
    .maybeSingle()
  
  if (checkError) {
    console.error('Error checking existing participant:', checkError)
    throw checkError
  }
  
  // Se o usuário já estiver inscrito, retornamos o participante existente
  if (existingParticipant) {
    console.log('User already registered for this tournament')
    return existingParticipant
  }
  
  // Caso contrário, criamos um novo participante
  const { data, error } = await supabase
    .from('participants')
    .insert({
      tournament_id: tournamentId,
      name: userData.name,
      email: userData.email,
      phone: '', // Campo obrigatório, mas será preenchido posteriormente
      paid: false,
      checked_in: false,
      user_id: userData.id,
      avatar_url: userData.avatar_url
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error registering user for tournament:', error)
    throw error
  }
  
  return data
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
