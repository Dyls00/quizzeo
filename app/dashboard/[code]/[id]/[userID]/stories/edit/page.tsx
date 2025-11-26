'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabaseClient';

export default function EditStoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idStr = searchParams.get('id');
  const storyId = idStr ? parseInt(idStr, 10) : null;

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [effort, setEffort] = useState<number>(1);
  const [priorite, setPriorite] = useState('MUST');
  const [taches, setTaches] = useState<string[]>(['']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!storyId) {
      setError('ID de story invalide');
      setLoading(false);
      return;
    }

    async function fetchStory() {
      setLoading(true);
      const { data, error } = await supabase
        .from('storie')
        .select('*')
        .eq('id', storyId)
        .single();

      setLoading(false);

      if (error || !data) {
        setError('Impossible de charger la story.');
      } else {
        setTitre(data.titre ?? '');
        setDescription(data.description ?? '');
        setEffort(data.effort ?? 1);
        setPriorite(data.priorite ?? 'MUST');
        setTaches(Array.isArray(data.tache) && data.tache.length > 0 ? data.tache : ['']);
      }
    }

    fetchStory();
  }, [storyId]);

  const handleTacheChange = (index: number, value: string) => {
    setTaches((prev) => {
      const newTaches = [...prev];
      newTaches[index] = value;
      return newTaches;
    });
  };

  const addTache = () => {
    setTaches((prev) => [...prev, '']);
  };

  const removeTache = (index: number) => {
    setTaches((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!storyId) {
      setError('ID de story invalide');
      return;
    }

    // Nettoyer taches vides
    const filteredTaches = taches.filter((t) => t.trim() !== '');

    const { error: updateError } = await supabase
      .from('storie')
      .update({
        titre,
        description,
        effort,
        priorite,
        tache: filteredTaches.length > 0 ? filteredTaches : null,
      })
      .eq('id', storyId);

    if (updateError) {
      console.error('Erreur Supabase:', updateError.message);
      setError("Une erreur est survenue lors de la mise à jour.");
    } else {
      router.push('/dashboard/stories');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Modifier une Storie</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={e => setTitre(e.target.value)}
            placeholder="Titre de la story"
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description détaillée"
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Effort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Effort (1, 2, 3, 5, 8)</label>
          <select
            value={effort}
            onChange={e => setEffort(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[1, 2, 3, 5, 8].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Priorité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
          <select
            value={priorite}
            onChange={e => setPriorite(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {['MUST', 'SHOULD', 'COULD', 'WOULD'].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Tâches */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tâches</label>
          {taches.map((tache, index) => (
            <div key={index} className="flex items-center mb-2 space-x-2">
              <input
                type="text"
                value={tache}
                onChange={e => handleTacheChange(index, e.target.value)}
                placeholder={`Tâche ${index + 1}`}
                className="flex-grow border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => removeTache(index)}
                className="text-red-600 hover:text-red-800"
                aria-label={`Supprimer tâche ${index + 1}`}
              >
                🗑️
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTache}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            + Ajouter une tâche
          </button>
        </div>

        {/* Bouton */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
