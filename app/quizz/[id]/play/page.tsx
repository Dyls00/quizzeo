"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PlayQuiz({ params }: any) {
  const quizz_id = params.id;

  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState("");
  const [runId, setRunId] = useState(null);
  const [propositions, setPropositions] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: list } = await supabase.rpc("get_quizz_questions", {
        quizz_id_param: quizz_id,
      });
      setQuestions(list);
    };
    initRun();
  }, []);

  const initRun = async () => {
    const { data } = await supabase
      .from("run")
      .insert([{ quizz_id }])
      .select()
      .single();

    setRunId(data.id);
  };

  const chooseMode = (m: string) => {
    setMode(m);

    const q = questions[index];
    const answers = [
      q.bonne_reponse,
      q.mauvaise_1,
      q.mauvaise_2,
      q.mauvaise_3,
    ];

    let arr: string[] = [];

    if (m === "duo") arr = [q.bonne_reponse, q.mauvaise_1];
    if (m === "carre") arr = answers;

    arr = arr.sort(() => Math.random() - 0.5);

    setPropositions(arr);
  };

  const answer = async (rep: string) => {
    const q = questions[index];

    await supabase.from("reponse").insert([
      {
        run_id: runId,
        question_id: q.id,
        mode,
        propositions,
        reponse: rep,
      },
    ]);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setMode("");
      setPropositions([]);
    } else {
      alert("Quiz terminé !");
    }
  };

  if (!questions.length) return <p>Chargement...</p>;

  const q = questions[index];

  return (
    <div className="p-10">
      <h1>{q.libelle}</h1>

      {!mode && (
        <div className="flex gap-4 mt-6">
          <button onClick={() => chooseMode("cash")}>Cash (5 pts)</button>
          <button onClick={() => chooseMode("duo")}>Duo (1 pt)</button>
          <button onClick={() => chooseMode("carre")}>Carré (3 pts)</button>
        </div>
      )}

      {mode === "cash" && (
        <input
          className="input mt-6"
          placeholder="Votre réponse..."
          onKeyDown={(e) => {
            if (e.key === "Enter") answer((e.target as any).value);
          }}
        />
      )}

      {(mode === "duo" || mode === "carre") && (
        <div className="mt-6">
          {propositions.map((p, i) => (
            <button key={i} className="block border p-3 mb-2"
              onClick={() => answer(p)}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
