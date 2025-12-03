import PlayQuizClient from "./PlayQuizClient";

export default async function Page({ params }) {
  const { id } = await params; 

  return <PlayQuizClient quizz_id={id} />;
}
