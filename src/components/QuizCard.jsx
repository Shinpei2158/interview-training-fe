import { Link, useLocation } from "react-router-dom";
import { Calendar, HelpCircle, Star } from "lucide-react";
import QuizActions from "./quiz/QuizActions";
import SubCategoryTag from "@/components/common/SubCategoryTag";

export default function QuizCard({ quiz, onChange }) {
  const location = useLocation();

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md hover:border-[#bae6fd] hover:bg-[#f0f7ff]/30 transition-all duration-300">
      <Link
        to={`/quizzes/${quiz.id}/study`}
        state={{ from: location.pathname }}
        className="flex-1 block focus:outline-none"
      >
        {/* Title */}
        <h3 className="font-bold text-[#0f172a] text-lg line-clamp-2 mb-2 group-hover:text-[#0077b6] transition-colors duration-200">
          {quiz.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#64748b] line-clamp-2 mb-4 leading-relaxed">
          {quiz.description || "Chưa có mô tả cho bộ câu hỏi phỏng vấn này."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {quiz.subCategories?.length ? (
            quiz.subCategories.map((sub) => (
              <SubCategoryTag key={sub.id} name={sub.name} size="sm" />
            ))
          ) : (
            <span className="text-xs text-[#94a3b8] italic">General</span>
          )}
        </div>

        {/* Rating & Like */}
        <div className="flex items-center gap-5 mb-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Star
              size={16}
              className={
                quiz.userRating > 0
                  ? "fill-[#f59e0b] text-[#f59e0b]"
                  : "text-[#f59e0b]"
              }
            />
            <span className="font-medium text-[#64748b]">
              {Number(quiz.averageRate ?? 0).toFixed(1)} ({quiz.totalRate ?? 0}{" "}
              lượt đánh giá)
            </span>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="pt-4 border-t border-[#e2e8f0]">
        {/* Thông tin tác giả */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src={quiz.avatarUrl || "/default-avatar.png"}
                alt={quiz.username || "User"}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-[#e2e8f0]"
              />

              <span className="font-medium text-[#0f172a] text-xs max-w-25 truncate">
                {quiz.username || "Ẩn danh"}
              </span>
            </div>

            <span className="w-1 h-1 bg-[#cbd5e1] rounded-full" />

            <div className="flex items-center gap-1 text-[#64748b] text-xs">
              <HelpCircle size={13} className="text-[#0077b6]" />
              <span className="font-medium text-[#64748b]">
                {quiz.totalQuestion ?? 0} câu
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-[#64748b] flex items-center gap-1">
            <Calendar size={12} />
            {new Date(quiz.createdAt).toLocaleDateString()}
          </span>

          <div onClick={(e) => e.stopPropagation()}>
            <QuizActions quiz={quiz} onChange={onChange} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
