import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, Clock3, Play, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fetchQuizProgress, fetchQuizProgressDetail } from "@/api/quiz";
import PageHeader from "@/components/common/PageHeader";
import SubCategoryTag from "@/components/common/SubCategoryTag";

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
      <PageHeader
        badge="Học tập của tôi"
        title="Tiến Độ & Thống Kê Ôn Tập"
        description="Theo dõi chi tiết các lượt kiểm tra thử, điểm số trung bình và trạng thái hoàn thành bài kiểm tra."
      />

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Tổng số lượt làm
            </span>
            <div className="rounded-xl bg-[#f0f7ff] p-2.5 text-[#0077b6] border border-[#bae6fd]">
              <BarChart3 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {data.length}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Bài kiểm tra đang làm & đã hoàn thành
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Bài kiểm tra hoàn thành
            </span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-200">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {finished.length}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Đã nộp bài thành công</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Điểm số trung bình
            </span>
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 border border-purple-200">
              <Clock3 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{average}%</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Tính trên tất cả bài kiểm tra hoàn thành
          </p>
        </div>
      </div>

      {/* Filter Tabs & Content Section */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200 pb-px gap-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-4 text-sm font-bold transition-colors relative cursor-pointer ${
              activeTab === "all"
                ? "text-[#0077b6]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tất cả tiến độ ({data.length})
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077b6] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("in_progress")}
            className={`pb-4 text-sm font-bold transition-colors relative cursor-pointer ${
              activeTab === "in_progress"
                ? "text-[#0077b6]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Đang làm dở ({inProgress.length})
            {activeTab === "in_progress" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077b6] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("finished")}
            className={`pb-4 text-sm font-bold transition-colors relative cursor-pointer ${
              activeTab === "finished"
                ? "text-[#0077b6]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Đã hoàn thành ({finished.length})
            {activeTab === "finished" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077b6] rounded-full" />
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm font-medium text-slate-500 animate-pulse">
              Đang tải lịch sử tiến độ...
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-white shadow-2xs">
            <p className="text-sm text-slate-500 font-medium">
              Chưa có dữ liệu tiến độ cho mục này.
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
                  className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] transition-all hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Category & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.categoryName && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#f0f7ff] border border-[#bae6fd] px-2.5 py-0.5 text-xs font-bold text-[#0077b6] uppercase tracking-wide">
                          {item.categoryName}
                        </span>
                      )}

                      {item.status === "IN_PROGRESS" ? (
                        <span className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                          Đang làm dở
                        </span>
                      ) : (
                        <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          Đã hoàn thành
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
                        {uniqueSubcategories.map((sub) => (
                          <SubCategoryTag key={sub.id} name={sub.name} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress Indicator or Score */}
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                    {item.status === "IN_PROGRESS" ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Tiến độ</span>
                          <span>
                            {answeredCount} / {item.totalQuestions} câu hỏi (
                            {progressPercent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#0077b6] rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          Hoàn thành lúc:{" "}
                          <span className="font-medium text-slate-800">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                          Điểm số: {item.score} / {item.totalQuestions}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">
                        Thực hiện lúc{" "}
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {item.status === "IN_PROGRESS" ? (
                        <button
                          type="button"
                          onClick={() => handleReviewOrResume(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0077b6] hover:bg-[#0096c7] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <Play size={12} fill="currentColor" />
                          Làm tiếp bài kiểm tra
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReviewOrResume(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#f0f7ff] border border-[#bae6fd] hover:bg-[#e0f2fe] px-3.5 py-2 text-xs font-bold text-[#0077b6] transition-all active:scale-[0.98] cursor-pointer"
                          >
                            <Eye size={12} />
                            Xem chi tiết đáp án
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
