"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResultatsQuiz() {

  const search = useSearchParams();
  const partie_id = search.get("partie");

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("reponse")
        .select(`
          id,
          reponse,
          mode,
          question:question_id (libelle, reponse_correcte)
        `)
        .eq("partie_id", partie_id);

      setRows(data || []);
    };

    load();
  }, [partie_id]);

  if (!rows.length) return (<div className="loadingspinner">
    <div id="square1"></div>
    <div id="square2"></div>
    <div id="square3"></div>
    <div id="square4"></div>
    <div id="square5"></div>
  </div>);

  return (
    <div className="question-main">
      <div className="question-form mt-30">
        <form className="form form-question">
          <div className="question-text">Jeu terminé ! </div>
          <label className="question-title">Voici les résultats de votre quizz</label>
          {rows.map((r, i) => (
            <div key={i}>
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
                <p className="text-xs font-semibold">{r.question.libelle}?</p>
              </div>
              <p><strong>Votre réponse :</strong> {r.reponse}</p>
              <p><strong>Bonne réponse :</strong> {r.question.reponse_correcte}</p>
            </div>
          ))}
          <button className="button-confirm"><a href="/">Retourner →</a></button>
        </form>
      </div>
    </div>
  );
}
