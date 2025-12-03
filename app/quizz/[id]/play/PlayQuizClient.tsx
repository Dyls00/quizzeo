"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function PlayQuizClient({ quizz_id }: any) {

  const [questions, setQuestions] = useState<any[]>([]);
  const [score, setScore] = useState(3);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState("");
  const [partieId, setPartieId] = useState<number | null>(null);
  const [propositions, setPropositions] = useState<string[]>([]);
  const router = useRouter();


  useEffect(() => {
    loadQuestions();
    initPartie();
  }, [quizz_id]);

  const loadQuestions = async () => {
    const { data } = await supabase.rpc("get_quizz_questions", {
      quizz_id_param: quizz_id,
    });
    setQuestions(data || []);
  };

  const initPartie = async () => {
    const { data, error } = await supabase
      .from("partie")
      .insert([{ quizz_id }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setPartieId(data.id);
  };

  const EndPartie = async () => {
    const { data, error } = await supabase
      .from("partie")
      .insert([{ quizz_id, score }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setPartieId(data.id);
  };

  const chooseMode = (m: string) => {
    setMode(m);

    const q = questions[index];
    const answers = [
      q.reponse_correcte,
      q.reponse_incorrect_1,
      q.reponse_incorrect_2,
      q.reponse_incorrect_3,
    ];

    let arr: string[] = [];

    if (m === "duo") arr = [q.reponse_correcte, q.reponse_incorrect_1];
    if (m === "carre") arr = answers;

    arr = arr.sort(() => Math.random() - 0.5);
    setPropositions(arr);
  };

  const answer = async (rep: string) => {
    const q = questions[index];

    await supabase.from("reponse").insert([
      {
        partie_id: partieId,
        question_id: q.id,
        mode,
        propositions,
        reponse: rep,
        score
      },
    ]);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setMode("");
      setPropositions([]);
    } else {
      await supabase.from("partie").insert([
      {
        quizz_id,
        score
      },
    ]);
      router.push(`/quizz/${quizz_id}/resultats?partie=${partieId}`);
    }
  };

  if (!questions.length) return (<div className="loadingspinner">
    <div id="square1"></div>
    <div id="square2"></div>
    <div id="square3"></div>
    <div id="square4"></div>
    <div id="square5"></div>
  </div>);

  const q = questions[index];

  return (
    <div className="question-main">
      <div className="question-form mt-30">
        <div className="form form-question play-form">
          <div className="question-text">Place au jeu !</div>
          <label className="question-title">Veuillez répondre aux questions</label>
          <div className="space-y-2 p-4">
            <div
              role="alert"
              className="bg-white dark:bg-gray-900 border-l-4 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 transform hover:scale-105"
            >
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 flex-shrink-0 mr-2 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              <p className="text-xs font-semibold">{q.libelle}?</p>
            </div>
          </div>
          {!mode && (
            <div className="flex gap-4 mt-6">
              <button className="button" onClick={() => chooseMode("cash")}>Cash (5 pts)</button>
              <button className="button" onClick={() => chooseMode("duo")}>Duo (1 pt)</button>
              <button className="button" onClick={() => chooseMode("carre")}>Carré (3 pts)</button>
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
      </div>
    </div>
  )
}