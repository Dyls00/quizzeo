'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabaseClient';

export default function CreateSprintPage() {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const code = pathSegments[2];
  const idProjet = parseInt(pathSegments[3]);

  const [form, setForm] = useState({
    nom: '',
    decription: '',
    date_debut: '',
    date_fin: '',
    capacite: '',
    id_storie: '',
  });

  const [stories, setStories] = useState<{ id: number; titre: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idProjet) {
      fetchStories();
    }
  }, [idProjet]);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('storie')
      .select('id, titre')
      .eq('id_projet', idProjet);

    if (error) {
      console.error('Erreur chargement stories :', error.message);
    } else {
      setStories(data);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('sprint').insert({
      nom: form.nom,
      decription: form.decription,
      date_debut: form.date_debut,
      date_fin: form.date_fin,
      capacite: parseInt(form.capacite),
      id_storie: form.id_storie ? parseInt(form.id_storie) : null,
      id_projet: idProjet,
    });

    if (error) {
      alert("Erreur lors de la création : " + error.message);
      console.error(error);
    } else {
      router.push(`/dashboard/${code}/${idProjet}/sprints`);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer un Sprint</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nom"
          placeholder="Nom du sprint"
          value={form.nom}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="decription"
          placeholder="Description"
          value={form.decription}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="date_debut"
          value={form.date_debut}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="date_fin"
          value={form.date_fin}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="capacite"
          placeholder="Capacité"
          value={form.capacite}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <select
          name="id_storie"
          value={form.id_storie}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Sélectionner une story --</option>
          {stories.map((story: any) => (
            <option key={story.id} value={story.id}>
              {story.titre}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? 'Création...' : 'Créer le sprint'}
        </button>
      </form>
    </div>
  );
}
