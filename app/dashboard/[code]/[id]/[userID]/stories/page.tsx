'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';
import { usePathname } from 'next/navigation';

interface Story {
  id: number;
  titre: string;
  description: string;
  effort: number;
  priorite: string;
  id_projet: number;
}

export default function UserStoriesPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/');

   const code = pathSegments[2];      
  const idProjet = pathSegments[3];  

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStories() {
      if (!idProjet) {
        setError("ID de projet manquant dans l'URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('storie')
        .select('*')
        .eq('id_projet', idProjet)
        .order('created_at', { ascending: false });

      if (error) {
        setError("Erreur lors du chargement des stories");
        console.error(error);
      } else if (data) {
        setStories(data);
      }
      setLoading(false);
    }

    fetchStories();
  }, [idProjet]);

  const totalPages = Math.ceil(stories.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentStories = stories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Stories du projet {code ?? ''}
      </h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid gap-4 mb-6">
            {currentStories.length === 0 && <p>Aucune story trouvée.</p>}
            {currentStories.map((story) => (
              <div
                key={story.id}
                className="border rounded-xl p-4 shadow bg-white hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{story.titre}</h2>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(
                      story.priorite
                    )}`}
                  >
                    {story.priorite}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{story.description}</p>
                <div className="text-sm text-gray-500">Effort: {story.effort}</div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ⬅️ Précédent
            </button>
            <span className="text-sm text-gray-700">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Suivant ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'MUST':
      return 'bg-red-100 text-red-800';
    case 'SHOULD':
      return 'bg-orange-100 text-orange-800';
    case 'COULD':
      return 'bg-yellow-100 text-yellow-800';
    case 'WOULD':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
