import ResultatsQuiz from "./ResultatsQuiz";
import { PageProps } from "../play/page";

export default async function Page({ params }: PageProps) {
  const { id } = params;

  return (
    <ResultatsQuiz quizz_id={id} />
  );
}
