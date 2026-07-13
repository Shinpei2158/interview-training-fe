import { useQuery } from "@tanstack/react-query";

import { fetchLikedQuizzes } from "@/api/quiz";
import QuizList from "@/components/QuizList";

export default function LikedQuizzesPage() {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["liked-quizzes"],
    queryFn: fetchLikedQuizzes,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-rose-600">Favorites</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Liked quizzes</h1>
      </div>
      <QuizList quizzes={data} isLoading={isLoading} isError={isError} />
    </div>
  );
}
