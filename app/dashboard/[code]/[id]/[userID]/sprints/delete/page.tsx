'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabaseClient';

export default function SprintListPage() {
  const router = useRouter();
  const pathname = usePathname();

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const pathSegments = pathname.split('/');
  const code = pathSegments[2];
  const idProjet = parseInt(pathSegments[3]);
  const userId = pathSegments[4];

  const totalPages = Math.ceil(sprints.length / itemsPerPage);
  const sprintsToDisplay = sprints.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    if (idProjet) {
      fetchSprints();
    }
  }, [idProjet]);

  const fetchSprints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sprint')
      .select('*')
      .eq('id_projet', idProjet)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des sprints :', error.message);
    } else {
      setSprints(data);
    }

    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Voulez-vous vraiment supprimer ce sprint ?');
    if (!confirmed) return;

    const { error } = await supabase.from('sprint').delete().eq('id', id);

    if (error) {
      console.error('Erreur suppression sprint :', error.message);
      alert('Erreur lors de la suppression');
    } else {
      alert('Sprint supprimé');
      fetchSprints();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Sprints</h1>

      {loading ? (
        <p className="text-gray-500">Chargement en cours...</p>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {sprintsToDisplay.map((sprint) => (
              <div key={sprint.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-lg font-semibold">{sprint.nom}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/${code}/${idProjet}/sprints/edit?id=${sprint.id}`)}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(sprint.id)}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{sprint.decription}</p>
                <p className="text-xs text-gray-400">
                  📅 Du {formatDate(sprint.date_debut)} au {formatDate(sprint.date_fin)}
                </p>
              </div>
            ))}
          </div>

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
        </>
      )}

      <div className="text-center mt-8">
        <button
          onClick={() => router.push(`/dashboard/${code}/${idProjet}/${userId}/sprints/create`)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 transition"
        >
          ➕ Ajouter un sprint
        </button>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
