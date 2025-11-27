"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Question = {
  id: number;
  libelle: string;
  reponse_correcte: string;
  reponse_incorrect_1: string,
  reponse_incorrect_2: string,
  reponse_incorrect_3: string,
  theme: string;
};


export default function QuestionsPage() {

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("question")
        .select("id,libelle, reponse_correcte, reponse_incorrect_1, reponse_incorrect_2, reponse_incorrect_3, theme");
      setQuestions(data || []);
    };
    load();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl mb-5">Liste des questions</h1>

      {questions.map((q: any) => (
        <div key={q.id} className="border p-3 mb-3 rounded">
          <strong>{q.libelle}</strong>
          <p>Bonne réponse : {q.reponse_correcte}</p>
          <p>Mauvaise réponse : {q.reponse_incorrect_1}</p>
          <p>Mauvaise réponse : {q.reponse_incorrect_2}</p>
          <p>Mauvaise réponse : {q.reponse_incorrect_3}</p>
          <p>Thème : {q.theme}</p>
        </div>
      ))}
    </div>
  );
}
