import { useMemo } from "react";
import { Loader2, Save } from "lucide-react";
import { cx } from "@/utils/filter";
import MarkdownContent from "./MarkdownContent";

const OPTION_KEYS = ["A", "B", "C", "D"];

export default function QuizSidebar({
  questions,
  // Chế độ học tập dùng openAnswers, thi thử dùng selectedAnswers (đồng bộ qua prop này)
  progressState = {},
  onQuestionClick,
  mode = "study",
  answerKey = null,
  onSave,
  onSubmit,
  isSaving = false,
  isSubmitting = false,
}) {
  // Tính số lượng câu hỏi đã tương tác (đã làm hoặc đã mở xem đáp án)
  const answeredCount = useMemo(() => {
    return Object.keys(progressState).length;
  }, [progressState]);

  const isTestMode = mode === "test";

  return (
    <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] w-full flex flex-col justify-between">
      <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm ring-1 ring-blue-50/50 flex flex-col h-full overflow-hidden">
        {/* Header trạng thái */}
        <div className="mb-4 pb-4 border-b border-gray-100 shrink-0">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {isTestMode ? "Chế độ thi thử" : "Chế độ học tập"}
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
          {/* Thanh Progress chung */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
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

            // Logic kiểm tra trạng thái từng chế độ
            const userAnswer = progressState[question.id];
            const isInteracted = Boolean(userAnswer);
            const correctAnswer = answerKey?.get(question.id);

            const isCorrectAfterSubmit =
              answerKey && userAnswer === correctAnswer;

            return (
              <div
                key={question.id}
                onClick={() => onQuestionClick(question.id)}
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

                  {/* Hiện badge đáp án gọn ở cuối dòng nếu ở chế độ Test chưa nộp bài */}
                  {isTestMode && isInteracted && !answerKey && (
                    <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                      {userAnswer}
                    </span>
                  )}
                </div>

                {/* LUÔN HIỆN 4 CỘT ĐÁP ÁN A, B, C, D */}
                <div className="flex gap-1 pl-8">
                  {OPTION_KEYS.map((key) => {
                    // 1. Tìm thông tin option gốc (nếu có map sẵn từ API)
                    const originalOpt = question.options?.find(
                      (o) => o.key === key,
                    );

                    // 2. Xác định xem đây có phải đáp án đúng không
                    const isCorrect =
                      originalOpt?.isCorrect ||
                      (answerKey && key === correctAnswer);
                    const isUserPick = userAnswer === key;

                    // 3. Tính toán class màu sắc động theo trạng thái đề bài
                    let optionClassName =
                      "bg-gray-50 text-gray-400 border border-gray-100";

                    if (!isTestMode) {
                      // Chế độ Học tập: Khi nhấn Xem đáp án mới tô ô Đúng
                      if (isInteracted && isCorrect) {
                        optionClassName =
                          "bg-blue-500 text-white scale-105 shadow-xs";
                      }
                    } else {
                      // Chế độ Thi thử
                      if (answerKey) {
                        // Trường hợp: ĐÃ NỘP BÀI
                        if (isCorrect) {
                          optionClassName = "bg-blue-500 text-white";
                        } else if (isUserPick && !isCorrect) {
                          optionClassName = "bg-red-500 text-white";
                        }
                      } else {
                        // Trường hợp: ĐANG LÀM BÀI (Chưa nộp)
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
          <div className="pt-3 border-t border-gray-100 space-y-2 shrink-0">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || isSubmitting || Boolean(answerKey)}
              className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-500" />
              ) : (
                <Save className="mr-2 h-4 w-4 text-gray-500" />
              )}
              Lưu tiến độ băm đề
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting || Boolean(answerKey)}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              NỘP BÀI THI THỬ
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
