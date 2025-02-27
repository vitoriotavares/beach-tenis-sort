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
      console.log('=== INICIANDO LOGIN COM GOOGLE ===')
      
      // Obter o URL de redirecionamento de forma segura
      let redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
      
      // Se não houver URL configurado, usamos o origin atual
      if (!redirectUrl) {
        // Garantir que estamos em um ambiente de navegador
        if (typeof window !== 'undefined') {
          redirectUrl = window.location.origin
        } else {
          redirectUrl = 'http://localhost:3000' // Fallback para desenvolvimento
        }
      }
      
      // Adicionar o caminho de callback
      redirectUrl = `${redirectUrl}/auth/callback`
      
      console.log('URL de redirecionamento:', redirectUrl)
      
      // Verificar se estamos em localhost e ajustar a porta se necessário
      if (typeof window !== 'undefined' && 
          window.location.hostname === 'localhost' && 
          redirectUrl.includes('localhost')) {
        // Usar a porta atual do navegador
        redirectUrl = `${window.location.origin}/auth/callback`
        console.log('URL de redirecionamento ajustado para desenvolvimento local:', redirectUrl)
      }
      
      // Tentar fazer login com Google
      console.log('Iniciando processo de login com Google...')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          // Definir skipBrowserRedirect como false para permitir o redirecionamento automático
          skipBrowserRedirect: false,
          // Adicionar scopes para obter mais informações do usuário
          scopes: 'email profile',
        },
      })
      
      if (error) {
        console.error('Erro durante o login com Google:', error)
        throw error
      }
      
      console.log('Resposta do login com Google:', data)
      
      // Nota: Normalmente não chegaremos aqui devido ao redirecionamento automático
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      alert('Erro ao fazer login. Por favor, verifique o console para mais detalhes.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      console.log('Iniciando logout...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erro durante o logout:', error)
        throw error
      }
      
      console.log('Logout realizado com sucesso')
      window.location.reload()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      alert('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processando...' : 'Entrar com Google'}
      </button>
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processando...' : 'Sair'}
      </button>
    </div>
  )
}
