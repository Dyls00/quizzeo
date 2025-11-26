'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';

type DailyEntry = {
  id: number;
  created_at: string;
  nom: string | null;
  productivite: number | null;
  alea: string | null;
  id_storie: number | null;
  validation_qcm: number | null;
  storie?: { titre: string };
};

export default function DailyPage() {
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [dailys, setDailys] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const code = pathSegments[2]; // /dashboard/[code]/[idProjet]/daily
  const idProjet = Number(pathSegments[3]);

  useEffect(() => {
    if (!isNaN(idProjet)) {
      fetchDailys();
    }
  }, [idProjet]);

  async function fetchDailys() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('daily')
      .select('id, created_at, nom, productivite, alea, id_storie, validation_qcm, storie(titre)')
      .eq('id_projet', idProjet)
      .order('created_at', { ascending: false });

    if (error) {
      setError('Erreur lors du chargement des dailys.');
      console.error(error);
    } else if (data) {
      const fixedData = data.map((daily: any) => ({
        ...daily,
        storie: daily.storie && Array.isArray(daily.storie) ? daily.storie[0] : daily.storie,
      }));
      setDailys(fixedData);
    }

    setLoading(false);
  }

  const totalPages = Math.ceil(dailys.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentDailys = dailys.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Historique des Dailys du projet</h1>

      {currentDailys.map((daily) => (
        <div key={daily.id} className="mb-6 border p-4 rounded shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            📅 {formatDate(daily.created_at)}
          </h2>

          <p className="text-md font-bold text-indigo-600 mb-1">{daily.nom}</p>

          <p className="text-sm text-gray-800 mb-1">
            🧩 Story : <span className="font-medium">{daily.storie?.titre ?? 'Inconnue'}</span>
          </p>

          <p className="text-sm text-gray-600 mb-1">
            ⚙️ Productivité : {daily.productivite ?? 'N/A'} pts
          </p>

          <p className="text-sm text-gray-600 mb-1">
            🎲 Aléa : <span className="italic">{daily.alea ?? '-'}</span>
          </p>

          <p className="text-sm text-gray-600 mb-1">
            ✅ Validation QCM : <span>{daily.validation_qcm ?? 'N/A'}</span>
          </p>
        </div>
      ))}

      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅️ Précédent
        </button>

        <span className="text-sm text-gray-700">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Suivant ➡️
        </button>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
