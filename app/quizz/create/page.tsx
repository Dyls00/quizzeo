"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Question } from "@/question/page";

export default function CreateQuiz() {
  const [libelle, setLibelle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const loadQuestions = async () => {
      const { data } = await supabase.from("question").select("*");
      setQuestions(data || []);
    };
    loadQuestions();
  }, []);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const create = async () => {
    if (!libelle.trim()) {
      return alert("Il faut un libellé pour le quiz !");
    }
    if (selected.length === 0) {
      return alert("Il faut sélectionner au moins une question !");
    }
    if (selected.length > 10) {
      return alert("Vous ne pouvez sélectionner que 10 questions !");
    }

    const { data: quiz } = await supabase
      .from("quizz")
      .insert([{ libelle }])
      .select()
      .single();

    for (const q of selected) {
      await supabase.from("quizz_question").insert([
        { quizz_id: quiz.id, question_id: q },
      ]);
    }

    alert("Quiz créé !");
    setLibelle("");
    setSelected([]);
  };

  return (
    <div className="question-main">
      <div className="question-form mt-30">
        <form className="form form-question">

          <div className="question-text">Création d’un nouveau quizz</div>
          <label className="question-title">Remplissez les informations</label>

          {/* Libellé */}
          <div className="space-y-2 p-4">
            <div
              role="alert"
              className="bg-white dark:bg-gray-900 border-l-4 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded-lg flex items-center"
            >
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 flex-shrink-0 mr-2 text-green-600"
              >
                <path
                  d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              <p className="text-xs font-semibold">Libellé du quizz</p>
            </div>

            <input
              className="input mt-2"
              type="text"
              placeholder="Écrivez le libellé du quizz"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
            />
          </div>

          {/* Liste des questions */}
          <label className="question-title mt-4">Sélection des questions</label>

          <div className="space-y-2">
            {questions.map((q: any) => (
              <div
                key={q.id}
                onClick={() => toggle(q.id)}
                className={`cursor-pointer p-3 border-l-4 rounded-lg flex items-center transition duration-300 ease-in-out transform hover:scale-105 
                  ${selected.includes(q.id)
                    ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                    : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                {q.libelle}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="button-confirm mt-6"
            onClick={create}
          >
            Confirmez →
          </button>

          <a href="/" className="grid justify-center items-center mt-4">
            Retour
          </a>
        </form>
      </div>
    </div>
  );
}
