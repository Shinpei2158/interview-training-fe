import { useState, useMemo } from "react";
import { Loader2, Save, X, Menu } from "lucide-react";
import { cx } from "@/utils/filter";
import MarkdownContent from "./MarkdownContent";

const OPTION_KEYS = ["A", "B", "C", "D"];

export default function QuizSidebar({
  questions,
  progressState = {},
  onQuestionClick,
  mode = "study",
  answerKey = null,
  onSave,
  onSubmit,
  isSaving = false,
  isSubmitting = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const answeredCount = useMemo(() => {
    return Object.keys(progressState).length;
  }, [progressState]);

  const isTestMode = mode === "test";

  const handleQuestionClick = (questionId) => {
    onQuestionClick(questionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button for Mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#0077b6] hover:bg-[#0096c7] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0077b6]/35 active:scale-95 transition-all cursor-pointer"
      >
        <Menu size={18} />
        <span>
          {isTestMode ? "Tiến độ" : "Câu hỏi"} ({answeredCount}/{questions.length})
        </span>
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cx(
          "fixed top-0 left-0 bottom-0 w-[300px] z-50 bg-slate-50 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col justify-between",
          "lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:w-full lg:static lg:z-auto lg:translate-x-0 lg:shadow-none lg:border-none lg:bg-transparent lg:p-0",
          isOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
        )}
      >
        <div className="lg:rounded-2xl lg:border lg:border-slate-200/80 bg-white p-5 lg:shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] shadow-none flex flex-col h-full overflow-hidden w-full">
          {/* Header trạng thái */}
          <div className="mb-4 pb-4 border-b border-gray-100 shrink-0 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {isTestMode ? "Chế độ kiểm tra thử" : "Chế độ ôn tập"}
              </p>
              <h2 className="mt-1 text-lg font-bold text-gray-900">
                {isTestMode ? "Tiến độ bài làm" : "Danh sách câu hỏi"}
              </h2>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{isTestMode ? "Đã hoàn thành:" : "Đã xem đáp án:"}</span>
                <span className="font-semibold text-blue-600">
                  {answeredCount}/{questions.length} câu
                </span>
              </div>
            </div>
            {/* Close button on mobile */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition -mr-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 shrink-0">
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${(answeredCount / (questions.length || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Danh sách câu hỏi có thể cuộn */}
          <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 mb-4">
            {questions.map((question, index) => {
              const displayIndex = question.displayNumber ?? index + 1;
              const userAnswer = progressState[question.id];
              const isInteracted = Boolean(userAnswer);
              const correctAnswer = answerKey?.get(question.id);
              const isCorrectAfterSubmit =
                answerKey && userAnswer === correctAnswer;

              return (
                <div
                  key={question.id}
                  onClick={() => handleQuestionClick(question.id)}
                  className={cx(
                    "group flex flex-col gap-2 rounded-lg border p-2.5 text-left cursor-pointer transition-all duration-200",
                    isTestMode
                      ? answerKey
                        ? isCorrectAfterSubmit
                          ? "border-blue-200 bg-blue-50/40 text-blue-800"
                          : "border-red-200 bg-red-50/40 text-red-800"
                        : isInteracted
                          ? "border-blue-200 bg-blue-50/30"
                          : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50"
                      : isInteracted
                        ? "border-blue-200 bg-blue-50/40"
                        : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cx(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors",
                        isTestMode
                          ? answerKey
                            ? isCorrectAfterSubmit
                              ? "bg-blue-500 text-white"
                              : "bg-red-500 text-white"
                            : isInteracted
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                          : isInteracted
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700",
                      )}
                    >
                      {displayIndex}
                    </span>
                    <MarkdownContent className="min-w-0 flex-1 truncate text-xs font-medium text-gray-700">
                      {question.content}
                    </MarkdownContent>

                    {isTestMode && isInteracted && !answerKey && (
                      <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                        {userAnswer}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 pl-8">
                    {OPTION_KEYS.map((key) => {
                      const originalOpt = question.options?.find(
                        (o) => o.key === key,
                      );
                      const isCorrect =
                        originalOpt?.isCorrect ||
                        (answerKey && key === correctAnswer);
                      const isUserPick = userAnswer === key;

                      let optionClassName =
                        "bg-gray-50 text-gray-400 border border-gray-100";

                      if (!isTestMode) {
                        if (isInteracted && isCorrect) {
                          optionClassName =
                            "bg-blue-500 text-white scale-105 shadow-xs";
                        }
                      } else {
                        if (answerKey) {
                          if (isCorrect) {
                            optionClassName = "bg-blue-500 text-white";
                          } else if (isUserPick && !isCorrect) {
                            optionClassName = "bg-red-500 text-white";
                          }
                        } else {
                          if (isUserPick) {
                            optionClassName =
                              "bg-blue-600 text-white font-black scale-105";
                          }
                        }
                      }

                      return (
                        <span
                          key={key}
                          className={cx(
                            "flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold uppercase transition-all duration-150",
                            optionClassName,
                          )}
                        >
                          {key}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Khối CTA Nộp bài / Lưu trữ (Chỉ xuất hiện khi là chế độ thi thử) */}
          {isTestMode && (
            <div className="pt-3 border-t border-[#e2e8f0] space-y-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onSave();
                  setIsOpen(false);
                }}
                disabled={isSaving || isSubmitting || Boolean(answerKey)}
                className="flex w-full items-center justify-center rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-xs font-bold text-[#0f172a] shadow-2xs transition hover:bg-[#f0f7ff] hover:text-[#0077b6] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#64748b]" />
                ) : (
                  <Save className="mr-2 h-4 w-4 text-[#0077b6]" />
                )}
                Lưu tiến độ bài làm
              </button>

              <button
                type="button"
                onClick={() => {
                  onSubmit();
                  setIsOpen(false);
                }}
                disabled={isSubmitting || Boolean(answerKey)}
                className="flex w-full items-center justify-center rounded-xl bg-[#ff6b35] hover:bg-[#e85d04] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#ff6b35]/20 transition disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none cursor-pointer"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                )}
                NỘP BÀI KIỂM TRA THỬ
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
