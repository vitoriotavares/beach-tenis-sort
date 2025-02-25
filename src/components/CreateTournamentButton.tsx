import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function CreateTournamentButton() {
  return (
    <Link
      href="/tournaments/new"
      className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <PlusIcon className="h-5 w-5" />
      Criar Torneio
    </Link>
  )
}
