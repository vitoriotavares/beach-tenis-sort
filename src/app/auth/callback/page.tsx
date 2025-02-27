'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { createUserProfile } from '@/lib/supabase/queries'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('=== AUTH CALLBACK STARTED ===')
        
        // Primeiro, verificamos se há algum erro na URL
        const url = new URL(window.location.href)
        console.log('Current URL:', window.location.href)
        
        const errorParam = url.searchParams.get('error')
        const errorDescription = url.searchParams.get('error_description')
        
        // Verificar também erros no hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const hashError = hashParams.get('error')
        const hashErrorDescription = hashParams.get('error_description')
        
        if (errorParam || hashError) {
          console.error('Auth error in URL params:', errorParam, errorDescription)
          console.error('Auth error in hash:', hashError, hashErrorDescription)
          // Mesmo com erro, redirecionamos para a página inicial
          router.push('/')
          return
        }
        
        // Verificar se temos um hash com access_token (caso o redirecionamento tenha vindo com hash em vez de query params)
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log('Found access_token in hash, setting session manually...')
          
          try {
            // Tentar configurar a sessão com base no hash
            const { data, error } = await supabase.auth.getSession()
            
            if (error) {
              console.error('Error getting session after hash redirect:', error)
            } else if (data?.session) {
              console.log('Session successfully retrieved after hash redirect')
            } else {
              console.warn('No session found after hash redirect')
            }
          } catch (hashError) {
            console.error('Error processing hash with access_token:', hashError)
          }
        }
        
        // Obtemos a sessão do usuário
        console.log('Getting session from Supabase...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session from Supabase:', error)
          router.push('/')
          return
        }

        if (session) {
          console.log('Session found:', {
            userId: session.user.id,
            email: session.user.email,
            metadata: session.user.user_metadata
          })
          
          try {
            // Tentar criar ou atualizar o perfil do usuário no banco de dados
            console.log('Attempting to create/update user profile...')
            const user = session.user
            
            // Verificar se temos os dados necessários
            if (user && user.id && user.email) {
              // Extrair o nome do usuário dos metadados
              const userName = user.user_metadata?.name || 
                               user.user_metadata?.full_name || 
                               user.email.split('@')[0] || 
                               'Usuário';  // Valor padrão para garantir que nunca seja NULL
              
              // Extrair a URL do avatar
              const avatarUrl = user.user_metadata?.avatar_url || 
                               user.user_metadata?.picture || 
                               '';  // Valor padrão vazio para avatar
              
              console.log('User data available for profile creation:', {
                id: user.id,
                email: user.email,
                name: userName,
                avatar_url: avatarUrl
              })
              
              const profile = await createUserProfile({
                id: user.id,
                email: user.email,
                name: userName,
                avatar_url: avatarUrl
              })
              
              if (profile) {
                console.log('User profile created/updated successfully:', profile)
              } else {
                console.warn('Profile creation returned null - this is expected if profiles table does not exist')
              }
            } else {
              console.warn('Missing user data for profile creation', user)
            }
          } catch (profileError) {
            console.error('Error creating/updating user profile:', profileError)
            // Não interrompemos o fluxo em caso de erro, apenas logamos
          }
        } else {
          console.warn('No session found')
        }
        
        // Sempre redirecionamos para a página inicial, independentemente do resultado
        console.log('Redirecting to home page...')
        router.push('/')
        console.log('=== AUTH CALLBACK COMPLETED ===')
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        // Mesmo com erro, redirecionamos para a página inicial
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Autenticando...</h1>
        <p className="text-gray-600">Você será redirecionado em instantes.</p>
        <p className="text-gray-400 mt-2 text-sm">Se ocorrer algum erro, verifique o console do navegador para mais detalhes.</p>
      </div>
    </div>
  )
}
