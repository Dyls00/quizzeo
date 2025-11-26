'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { mockCurrentDaily } from '../../../../../../lib/data';

export default function CloseDailyPage() {
  const router = useRouter();

  const handleCloture = () => {
    // À remplacer par une requête API PATCH /daily/cloture
    alert('Daily clôturé avec succès !');
    router.push('/dashboard/daily');
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow bg-white space-y-5 text-center">
      <h1 className="text-xl font-bold">{mockCurrentDaily.projectName}</h1>
      <p className="text-sm text-gray-500 mb-2">Code : {mockCurrentDaily.code}</p>

      <div className="text-left space-y-2">
        <p className="font-medium mb-2">Ont parlé :</p>
        {mockCurrentDaily.entries.map((entry, idx) => (
          <div
            key={idx}
            className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-700"
          >
            <strong>{entry.name}</strong> : {entry.story}, {entry.commentaire}
          </div>
        ))}
      </div>

      <div className="space-y-3 mt-6">
        <button
          onClick={handleCloture}
          className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-2 rounded-md shadow"
        >
          ✅ Clôturer le Daily
        </button>
        <button
          onClick={() => router.back()}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md shadow"
        >
          🔙 Retour
        </button>
      </div>
    </div>
  );
}
