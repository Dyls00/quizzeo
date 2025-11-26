'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../../lib/supabaseClient';

type Participant = {
  id: number;
  name: string | null;
  roles: any;
  id_projet: number | null;
  projet?: {
    titre: string | null;
  };
};

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchParticipants() {
      const { data, error } = await supabase
        .from('user')
        .select(`
          id,
          name,
          roles,
          id_projet,
          projet:user_id_projet_fkey(titre)
        `);

      if (error) {
        setError('Erreur lors du chargement des participants.');
        console.error('Erreur Supabase:', error.message);
      } else {
        setParticipants(
          (data ?? []).map((participant: any) => ({
            ...participant,
            projet: Array.isArray(participant.projet) ? participant.projet[0] : participant.projet,
          }))
        );
      }
    }
    fetchParticipants();
  }, []);

  const supprimerParticipant = async (id: number) => {
    const { error } = await supabase
      .from('user')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
      console.error("Erreur Supabase lors de la suppression :", error);
    } else {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const modifierParticipant = (id: number) => {
    alert(`Modifier le participant avec l'ID ${id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Liste des participants</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Nom</th>
            <th className="py-3 px-4 text-left">Rôles</th>
            <th className="py-3 px-4 text-left">Projet</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id} className="border-t border-gray-200">
              <td className="py-2 px-4">{participant.name ?? '—'}</td>
              <td className="py-2 px-4">{JSON.stringify(participant.roles)}</td>
              <td className="py-2 px-4">{participant.projet?.titre ?? '—'}</td>
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => modifierParticipant(participant.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => supprimerParticipant(participant.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {participants.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Aucun participant pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
