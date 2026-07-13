import { useQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fetchQuizProgress, fetchQuizProgressDetail } from "@/api/quiz";

export default function QuizProgressPage() {
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery({
    queryKey: ["quiz-progress"],
    queryFn: fetchQuizProgress,
  });

  const handleResume = async (progressId) => {
    const progress = await fetchQuizProgressDetail(progressId);
    navigate(`/quizzes/${progress.quizId}/test`, { state: { resume: progress } });
  };

  const finished = data.filter((item) => item.status === "FINISHED");
  const average =
    finished.length === 0
      ? 0
      : Math.round(
          (finished.reduce(
            (sum, item) => sum + (item.score || 0) / Math.max(item.totalQuestions || 1, 1),
            0,
          ) /
            finished.length) *
            100,
        );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-blue-600">Quizzes</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Progress</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-5">
          <BarChart3 className="text-blue-600" />
          <p className="mt-3 text-2xl font-bold">{data.length}</p>
          <p className="text-sm text-slate-500">Total attempts</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <CheckCircle2 className="text-green-600" />
          <p className="mt-3 text-2xl font-bold">{finished.length}</p>
          <p className="text-sm text-slate-500">Finished tests</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <Clock3 className="text-blue-600" />
          <p className="mt-3 text-2xl font-bold">{average}%</p>
          <p className="text-sm text-slate-500">Average score</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b p-4 font-semibold">Recent progress</div>
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">Loading progress...</p>
        ) : (
          <div className="divide-y">
            {data.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{item.quizTitle}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(item.createdAt).toLocaleString()} - {item.status}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {item.currentQuestionIndex + 1}/{item.totalQuestions}
                  </span>
                  {item.status === "IN_PROGRESS" && (
                    <button
                      type="button"
                      onClick={() => handleResume(item.id)}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Resume
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!data.length && <p className="p-4 text-sm text-slate-500">No quiz progress yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
