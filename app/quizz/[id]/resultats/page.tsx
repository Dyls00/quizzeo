import ResultatsQuiz from "./ResultatsQuiz";

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;

  return <ResultatsQuiz quizz_id={id} />;
}
