'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';


type Storie = { id: number; titre: string };

export default function GiveProductivityPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Storie[]>([]);
  const supabase = createClientComponentClient();
  const [idStorie, setIdStorie] = useState<number | null>(null);
  const pathname = usePathname();

  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [projectId, setidProject] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const pathSegments = pathname.split('/');
  const code = pathSegments[2];
  const idProjet = Number(pathSegments[3]);
  const userId = Number(pathSegments[4]);

  const handleSubmit = () => {
    // À remplacer par un appel API
    //alert(`Vous avez sélectionné : ${selectedStory}`);
    router.push(`/dashboard/${code}/${idProjet}/${userId}/daily/productivite/valider/`); // ou autre redirection
  };

  useEffect(() => {
      const fetchProject = async () => {
        const { data, error } = await supabase
          .from('projet')
          .select('id, code, titre')
          .eq('code', code)
          .single();
  
        if (error) {
          console.error('Erreur lors de la récupération du projet:', error.message);
          setProjectName('Projet introuvable');
          setProjectCode('Code introuvable');
          setidProject(null);
        } else {
          setProjectName(data?.titre || 'Projet sans nom');
          setProjectCode(data?.code || 'Code introuvable');
          setidProject(data?.id || null);
        }
  
        setLoading(false);
      };
  
      if (code) fetchProject();
    }, [code]);

    useEffect(() => {
      fetchStories();
    }, []);

      async function fetchStories() {
    const { data, error } = await supabase.from('storie').select('id, titre').order('titre');
    if (error) {
      console.error('Erreur chargement stories', error);
    } else if (data) {
      setStories(data);
    }
  }

  return (
    <div className="max-w-xs mx-auto p-6 rounded-xl shadow bg-white text-center space-y-6">
      <div>
        <h1 className="text-xl font-bold">{projectName}</h1>
        <p className="text-sm text-gray-500">Code : {projectCode}</p>
      </div>

      <div className="mb-4">
          <label className="block font-medium mb-1">Storie du jour</label>
          <select
            value={idStorie ?? ''}
            onChange={(e) => setIdStorie(e.target.value ? Number(e.target.value) : null)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Choisir une story --</option>
            {stories.map((story) => (
              <option key={story.id} value={story.id}>
                {story.titre}
              </option>
            ))}
          </select>
        </div>

      <div className="space-y-3">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-md shadow font-semibold"
          >
            Donner sa productivité
          </button>
        <button
          onClick={() => router.back()}
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 rounded-md font-medium"
        >
          Retour
        </button>
      </div>
    </div>
  );
}
