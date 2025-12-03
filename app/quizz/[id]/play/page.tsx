import PlayQuizClient from "./PlayQuizClient";

export interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;

  return <PlayQuizClient quizz_id={id} />;
}
