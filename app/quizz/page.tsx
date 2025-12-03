import { supabase } from "@/lib/supabaseClient";
import QuizList from "./QuizList";

export default async function Page() {
  const { data: quizz } = await supabase
    .from("quizz")
    .select(`id, theme`);

  return <QuizList quizz={quizz || []} />;
}
