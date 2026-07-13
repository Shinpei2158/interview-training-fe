import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Award, AlertTriangle, X } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchQuizAnswers, saveQuizTestProgress } from "@/api/quiz";
import { useToast } from "@/context/ToastContext";
import QuizSidebar from "@/components/QuizSidebar";
import MarkdownContent from "@/components/MarkdownContent";

const OPTION_KEYS = ["A", "B", "C", "D"];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TestQuizPage() {
  const { quizId } = useParams();
  const { state } = useLocation();
  const { toast } = useToast();
  const questionRefs = useRef({});
  const test = state?.test || state?.resume;
  const startedAtRef = useRef(Date.now() - (state?.resume?.elapsedSeconds || 0) * 1000);

  const [selectedAnswers, setSelectedAnswers] = useState(state?.resume?.answers || {});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(state?.resume?.currentQuestionIndex || 0);
  const [answerKey, setAnswerKey] = useState(null);
  const [score, setScore] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const questions = useMemo(
    () =>
      (test?.questions ?? []).map((question, index) => ({
        ...question,
        displayNumber: index + 1,
        options: OPTION_KEYS.map((key) => ({
          key,
          label: key,
          content: question?.[`option${key}`] ?? "",
        })),
      })),
    [test],
  );

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  const scrollToQuestion = (questionId) => {
    const index = questions.findIndex((question) => question.id === questionId);
    if (index >= 0) {
      setCurrentQuestionIndex(index);
    }
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const saveProgress = async (status, finalScore = null) => {
    return saveQuizTestProgress(quizId, {
      status,
      questionIds,
      answers: selectedAnswers,
      score: finalScore,
      currentQuestionIndex,
      elapsedSeconds: Math.max(0, Math.floor((Date.now() - startedAtRef.current) / 1000)),
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProgress("IN_PROGRESS");
      toast.success("Đã tạm lưu tiến độ bài thi!");
    } catch (error) {
      toast.error(error.message || "Không thể lưu tiến độ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    const itemsAnsweredCount = Object.keys(selectedAnswers).length;
    if (itemsAnsweredCount < questions.length && !answerKey) {
      const confirmSubmit = window.confirm(
        `Bạn mới làm ${itemsAnsweredCount}/${questions.length} câu. Vẫn muốn nộp chứ?`,
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    try {
      const answers = await fetchQuizAnswers(quizId, questionIds);
      const answersByQuestionId = new Map(
        answers.map((answer) => [answer.questionId, answer.correctAnswer]),
      );

      const totalCorrect = questions.reduce((total, question) => {
        return (
          total +
          (selectedAnswers[question.id] === answersByQuestionId.get(question.id)
            ? 1
            : 0)
        );
      }, 0);

      setAnswerKey(answersByQuestionId);
      setScore(totalCorrect);
      await saveProgress("FINISHED", totalCorrect);
      setShowScoreModal(true);
      toast.success("Nộp bài thi thành công!");
    } catch (error) {
      toast.error(error.message || "Gặp lỗi khi nộp bài.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!test) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Không tìm thấy dữ liệu đề thi
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Vui lòng khởi tạo đề thi mới từ trang ôn tập.
        </p>
        <Link
          to={`/quizzes/${quizId}/study`}
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
        >
          Quay lại trang học tập
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[340px_minmax(0,1fr)] bg-gray-50/30">
      {/* TẬN DỤNG COMPONENT SIDEBAR CHUNG TẠI ĐÂY */}
      <QuizSidebar
        mode="test"
        questions={questions}
        progressState={selectedAnswers}
        answerKey={answerKey}
        onQuestionClick={scrollToQuestion}
        onSave={handleSave}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
      />

      {/* Danh sách hiển thị câu hỏi bên phải */}
      <main className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Nội dung bài thi
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Lựa chọn đáp án cẩn thận, không thể sửa sau khi đã nộp bài
            </p>
          </div>
          {answerKey && (
            <div className="rounded-xl bg-green-50 px-4 py-2 border border-green-100 text-sm font-bold text-green-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Kết quả: {score}/
              {questions.length} Câu đúng
            </div>
          )}
        </div>

        {questions.map((question, index) => {
          const correctAnswer = answerKey?.get(question.id);
          const selectedAnswer = selectedAnswers[question.id];

          return (
            <article
              key={question.id}
              ref={(node) => {
                questionRefs.current[question.id] = node;
              }}
              className={cx(
                "scroll-mt-24 rounded-xl border bg-white shadow-sm transition-all duration-300",
                selectedAnswer
                  ? "border-blue-200 ring-4 ring-blue-50/30"
                  : "border-gray-200",
              )}
            >
              <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 py-4 rounded-t-xl">
                <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  Câu hỏi {index + 1}
                </span>
                {question.level && (
                  <span className="rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
                    Cấp độ: {question.level}
                  </span>
                )}
              </div>

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

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswer === option.key;
                    const isCorrect = correctAnswer === option.key;
                    const isWrongSelection =
                      answerKey && isSelected && !isCorrect;

                    return (
                      <label
                        key={option.key}
                        className={cx(
                          "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200",
                          answerKey
                            ? isCorrect
                              ? "border-green-300 bg-green-50/60 shadow-xs"
                              : isWrongSelection
                                ? "border-red-300 bg-red-50/60 shadow-xs"
                                : "border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed"
                            : isSelected
                              ? "border-blue-400 bg-blue-50/60"
                              : "border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50",
                        )}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.key}
                          checked={isSelected}
                          disabled={Boolean(answerKey)}
                          onChange={() => {
                            setSelectedAnswers((current) => ({
                              ...current,
                              [question.id]: option.key,
                            }));
                            setCurrentQuestionIndex(index);
                          }}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500/30 disabled:cursor-not-allowed"
                        />
                        <div className="min-w-0 flex-1 -mt-0.5">
                          <span
                            className={cx(
                              "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold border mr-2",
                              answerKey
                                ? isCorrect
                                  ? "bg-green-600 text-white border-green-600"
                                  : isWrongSelection
                                    ? "bg-red-600 text-white border-red-600"
                                    : "bg-white text-gray-400"
                                : isSelected
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-600 border-gray-200",
                            )}
                          >
                            {option.label}
                          </span>
                          <MarkdownContent className="inline text-sm font-medium text-gray-700">
                            {option.content}
                          </MarkdownContent>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {/* Popup Modal điểm số */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-scale-in">
            <div className="flex justify-end -mr-2 -mt-2">
              <button
                type="button"
                onClick={() => setShowScoreModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-inner">
              <Award className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Hoàn thành bài kiểm tra!
            </h2>
            <div className="my-6 rounded-2xl bg-gray-50 py-5 px-4 border border-gray-100">
              <p className="text-4xl font-black text-blue-600 tracking-tight">
                {score}{" "}
                <span className="text-xl font-normal text-gray-400">
                  / {questions.length}
                </span>
              </p>
              <p className="mt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Độ chính xác:{" "}
                {Math.round((score / (questions.length || 1)) * 100)}%
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowScoreModal(false)}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition"
            >
              Xem chi tiết đáp án
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
