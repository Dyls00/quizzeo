import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid min-h-screen">
      <main className="flex flex-col row-start-2 items-center">
        <h1 className="text-quizzeo mb-10">Quizzeo</h1>
        <ol className="list-inside mb-10 list-decimal mb-8 text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Créer votre quizz from scratch.
          </li>
          <li className="tracking-[-.01em]">
            Lancer un quizz existant.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="
              rounded-full
              border border-solid border-transparent
              transition-colors
              flex items-center justify-center
              bg-foreground text-background
              gap-2
              font-medium text-sm sm:text-base
              h-10 sm:h-12 px-4 sm:px-5 sm:w-auto
              hover:bg-black hover:text-white
            "
            href="/question/add"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>

            Ajoutez vos questions
          </Link>
          <Link
            className="
              rounded-full
              border border-solid border-transparent
              transition-colors
              flex items-center justify-center
              bg-foreground text-background
              gap-2
              font-medium text-sm sm:text-base
              h-10 sm:h-12 px-4 sm:px-5 sm:w-auto
              hover:bg-black hover:text-white
            "
            href="/quizz/create"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>

            Créez votre quizz
          </Link>
        </div>
        <div className="mt-20">
          <Link
            className="
          rounded-full
          border border-solid border-transparent
          transition-colors
          flex items-center justify-center
          bg-foreground text-background
          gap-2
          font-medium text-sm sm:text-base
          h-10 sm:h-12 px-4 sm:px-5 sm:w-auto
          hover:bg-black hover:text-white
        "
            href="/quizz"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Vers les quizz →
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
