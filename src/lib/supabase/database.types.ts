export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: string
          title: string
          date: string
          location: string
          start_time: string
          end_time: string
          max_participants: number
          status: 'upcoming' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          location: string
          start_time: string
          end_time: string
          max_participants: number
          status?: 'upcoming' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          location?: string
          start_time?: string
          end_time?: string
          max_participants?: number
          status?: 'upcoming' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          tournament_id: string
          name: string
          email: string
          phone: string
          paid: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          name: string
          email: string
          phone: string
          paid?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          name?: string
          email?: string
          phone?: string
          paid?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          tournament_id: string
          team1_participant_ids: string[]
          team2_participant_ids: string[]
          team1_score: number
          team2_score: number
          status: 'pending' | 'in_progress' | 'completed'
          winner_team: 1 | 2 | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          team1_participant_ids: string[]
          team2_participant_ids: string[]
          team1_score?: number
          team2_score?: number
          status?: 'pending' | 'in_progress' | 'completed'
          winner_team?: 1 | 2 | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          team1_participant_ids?: string[]
          team2_participant_ids?: string[]
          team1_score?: number
          team2_score?: number
          status?: 'pending' | 'in_progress' | 'completed'
          winner_team?: 1 | 2 | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
