import { Link } from "react-router-dom";
import { Calendar, HelpCircle, Star } from "lucide-react";
import QuizActions from "./quiz/QuizActions";

export default function QuizCard({ quiz, onChange }) {
  return (
    <div className="group relative flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300">
      <Link
        to={`/quizzes/${quiz.id}/study`}
        className="flex-1 block focus:outline-none"
      >
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {quiz.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {quiz.description || "Chưa có mô tả cho bộ câu hỏi phỏng vấn này."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {quiz.subCategories?.length ? (
            quiz.subCategories.map((sub) => (
              <span
                key={sub.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100 group-hover:bg-blue-50/50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors"
              >
                {sub.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">General</span>
          )}
        </div>

        {/* Rating & Like */}
        <div className="flex items-center gap-5 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Star
              size={16}
              className={
                quiz.userRating > 0
                  ? "fill-amber-400 text-amber-400"
                  : "text-amber-400"
              }
            />
            <span className="font-medium text-gray-500">
              {Number(quiz.averageRate ?? 0).toFixed(1)} ({quiz.totalRate ?? 0}{" "}
              lượt đánh giá)
            </span>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-50/80">
        {/* Thông tin tác giả */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src={quiz.avatarUrl || "/default-avatar.png"}
                alt={quiz.username || "User"}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-100"
              />

              <span className="font-medium text-gray-700 text-xs max-w-25 truncate">
                {quiz.username || "Ẩn danh"}
              </span>
            </div>

            <span className="w-1 h-1 bg-gray-300 rounded-full" />

            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <HelpCircle size={13} />
              <span className="font-medium text-gray-600">
                {quiz.totalQuestion ?? 0} câu
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
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
