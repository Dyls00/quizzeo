'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation' 
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function CreateUserForm() {
  const params = useParams();
  const code = params.code as string;

  const supabase = createClientComponentClient();
  const router = useRouter();

  const [name, setName] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [idProject, setidProject] = useState<number | null>(null);

  const valide = false;

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
  }, [code, supabase]);

  const handleCheckboxChange = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter((r) => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!code || !idProject) {
      setError("Code ou projet introuvable.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user')
      .insert({
        name: name.trim(),
        roles,
        valide,
        id_projet: idProject,
      })
      .select('id') 
      .single();

    if (error) {
      setError("Erreur lors de la création de l'utilisateur : " + error.message);
      setLoading(false);
      return;
    }

    const userId = data.id;
    router.push(`/dashboard/${code.trim()}/${idProject}/${userId}`);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mt-15 mx-auto px-6 py-12 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">Bienvenue !</h1>
      <h2 className="text-2xl font-semibold text-center mb-4">Veuillez indiquer un pseudo !</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-medium mb-1"></label>
          <input
            id="name"
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder='Entrez votre pseudo'
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Rôles</label>
          {['Chef de projet', 'Product-owner', 'Scrum-master', 'Team'].map((role) => (
            <div key={role} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={role}
                checked={roles.includes(role)}
                onChange={() => handleCheckboxChange(role)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor={role} className="ml-2 text-sm text-gray-700">{role}</label>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link href="/" className="text-sm text-gray-600 hover:underline">Annuler</Link>
        </div>
      </form>
    </div>
  );
}
