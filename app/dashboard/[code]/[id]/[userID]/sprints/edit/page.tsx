'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabaseClient';

export default function EditSprintPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSprint(id);
    }
  }, [id]);

  const fetchSprint = async (sprintId: string) => {
    const { data, error } = await supabase
      .from('sprint')
      .select('*')
      .eq('id', sprintId)
      .single();

    if (error) {
      console.error('Erreur chargement sprint :', error.message);
      alert("Impossible de charger les données du sprint.");
      router.push('/dashboard/sprints');
    } else {
      setTitle(data.nom);
      setDescription(data.decription);
      setStartDate(data.date_debut?.slice(0, 10)); // ISO -> yyyy-mm-dd
      setEndDate(data.date_fin?.slice(0, 10));
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('sprint')
      .update({
        nom: title,
        decription: description,
        date_debut: startDate,
        date_fin: endDate,
      })
      .eq('id', id);

    if (error) {
      console.error('Erreur mise à jour :', error.message);
      alert("Échec de la mise à jour du sprint.");
    } else {
      alert('Sprint mis à jour avec succès');
      router.push('/dashboard/sprints');
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Chargement en cours...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Modifier le Sprint</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Titre" type="text" value={title} setValue={setTitle} />
        <FormField label="Description" type="textarea" value={description} setValue={setDescription} />
        <FormField label="Date de début" type="date" value={startDate} setValue={setStartDate} />
        <FormField label="Date de fin" type="date" value={endDate} setValue={setEndDate} />

        <div className="text-right">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, type, value, setValue }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className="w-full border rounded px-3 py-2 shadow-sm focus:outline-indigo-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      ) : (
        <input
          type={type}
          className="w-full border rounded px-3 py-2 shadow-sm focus:outline-indigo-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      )}
    </div>
  );
}
