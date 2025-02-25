import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beach Tennis Tournament Manager',
  description: 'Organize and manage beach tennis tournaments easily',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        {children}
      </body>
    </html>
  )
}
