"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HallOfFame({ params }: any) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("run")
        .select("score, joueur:pseudo")
        .eq("quizz_id", params.id)
        .order("score", { ascending: false });
      setScores(data || []);
    };
    load();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl">Hall of Fame</h1>

      {scores.map((s: any, i) => (
        <div key={i} className="border p-3 mt-3">
          <strong>{s.joueur}</strong> — {s.score} points
        </div>
      ))}
    </div>
  );
}
