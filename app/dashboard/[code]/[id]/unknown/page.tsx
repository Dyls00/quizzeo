'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient'; // adapte ce chemin à ton projet

export default function DashboardPageAuth() {
  const params = useParams();
  const code = params.code as string;

  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectCode, setProjectCode] = useState<string | null>(null);
  const [idProject, setidProject] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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

  const Button = ({
    label,
    href,
    color,
  }: {
    label: string;
    href: string;
    color: string;
  }) => (
    <Link
      href={href}
      className={`block text-center text-white font-semibold py-2 px-4 rounded-xl shadow hover:opacity-90 transition ${color}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      {/* Nom du projet */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">
          {loading ? 'Chargement...' : projectName}
        </h1>
        <p className="text-sm text-gray-500">Code : {loading ? 'Chargement...' : projectCode}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-4">
        <Link href="/dashboard/sprints" className="bg-gray-200 px-4 py-1 rounded-full text-sm hover:bg-gray-300">
          Sprints
        </Link>
        <Link href="/dashboard/stories" className="bg-gray-200 px-4 py-1 rounded-full text-sm hover:bg-gray-300">
          Stories
        </Link>
      </div>

      {/* Graphique Placeholder */}
      <div className="h-40 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-inner flex items-center justify-center text-gray-400">
        <span>Graphique à venir</span>
      </div>

      {/* Daily */}
      <div className="text-center">
        <Link href="/dashboard/daily" className="inline-block bg-black text-white text-sm px-4 py-2 rounded-full shadow hover:opacity-90">
          📅 Voir les Dailys
        </Link>
      </div>

      {/* Boutons */}
      <div className="space-y-2 mt-4">
        <Button label="Participer" href={`/dashboard/${code}/auth`} color="bg-red-300" />
        <Button label="Quitter la partie" href="/" color="bg-blue-500" />
      </div>
    </div>
  );
}
