"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HallOfFame({ params }: any) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("partie")
        .select("score")
        .eq("quizz_id", params.id)
        .order("score", { ascending: false });
      setScores(data || []);
    };
    load();
  }, []);

  return (
   <div className="question-main">
            <div className="question-form mt-30">
                <form className="form form-question">
                    <div className="question-text">Bienvenue ! </div>
                    <label className="question-title">Voici un ordre des meilleurs joueurs</label>
                    <button className="button-confirm"><a href="/">Retourner →</a></button>
                </form>
            </div>
        </div>

  );
}
