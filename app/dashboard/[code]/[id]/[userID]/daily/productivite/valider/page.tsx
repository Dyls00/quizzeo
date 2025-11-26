'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { mockValidationContext } from '../../../../../../../lib/data';

export default function ValidateProductivityPage() {
  const router = useRouter();
  const [productivity, setProductivity] = useState<number>(4);
    const pathname = usePathname();
  
    // Exemple d'URL : /dashboard/ABCD12/3
    const pathSegments = pathname.split('/');
  
    const code = pathSegments[2];      
    const idProjet = pathSegments[3];  
    const userId = pathSegments[4] || null; // userId peut être optionnel

  const handleValidation = (type: 'cash' | 'carre' | 'duo') => {
    let finalProductivity = productivity;

    if (type === 'carre') finalProductivity = Math.ceil(productivity / 2);
    else if (type === 'duo') finalProductivity = Math.ceil(productivity / 4);

    alert(
      `Type : ${type.toUpperCase()} — Productivité validée : ${finalProductivity} pts`
    );

    // TODO : API POST pour enregistrer la productivité validée
    router.push(`/dashboard/${code}/${idProjet}/${userId}/daily`);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-white space-y-5 text-center">
      <div>
        <h1 className="text-xl font-bold">{mockValidationContext.projectName}</h1>
        <p className="text-sm text-gray-500">Code : {mockValidationContext.code}</p>
      </div>

      <div className="text-left space-y-2 text-sm">
        <p>
          <strong>Story du jour :</strong> {mockValidationContext.story}
        </p>
        <p>
          <strong>Productivité max :</strong> {mockValidationContext.maxProductivity}
        </p>
        <p>
          <strong>Aléa :</strong> {mockValidationContext.alea}
        </p>

        <div>
          <label className="block mb-1 font-medium" htmlFor="productivity">
            Productivité :
          </label>
          <input
            id="productivity"
            type="number"
            min={0}
            max={mockValidationContext.maxProductivity}
            value={productivity}
            onChange={(e) => setProductivity(parseInt(e.target.value))}
            className="w-full border px-3 py-2 rounded shadow-sm focus:outline-indigo-500"
          />
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-2">Validation :</label>
          <p className="italic bg-gray-100 p-2 rounded">
            {mockValidationContext.question}
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <button
          onClick={() => handleValidation('cash')}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded shadow font-semibold"
        >
          💰 Cash
        </button>
        <button
          onClick={() => handleValidation('carre')}
          className="w-full bg-blue-300 hover:bg-blue-400 text-white py-2 rounded shadow font-semibold"
        >
          ◻️ Carré
        </button>
        <button
          onClick={() => handleValidation('duo')}
          className="w-full bg-blue-200 hover:bg-blue-300 text-white py-2 rounded shadow font-semibold"
        >
          👯 Duo
        </button>
      </div>
    </div>
  );
}
