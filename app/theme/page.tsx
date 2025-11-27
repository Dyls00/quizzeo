"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Theme() {
      const [theme, setTheme] = useState("");
    
      const handleSubmit = async (e: any) => {
        e.preventDefault();
    
        const { data, error } = await supabase.from("theme").insert([
          {
            libelle: theme,
          },
        ]);
    
        if (error) {
          console.log(error);
        } else {
          setTheme("");
        }
      };
    return (
        <div className="question-main">
            <div className="question-form mt-30">
                <form className="form form-question" onSubmit={handleSubmit}>
                    <div className="question-text">Bienvenue</div>
                    <label className="question-title">Veuillez créer votre thème</label>
                    <input className="input" 
                    name="name" 
                    placeholder="Décrire le thème" 
                    type="text" 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}/>
                    <button className="button-confirm">Let`s go →</button>
                    <a href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                    </a>
                </form>
            </div>
        </div>
    )
}