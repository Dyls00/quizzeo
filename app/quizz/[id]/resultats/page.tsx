import ResultatsQuiz from "./ResultatsQuiz";

export default async function Page({ params }) {
  const { id } = await params;

  return (
    <ResultatsQuiz quizz_id={id} />
  );
}
