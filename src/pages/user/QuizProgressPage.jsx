import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, Clock3, Play, Tag, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fetchQuizProgress, fetchQuizProgressDetail } from "@/api/quiz";

export default function QuizProgressPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const { data = [], isLoading } = useQuery({
    queryKey: ["quiz-progress"],
    queryFn: fetchQuizProgress,
  });

  const handleReviewOrResume = async (progressId) => {
    try {
      const progress = await fetchQuizProgressDetail(progressId);
      navigate(`/quizzes/${progress.quizId}/test`, {
        state: { test: progress },
      });
    } catch (error) {
      console.error("Lỗi khi tải chi tiết tiến trình:", error);
    }
  };

  // Tính toán thống kê từ danh sách
  const finished = data.filter((item) => item.status === "FINISHED");
  const inProgress = data.filter((item) => item.status === "IN_PROGRESS");

  const average =
    finished.length === 0
      ? 0
      : Math.round(
          (finished.reduce(
            (sum, item) =>
              sum + (item.score || 0) / Math.max(item.totalQuestions || 1, 1),
            0,
          ) /
            finished.length) *
            100,
        );

  // Lọc dữ liệu theo Tab đang chọn
  const filteredData = data.filter((item) => {
    if (activeTab === "in_progress") return item.status === "IN_PROGRESS";
    if (activeTab === "finished") return item.status === "FINISHED";
    return true; // "all"
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          My Learning
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900 tracking-tight">
          Quiz Progress
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your active attempts and look back at your achievements.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">
              Total Attempts
            </span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <BarChart3 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {data.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Active & completed quizzes
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">
              Finished Tests
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {finished.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Successfully completed</p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">
              Average Score
            </span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Clock3 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{average}%</p>
          <p className="text-xs text-slate-400 mt-1">
            Across all finished quizzes
          </p>
        </div>
      </div>

      {/* Filter Tabs & Content Section */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200 pb-px gap-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === "all"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Progress ({data.length})
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("in_progress")}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === "in_progress"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            In Progress ({inProgress.length})
            {activeTab === "in_progress" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("finished")}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === "finished"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Completed ({finished.length})
            {activeTab === "finished" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-slate-500 animate-pulse">
              Loading your progress history...
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-sm text-slate-500 font-medium">
              No quiz progress found in this category.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {filteredData.map((item) => {
              // Lọc trùng lặp subcategories
              const uniqueSubcategories = Array.from(
                new Map(
                  (item.subCategories || []).map((sub) => [sub.id, sub]),
                ).values(),
              );

              const answeredCount = item.answeredQuestions ?? 0;

              const progressPercent = Math.min(
                Math.round((answeredCount / (item.totalQuestions || 1)) * 100),
                100,
              );

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-5 rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Category & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.categoryName && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 uppercase tracking-wide">
                          {item.categoryName}
                        </span>
                      )}

                      {item.status === "IN_PROGRESS" ? (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          In Progress
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Completed
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                      {item.quizTitle}
                    </h3>

                    {/* Subcategories */}
                    {uniqueSubcategories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <Tag size={12} className="text-slate-400 shrink-0" />
                        {uniqueSubcategories.map((sub) => (
                          <span
                            key={sub.id}
                            className="rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress Indicator or Score */}
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                    {item.status === "IN_PROGRESS" ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Progress</span>
                          <span>
                            {answeredCount} / {item.totalQuestions} Questions (
                            {progressPercent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          Completed:{" "}
                          <span className="font-medium text-slate-800">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          Score: {item.score} / {item.totalQuestions}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">
                        Attempted{" "}
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {item.status === "IN_PROGRESS" ? (
                        <button
                          type="button"
                          onClick={() => handleReviewOrResume(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]"
                        >
                          <Play size={12} fill="currentColor" />
                          Resume Quiz
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReviewOrResume(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]"
                          >
                            <Eye size={12} />
                            Review Result
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
