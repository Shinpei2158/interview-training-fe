import { Link } from "react-router-dom";
import { Lock, BookOpen, HelpCircle, Calendar, Trash2, Loader2 } from "lucide-react";
import SubCategoryTag from "@/components/common/SubCategoryTag";
import { useDeleteQuiz } from "@/hooks/quiz/useInterviewerQuiz";

export default function PrivateQuizCard({ quiz }) {
  const deleteQuizMutation = useDeleteQuiz();
  const subCategories = quiz.subCategories || [];
  const totalQuestion = quiz.totalQuestion ?? 0;
  const createdAt = quiz.createdAt
    ? new Date(quiz.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa bộ câu hỏi cá nhân "${quiz.title}"?`)) {
      deleteQuizMutation.mutate(quiz.id);
    }
  };

  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md hover:border-[#bae6fd] transition-all duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 rounded-xl bg-[#f0f7ff] border border-[#bae6fd] flex items-center justify-center">
          <Lock size={16} className="text-[#0077b6]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-[#0077b6] transition-colors">
            {quiz.title}
          </h3>
          {quiz.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {quiz.description}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {subCategories.slice(0, 4).map((sub) => (
            <SubCategoryTag key={sub.id} name={sub.name} showIcon size="sm" />
          ))}
          {subCategories.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd]">
              +{subCategories.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <HelpCircle size={12} />
          {totalQuestion} câu hỏi
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {createdAt}
        </span>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <Link
          to={`/quizzes/${quiz.id}/study`}
          state={{ from: "/quiz/saved" }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0077b6] bg-[#f0f7ff] border border-[#bae6fd] hover:bg-[#e0f2fe] transition-all active:scale-95 cursor-pointer"
        >
          <BookOpen size={13} />
          Ôn tập
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteQuizMutation.isPending}
          title="Xóa bộ câu hỏi cá nhân"
          className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {deleteQuizMutation.isPending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Trash2 size={13} />
          )}
          <span className="hidden sm:inline">Xóa</span>
        </button>
      </div>
    </div>
  );
}
