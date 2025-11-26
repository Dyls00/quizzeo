'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';

export default function SprintsPage() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const code = segments[2];
  const idProjet = parseInt(segments[3]);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(sprints.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const paginatedSprints = sprints.slice(start, start + itemsPerPage);

  useEffect(() => {
    if (!idProjet) return;

    const fetchSprints = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sprint')
        .select('*')
        .eq('id_projet', idProjet)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement des sprints :', error);
      } else {
        setSprints(data);
      }
      setLoading(false);
    };

    fetchSprints();
  }, [idProjet]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Liste des Sprints</h1>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {paginatedSprints.map((sprint) => (
              <div
                key={sprint.id}
                className="border rounded-xl p-4 shadow bg-white hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-blue-600">{sprint.nom}</h2>
                <p className="text-gray-600 mb-2">{sprint.decription}</p>
                <div className="text-sm text-gray-500">
                  📅 {formatDate(sprint.date_debut)} → {formatDate(sprint.date_fin)}<br />
                  🧠 Capacité : {sprint.capacite ?? 'non définie'} points
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ⬅️ Précédent
            </button>

            <span className="text-sm text-gray-700">
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

function formatDate(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
