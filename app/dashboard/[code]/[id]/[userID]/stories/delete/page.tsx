'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabaseClient';

interface Story {
  id: number;
  titre: string;
  description: string;
  effort: number;
  priorite: string;
  id_projet: number;
}

export default function StoryListPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const code = pathSegments[2];
  const idProjet = Number(pathSegments[3]); // converti en number
  const userId = Number(pathSegments[4]); // converti en number

  const router = useRouter();
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchStories() {
      if (!idProjet) {
        setError("ID projet manquant ou invalide.");
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
      } else {
        setStories(data || []);
      }
      setLoading(false);
    }

    fetchStories();
  }, [idProjet]);

  const totalPages = Math.ceil(stories.length / itemsPerPage);
  const storiesToDisplay = stories.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDelete = async (id: number) => {
    if (!confirm('Es-tu sûr de vouloir supprimer cette story ?')) return;

    const { error } = await supabase.from('storie').delete().eq('id', id);
    if (error) {
      alert('Erreur lors de la suppression');
      console.error(error);
    } else {
      alert(`Story ${id} supprimée`);
      setStories((prev) => prev.filter((story) => story.id !== id));
      if (storiesToDisplay.length === 1 && page > 1) {
        setPage(page - 1);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des User Stories</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="space-y-4 mb-8">
            {storiesToDisplay.length === 0 && <p>Aucune story disponible.</p>}
            {storiesToDisplay.map((story) => (
              <div key={story.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-lg font-semibold">{story.titre}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/stories/edit?id=${story.id}`)}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{story.description}</p>
                <p className="text-xs text-gray-500">
                  Effort : {story.effort} — Priorité : <span className="font-semibold">{story.priorite}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              ⬅️ Précédent
            </button>
            <span className="text-sm">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Suivant ➡️
            </button>
          </div>

          {/* Ajouter une story */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push(`/dashboard/${code}/${idProjet}/${userId}/stories/create`)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 transition"
            >
              ➕ Ajouter une story
            </button>
          </div>
        </>
      )}
    </div>
  );
}
