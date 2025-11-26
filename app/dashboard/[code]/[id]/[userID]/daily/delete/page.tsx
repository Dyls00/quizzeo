'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabaseClient';

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

export default function ManageDailysPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [dailys, setDailys] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editEntryId, setEditEntryId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<DailyEntry>>({});

  // 🔍 Extraire les segments de l'URL : /dashboard/[code]/[idProjet]/daily/manage
  const pathSegments = pathname.split('/');
  const code = pathSegments[2];
  const idProjet = pathSegments[3];
  const userId = pathSegments[4]; // Assurez-vous que l'ID utilisateur est bien dans l'URL

  useEffect(() => {
    fetchDailys();
  }, []);

  async function fetchDailys() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('daily')
      .select('id, created_at, nom, productivite, alea, id_storie, validation_qcm, storie(titre)')
      .eq('id_projet', idProjet) // 🎯 filtrer les dailys du bon projet
      .order('created_at', { ascending: false });

    if (error) {
      setError('Erreur lors du chargement des dailys.');
      console.error(error);
    } else if (data) {
      setDailys(
        data.map((d: any) => ({
          ...d,
          storie: d.storie && Array.isArray(d.storie) ? d.storie[0] : d.storie,
        }))
      );
    }

    setLoading(false);
  }

  const handleEdit = (entry: DailyEntry) => {
    setEditEntryId(entry.id);
    setFormData(entry);
  };

  const handleChange = (field: keyof DailyEntry, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setEditEntryId(null);
    setFormData({});
  };

  const handleSave = async () => {
    if (!editEntryId) return;
    const { error } = await supabase
      .from('daily')
      .update({
        nom: formData.nom,
        productivite: formData.productivite,
        alea: formData.alea,
        id_storie: formData.id_storie,
        validation_qcm: formData.validation_qcm,
      })
      .eq('id', editEntryId);

    if (error) {
      alert("Erreur lors de la sauvegarde : " + error.message);
      console.error(error);
    } else {
      setEditEntryId(null);
      setFormData({});
      fetchDailys();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce daily ?")) return;
    const { error } = await supabase.from('daily').delete().eq('id', id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
      console.error(error);
    } else {
      setDailys(dailys.filter((d) => d.id !== id));
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Dailys</h1>

      <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Productivité</th>
            <th className="border p-2">Aléa</th>
            <th className="border p-2">Story</th>
            <th className="border p-2">QCM</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dailys.map((daily) =>
            editEntryId === daily.id ? (
              <tr key={daily.id} className="bg-yellow-100">
                <td className="border p-2">
                  {new Date(daily.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={formData.nom ?? ''}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={formData.productivite ?? ''}
                    onChange={(e) => handleChange('productivite', parseInt(e.target.value) || null)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={formData.alea ?? ''}
                    onChange={(e) => handleChange('alea', e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={formData.id_storie ?? ''}
                    onChange={(e) => handleChange('id_storie', parseInt(e.target.value) || null)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={formData.validation_qcm ?? ''}
                    onChange={(e) => handleChange('validation_qcm', parseInt(e.target.value) || null)}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Annuler
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={daily.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="border p-2">
                  {new Date(daily.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="border p-2">{daily.nom}</td>
                <td className="border p-2">{daily.productivite}</td>
                <td className="border p-2">{daily.alea}</td>
                <td className="border p-2">{daily.storie?.titre ?? 'Inconnue'}</td>
                <td className="border p-2">{daily.validation_qcm ?? '-'}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(daily)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(daily.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <div className="text-center mt-8">
        <button
          onClick={() => router.push(`/dashboard/${code}/${idProjet}/${userId}/daily/create`)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 transition"
        >
          ➕ Ajouter un daily
        </button>
      </div>
    </div>
  );
}
