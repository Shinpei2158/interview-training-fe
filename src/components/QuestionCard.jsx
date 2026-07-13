import { cx } from "@/utils/filter";
import { Bookmark, ChevronDown } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import ReportButton from "@/components/quiz/ReportButton";

export default function QuestionCard({
  question,
  isAnswerOpen,
  isSaved, // Được map động từ API trả về ban đầu
  isSaving,
  onToggleAnswer,
  onSaveToggle,
  innerRef,
}) {
  return (
    <article
      ref={innerRef}
      className={cx(
        "scroll-mt-24 rounded-xl border bg-white shadow-sm transition-all duration-300",
        isAnswerOpen
          ? "border-blue-200 ring-4 ring-blue-50/50"
          : "border-gray-200",
      )}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gray-50/50 px-5 py-4 rounded-t-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm shadow-blue-200">
            Câu hỏi {question.displayNumber}
          </span>
          {question.level && (
            <span className="rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
              Mức độ: {question.level}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ReportButton reportType="QUESTION" targetId={question.id} />
          {/* Nút Save / Unsave cải tiến trực quan */}
          <button
            type="button"
            onClick={() => onSaveToggle(question.id)}
            disabled={isSaving}
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              isSaved
                ? "border-amber-200 bg-amber-50 text-amber-600"
                : "border-gray-200 bg-white text-gray-400 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-500",
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
              "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200",
              isAnswerOpen
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : "border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-blue-50",
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
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-2">
            <img
              src={question.contentImageUrl}
              alt={`Hình ảnh câu hỏi ${question.displayNumber}`}
              className="max-h-80 w-full object-contain"
            />
          </div>
        )}

        <MarkdownContent className="text-base font-medium leading-7 text-gray-800">
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
                    ? "border-blue-200 bg-blue-50/60 shadow-sm shadow-blue-100"
                    : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50",
                )}
              >
                <div className="flex gap-3">
                  <span
                    className={cx(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase border shadow-xs transition-colors",
                      showAsCorrect
                        ? "border-blue-400 bg-blue-600 text-white"
                        : "border-gray-200 bg-white text-gray-600",
                    )}
                  >
                    {option.label || option.key}
                  </span>
                  <MarkdownContent className="min-w-0 text-sm font-medium leading-6 text-gray-700">
                    {option.content}
                  </MarkdownContent>
                </div>
              </div>
            );
          })}
        </div>

        {/* Answer Explanation Section */}
        {isAnswerOpen && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/40 p-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-sm font-bold text-blue-800">
              <span className="flex h-2 w-2 rounded-full bg-blue-500" />
              Đáp án chính xác: {question.correctAnswer}
            </div>
            {question.correctOptionText && (
              <MarkdownContent className="mt-2 border-t border-blue-100/60 pt-2 text-sm leading-6 text-blue-900/80">
                {question.correctOptionText}
              </MarkdownContent>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
