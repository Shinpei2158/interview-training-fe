import { Link } from "react-router-dom";
import { Lock, BookOpen, HelpCircle, Calendar, Tag } from "lucide-react";

export default function PrivateQuizCard({ quiz }) {
  const subCategories = quiz.subCategories || [];
  const totalQuestion = quiz.totalQuestion ?? 0;
  const createdAt = quiz.createdAt
    ? new Date(quiz.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Lock size={16} className="text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {quiz.title}
          </h3>
          {quiz.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {quiz.description}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {subCategories.slice(0, 4).map((sub) => (
            <span
              key={sub.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100"
            >
              <Tag size={9} />
              {sub.name}
            </span>
          ))}
          {subCategories.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-100">
              +{subCategories.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <HelpCircle size={12} />
          {totalQuestion} questions
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {createdAt}
        </span>
      </div>

      {/* Actions */}
      <div className="pt-1 border-t border-slate-50">
        <Link
          to={`/quizzes/${quiz.id}/study`}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all active:scale-95"
        >
          <BookOpen size={13} />
          Study
        </Link>
      </div>
    </div>
  );
}
