'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabaseClient';
import { usePathname } from 'next/navigation';

export default function CreateStoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split('/');

 const code = pathSegments[2];      
  const idProjet = pathSegments[3];
  const userId = pathSegments[4];  

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [effort, setEffort] = useState<number>(1);
  const [priorite, setPriorite] = useState('MUST');
  const [taches, setTaches] = useState<string[]>(['']);
  const [error, setError] = useState('');

  const addTache = () => setTaches([...taches, '']);
  const updateTache = (index: number, value: string) => {
    const newTaches = [...taches];
    newTaches[index] = value;
    setTaches(newTaches);
  };
  const removeTache = (index: number) => {
    const newTaches = taches.filter((_, i) => i !== index);
    setTaches(newTaches.length ? newTaches : ['']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idProjet) {
      setError("L'identifiant du projet est manquant dans l'URL.");
      return;
    }

    const filteredTaches = taches.filter(t => t.trim() !== '');

    const { error: insertError } = await supabase.from('storie').insert({
      titre,
      description,
      effort,
      priorite,
      tache: filteredTaches,
      id_projet: Number(idProjet), // insertion ici
    });

    if (insertError) {
      console.error('Erreur Supabase:', insertError.message);
      setError("Une erreur est survenue lors de la création.");
    } else {
      router.push(`/dashboard/${code}/${idProjet}/${userId}/stories`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer une User Story</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-600">{error}</p>}

        <Input label="Titre" value={titre} onChange={setTitre} />
        <Textarea label="Description" value={description} onChange={setDescription} />
        <NumberSelect label="Effort (1, 2, 3, 5, 8)" value={effort} options={[1, 2, 3, 5, 8]} onChange={setEffort} />
        <Select label="Priorité" value={priorite} options={['MUST', 'SHOULD', 'COULD', 'WOULD']} onChange={setPriorite} />

        <div>
          <label className="block mb-1 font-medium">Tâches</label>
          {taches.map((tache, index) => (
            <div key={index} className="flex mb-2 items-center gap-2">
              <input
                type="text"
                className="flex-grow border rounded px-3 py-2"
                value={tache}
                onChange={e => updateTache(index, e.target.value)}
                placeholder={`Tâche #${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeTache(index)}
                className="text-red-600 font-bold px-2"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTache}
            className="mt-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            + Ajouter une tâche
          </button>
        </div>

        <SubmitButton label="Créer la Story" />
      </form>
    </div>
  );
}

// Composants réutilisables
const Input = ({ label, value, onChange }: any) => (
  <div>
    <label className="block mb-1">{label}</label>
    <input
      type="text"
      className="w-full border rounded px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div>
    <label className="block mb-1">{label}</label>
    <textarea
      className="w-full border rounded px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

const NumberSelect = ({ label, value, options, onChange }: any) => (
  <div>
    <label className="block mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full border rounded px-3 py-2"
    >
      {options.map((val: number) => (
        <option key={val} value={val}>{val}</option>
      ))}
    </select>
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div>
    <label className="block mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    >
      {options.map((val: string) => (
        <option key={val} value={val}>{val}</option>
      ))}
    </select>
  </div>
);

const SubmitButton = ({ label }: { label: string }) => (
  <button
    type="submit"
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow"
  >
    {label}
  </button>
);
