"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HallOfFame() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("partie")
        .select("*")
        .not("score", "is", null)
        .order("score", { ascending: false });

      console.log("Résultats:", data);
      console.log("Erreur:", error);

      setScores(data || []);
    };
    load();
  }, []);

  return (
    <div className="question-main">
      <div className="question-form mt-30">
        <form className="form form-question">
          <div className="question-text">Bienvenue !</div>
          <label className="question-title">Voici la liste des meilleurs scores</label>
          {scores.length === 0 ? (
            <p>Aucun score enregistré.</p>
          ) : (
            scores.map((s: any, i) => (
              <div key={s.id} className="border p-3 mt-3">
                <p>#{i + 1} - Score : {s.score} points</p>
                <p className="text-sm text-gray-500">Quiz ID: {s.quizz_id}</p>
              </div>
            ))
          )}
          <button className="button-confirmed"><a href="/">Retourner →</a></button>
        </form>
      </div>
    </div>
  );
}
