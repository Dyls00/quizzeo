"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Theme = {
    id: number;
    libelle: string;
};

export default function Question() {
    const [question, setQuestion] = useState("");
    const [bonne, setBonne] = useState("");
    const [m1, setM1] = useState("");
    const [m2, setM2] = useState("");
    const [m3, setM3] = useState("");
    const [theme, setTheme] = useState<string | "">("");
    const [ListTheme, setListTheme] = useState<Theme[]>([]);

    useEffect(() => {
        const load = async () => {
            const { data, error } = await supabase.from("theme").select("id,libelle");
            if (error) {
                console.log(error);
            } else {
                setListTheme(data || []);
            }
        };
        load();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const { data, error } = await supabase.from("question").insert([
            {
                libelle: question,
                reponse_correcte: bonne,
                reponse_incorrect_1: m1,
                reponse_incorrect_2: m2,
                reponse_incorrect_3: m3,
            },
        ]);

        if (error) {
            console.log(error);
        } else {
            setQuestion("");
            setBonne("");
            setM1("");
            setM2("");
            setM3("");
        }
    };

    return (
        <div className="question-main">
            <div className="question-form mt-30">
                <form className="form form-question" onSubmit={handleSubmit}>
                    <div className="question-text">Bienvenue</div>
                    <label className="question-title">Veuillez créer votre question</label>

                    <input
                        className="input"
                        placeholder="Décrire la question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="Décrire la bonne réponse"
                        value={bonne}
                        onChange={(e) => setBonne(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="Décrire la mauvaise réponse 1"
                        value={m1}
                        onChange={(e) => setM1(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="Décrire la mauvaise réponse 2"
                        value={m2}
                        onChange={(e) => setM2(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="Décrire la mauvaise réponse 3"
                        value={m3}
                        onChange={(e) => setM3(e.target.value)}
                    />

                    <button className="button-confirm text-black">Let’s go →</button>
                    <a href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                    </a>
                </form>

            </div>
        </div>
    );
}
