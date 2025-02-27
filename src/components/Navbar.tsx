'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { PlayerAvatar } from './PlayerAvatar'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export function Navbar() {
  const { user, signInWithGoogle, signOut, loading, isRedirecting } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleSignIn = async () => {
    if (isLoggingIn || isRedirecting) return; // Evita múltiplos cliques e redirecionamentos
    
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-ocean-700">Beach Tennis</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-ocean-500 hover:text-ocean-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Torneios
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {loading ? (
              <div className="text-sm text-gray-500">Carregando...</div>
            ) : user ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
                    <span className="sr-only">Abrir menu do usuário</span>
                    <div className="flex items-center">
                      <PlayerAvatar 
                        name={user.user_metadata.name || user.email?.split('@')[0] || 'Usuário'} 
                        imageUrl={user.user_metadata.avatar_url}
                        size="sm"
                      />
                      <span className="ml-2 text-sm text-gray-700 hidden md:block">
                        {user.user_metadata.name || user.email?.split('@')[0] || 'Usuário'}
                      </span>
                      <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700 cursor-pointer`}
                          onClick={() => signOut()}
                        >
                          Sair
                        </div>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={loading || isLoggingIn || isRedirecting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
              >
                {loading || isLoggingIn || isRedirecting ? 'Carregando...' : 'Entrar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
