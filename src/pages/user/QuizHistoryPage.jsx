import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";

import { fetchQuizProgress } from "@/api/quiz";

export default function QuizHistoryPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["quiz-progress"],
    queryFn: fetchQuizProgress,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-blue-600">Quizzes</p>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
          <History size={24} />
          Learning History
        </h1>
      </div>

      <section className="rounded-lg border bg-white">
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">Loading history...</p>
        ) : (
          <div className="divide-y">
            {data.map((item) => (
              <article key={item.id} className="p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">{item.quizTitle}</h2>
                    <p className="text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm text-slate-600">
                    {item.status} - {item.score ?? 0}/{item.totalQuestions}
                  </div>
                </div>
              </article>
            ))}
            {!data.length && <p className="p-4 text-sm text-slate-500">No history yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
