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
      prev.includes(id)
        ? prev.filter((q) => q !== id)
        : [...prev, id]
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
      return alert("Vous ne pouvez selectionner que 10 questions !");
    }

    const { data: quiz } = await supabase
      .from("quizz")
      .insert([{ libelle, }])
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

    <div className="bg-white-500 px-7 h-screen grid justify-center items-center">
      <div className="bg-gray-300 grid gap-16 rounded w-180 p-5" >
        <h1 className="question-text  grid justify-center items-center">Allez on y est !</h1>
        <div className="w-full mt-5 flex gap-6">
          <input className="shadow-2xl p-3 ex w-full outline-none focus:border-solid focus:border-[1px] border-[#035ec5] placeholder:text-black"
            type="text"
            id="libelle"
            name="libelle"
            placeholder="Écrivez le libellé du quizz"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}

            required />
        </div>
        <div className="grid gap-6 w-full">
          {questions.map((q: any) => (
            <div
              key={q.id}
              onClick={() => toggle(q.id)}
              className={`p-3 border rounded mb-2 cursor-pointer ${selected.includes(q.id) ? "bg-green-300" : ""
                }`}
            >
              {q.libelle}
            </div>
          ))}
        </div>
        <button className="outline-none glass shadow-2xl  w-full p-3  bg-[#ffffff42] hover:border-[#035ec5] hover:border-solid hover:border-[1px]  hover:text-[#035ec5] font-bold" onClick={create}>Confirmez !</button>
        <a className="grid justify-center items-center" href="/"> Pas encore ?</a>
      </div>
    </div>

  );
}
