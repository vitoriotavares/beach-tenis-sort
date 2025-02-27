'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AuthButtonProps {
  onSuccess?: () => void
}

export function AuthButton({ onSuccess }: AuthButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error signing in:', error)
      alert('Error signing in')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error signing out')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-sunset-600 shadow-sm border border-sunset-200 hover:bg-sunset-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunset-600 transition-colors"
    >
      {loading ? 'Carregando...' : 'Entrar com Google'}
    </button>
  )
}
