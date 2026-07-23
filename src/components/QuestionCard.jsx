import { cx } from "@/utils/filter";
import { Bookmark, ChevronDown } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import ReportButton from "@/components/quiz/ReportButton";

export default function QuestionCard({
  question,
  isAnswerOpen,
  isSaved,
  isSaving,
  onToggleAnswer,
  onSaveToggle,
  innerRef,
}) {
  const getLevelBadge = (level) => {
    if (!level) return null;
    const l = String(level).toUpperCase();
    if (l === "EASY" || l === "DỄ") {
      return (
        <span className="rounded-lg bg-[#E6F4EA] text-[#137333] px-2.5 py-1 text-xs font-bold border border-[#c3e6cb]">
          Dễ
        </span>
      );
    }
    if (l === "MEDIUM" || l === "TRUNG BÌNH") {
      return (
        <span className="rounded-lg bg-[#FEF3C7] text-[#D97706] px-2.5 py-1 text-xs font-bold border border-[#fde68a]">
          Trung bình
        </span>
      );
    }
    if (l === "HARD" || l === "KHÓ") {
      return (
        <span className="rounded-lg bg-[#FEE2E2] text-[#DC2626] px-2.5 py-1 text-xs font-bold border border-[#fca5a5]">
          Khó
        </span>
      );
    }
    return (
      <span className="rounded-lg bg-white border border-[#e2e8f0] px-2.5 py-1 text-xs font-medium text-[#64748b]">
        Mức độ: {question.level}
      </span>
    );
  };

  return (
    <article
      ref={innerRef}
      className={cx(
        "scroll-mt-24 rounded-2xl border bg-white shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] transition-all duration-300",
        isAnswerOpen
          ? "border-[#0077b6] ring-4 ring-[#0077b6]/10"
          : "border-slate-200/80",
      )}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 bg-[#f8fafc] px-5 py-4 rounded-t-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-gradient-to-r from-[#0077b6] to-[#1e6091] px-3 py-1 text-xs font-bold text-white shadow-xs">
            Câu hỏi {question.displayNumber}
          </span>
          {getLevelBadge(question.level)}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ReportButton reportType="QUESTION" targetId={question.id} />
          <button
            type="button"
            onClick={() => onSaveToggle(question.id)}
            disabled={isSaving}
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              isSaved
                ? "border-amber-200 bg-amber-50 text-amber-600"
                : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-amber-300 hover:bg-amber-50 hover:text-amber-500",
            )}
            title={isSaved ? "Bỏ lưu câu hỏi" : "Lưu câu hỏi"}
          >
            <Bookmark
              className={cx(
                "h-4 w-4",
                isSaved && "fill-amber-500 text-amber-600",
              )}
            />
          </button>

          <button
            type="button"
            onClick={() => onToggleAnswer(question.id)}
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200",
              isAnswerOpen
                ? "border-[#0077b6] bg-[#f0f7ff] text-[#0077b6]"
                : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#0077b6] hover:bg-[#f0f7ff]",
            )}
            title={isAnswerOpen ? "Ẩn đáp án" : "Xem đáp án"}
          >
            <ChevronDown
              className={cx(
                "h-4 w-4 transition-transform duration-300",
                isAnswerOpen && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {question.contentImageUrl && (
          <div className="mb-4 overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-2">
            <img
              src={question.contentImageUrl}
              alt={`Hình ảnh câu hỏi ${question.displayNumber}`}
              className="max-h-80 w-full object-contain"
            />
          </div>
        )}

        <MarkdownContent className="text-base font-medium leading-7 text-[#0f172a]">
          {question.content}
        </MarkdownContent>

        {/* Options Grid */}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {question.options?.map((option) => {
            const showAsCorrect = isAnswerOpen && option.isCorrect;
            return (
              <div
                key={option.key}
                className={cx(
                  "rounded-xl border p-4 transition-all duration-200",
                  showAsCorrect
                    ? "border-[#10b981] bg-[#e6f4ea] shadow-xs"
                    : "border-[#e2e8f0] bg-white hover:border-[#0077b6]/40 hover:bg-[#f0f7ff]/50",
                )}
              >
                <div className="flex gap-3">
                  <span
                    className={cx(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase border shadow-2xs transition-colors",
                      showAsCorrect
                        ? "border-[#10b981] bg-[#10b981] text-white"
                        : "border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a]",
                    )}
                  >
                    {option.label || option.key}
                  </span>
                  <MarkdownContent className="min-w-0 text-sm font-medium leading-6 text-[#0f172a]">
                    {option.content}
                  </MarkdownContent>
                </div>
              </div>
            );
          })}
        </div>

        {/* Answer Explanation Section */}
        {isAnswerOpen && (
          <div className="mt-5 rounded-xl border border-[#0077b6]/30 bg-[#f0f7ff] p-4 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0077b6]">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#10b981]" />
              Đáp án chính xác: {question.correctAnswer}
            </div>
            {question.correctOptionText && (
              <MarkdownContent className="mt-2 border-t border-[#0077b6]/20 pt-2 text-sm leading-6 text-[#0f172a]">
                {question.correctOptionText}
              </MarkdownContent>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
