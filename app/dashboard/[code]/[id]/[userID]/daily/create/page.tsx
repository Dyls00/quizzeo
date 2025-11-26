'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';

type Storie = { id: number; titre: string };
type Qcm = { id: number; titre: string };
type User = { id: number; name: string };

export default function DailyCreatePage() {
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const router = useRouter();

  const [nom, setNom] = useState('');
  const [productivite, setProductivite] = useState<string>('');
  const [alea, setAlea] = useState('');
  const [idStorie, setIdStorie] = useState<number | null>(null);
  const [validationQcm, setValidationQcm] = useState<number | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  const [stories, setStories] = useState<Storie[]>([]);
  const [qcms, setQcms] = useState<Qcm[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const pathSegments = pathname.split('/');
  const code = pathSegments[2];
  const idProjet = Number(pathSegments[3]);

  useEffect(() => {
    fetchStories();
    fetchQcms();
    fetchParticipants();
  }, [idProjet]);

  async function fetchStories() {
    const { data, error } = await supabase
      .from('storie')
      .select('id, titre')
      .eq('id_projet', idProjet)
      .order('titre');

    if (error) {
      console.error('Erreur chargement stories', error);
    } else {
      setStories(data);
    }
  }

  async function fetchQcms() {
    const { data, error } = await supabase.from('qcm').select('id, titre').order('titre');
    if (error) {
      console.error('Erreur chargement qcms', error);
    } else {
      setQcms(data);
    }
  }

  async function fetchParticipants() {
    const { data, error } = await supabase
      .from('user')
      .select('id, name')
      .eq('id_projet', idProjet)
      .order('name');

    if (error) {
      console.error('Erreur chargement participants', error);
    } else {
      setParticipants(data);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nom.trim()) {
      setError('Le nom est obligatoire.');
      return;
    }
    if (productivite !== '' && (isNaN(Number(productivite)) || Number(productivite) < 0)) {
      setError('La productivité doit être un nombre positif.');
      return;
    }

    setLoading(true);

    const { data: dailyData, error: dailyError } = await supabase
      .from('daily')
      .insert({
        nom: nom.trim(),
        productivite: productivite === '' ? null : Number(productivite),
        alea: alea.trim() === '' ? null : alea.trim(),
        id_storie: idStorie,
        validation_qcm: validationQcm,
        id_projet: idProjet,
      })
      .select('id')
      .single();

    if (dailyError) {
      setLoading(false);
      setError('Erreur lors de la création du daily : ' + dailyError.message);
      return;
    }

    const idDaily = dailyData.id;

    if (selectedParticipants.length > 0) {
      const userDailyRows = selectedParticipants.map((userId) => ({
        id_daily: idDaily,
        id_user: userId,
      }));

      const { error: userDailyError } = await supabase.from('user_daily').insert(userDailyRows);

      if (userDailyError) {
        setLoading(false);
        setError("Erreur lors de l'ajout des participants : " + userDailyError.message);
        return;
      }
    }

    setLoading(false);
    setSuccess('Daily créé avec succès !');

    // ✅ Redirection après succès
    router.push(`/dashboard/${code}/${idProjet}/daily`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Créer un Daily</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Nom du Daily *</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Productivité (pts)</label>
          <input
            type="number"
            min="0"
            value={productivite}
            onChange={(e) => setProductivite(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Aléa</label>
          <input
            type="text"
            value={alea}
            onChange={(e) => setAlea(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Story liée</label>
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

        <div className="mb-4">
          <label className="block font-medium mb-1">QCM de validation</label>
          <select
            value={validationQcm ?? ''}
            onChange={(e) => setValidationQcm(e.target.value ? Number(e.target.value) : null)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Choisir un QCM --</option>
            {qcms.map((qcm) => (
              <option key={qcm.id} value={qcm.id}>
                {qcm.titre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">Participants</label>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {participants.map((participant) => (
              <label key={participant.id} className="block mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  value={participant.id}
                  checked={selectedParticipants.includes(participant.id)}
                  onChange={(e) => {
                    const id = participant.id;
                    if (e.target.checked) {
                      setSelectedParticipants([...selectedParticipants, id]);
                    } else {
                      setSelectedParticipants(selectedParticipants.filter((pid) => pid !== id));
                    }
                  }}
                  className="mr-2"
                />
                {participant.name}
              </label>
            ))}
            {participants.length === 0 && (
              <p className="text-gray-500">Aucun participant trouvé.</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded"
        >
          {loading ? 'Création en cours...' : 'Créer le Daily'}
        </button>
      </form>
    </div>
  );
}
