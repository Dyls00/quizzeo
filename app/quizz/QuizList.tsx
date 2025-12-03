"use client";

import Link from "next/link";

export default function QuizList({ quizz }: any) {
  return (
    <div className="question-main">
      <div className="question-form mt-30">
        <div className="form form-question">
          <div className="question-text">Bienvenue !</div>
          <label className="question-title">Voici une liste de quizz disponibles</label>
          <label className="question-title">Veuillez choisir un quizz</label>
          <div className="flex flex-col gap-4">
            {quizz.map((q: any) => (
              <div
                key={q.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div className="">
                  <h2 className="text-xl font-semibold">Quizz N°{q.id}</h2>
                  <p className="text-gray-500">Thème : {q.theme}</p>
                </div>

                <Link
                  href={`/quizz/${q.id}/play`}
                  className="play-quiz"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                  </svg>

                </Link>
              </div>
            ))}
          </div>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            <a href="/quizz/hall-of-fame" className="hall">Meilleurs joueurs</a>
          </button>

          <button className="button-confirmed"><a href="/">Retourner →</a></button>
        </div>
      </div>
    </div>
  )
}