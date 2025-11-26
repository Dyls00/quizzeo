'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Join() {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.trim() === '') return

    const { data, error } = await supabase
      .from('projet')
      .select('id, code, titre')
      .eq('code', code.trim())
      .single()

    if (error || !data) {
      setError("Code invalide ou projet introuvable.")
      console.error(error)
      return
    }

    const idProjet = data.id
    const codeProjet = data.code

    // Redirection vers la page projet
    router.push(`/dashboard/${codeProjet}/${idProjet}/unknown`)
  }

  return (
    <div className="flex flex-col items-center justify-center light">
      <div className="w-full mt-30 max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Entrer votre code ici
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Entrer le code reçu"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:from-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
          >
            Accéder
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <Link href="/" className="text-sm text-gray-600 hover:underline">Annuler</Link>
        </div>
      </div>
    </div>
  )
}
