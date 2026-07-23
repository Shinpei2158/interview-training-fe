import { useMemo, useRef, useState, useEffect } from "react";
import { CheckCircle2, Award, AlertTriangle, X, RotateCcw } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  fetchQuizAnswers,
  saveQuizTestProgress,
  retakeProgress,
} from "@/api/quiz";
import { useToast } from "@/context/ToastContext";
import QuizSidebar from "@/components/QuizSidebar";
import MarkdownContent from "@/components/MarkdownContent";
import PageHeader from "@/components/common/PageHeader";

const OPTION_KEYS = ["A", "B", "C", "D"];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TestQuizPage() {
  const { quizId } = useParams();
  const { state } = useLocation();
  const { toast } = useToast();
  const questionRefs = useRef({});

  // Đối tượng test chứa thông tin bài thi hiện tại
  const [testData, setTestData] = useState(state?.test || state?.resume);

  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now() - (testData?.elapsedSeconds || 0) * 1000;
  }, [testData?.elapsedSeconds]);

  const [selectedAnswers, setSelectedAnswers] = useState(
    testData?.answers || {},
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    testData?.currentQuestionIndex || 0,
  );
  const [answerKey, setAnswerKey] = useState(null);
  const [score, setScore] = useState(testData?.score ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Chuyển đổi danh sách câu hỏi thành định dạng hiển thị kèm Option A, B, C, D
  const questions = useMemo(
    () =>
      (testData?.questions ?? []).map((question, index) => ({
        ...question,
        displayNumber: index + 1,
        options: OPTION_KEYS.map((key) => ({
          key,
          label: key,
          content: question?.[`option${key}`] ?? "",
        })),
      })),
    [testData],
  );

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  // Tự động tải đáp án NẾU bài thi này đã hoàn thành từ trước (Chế độ xem lại kết quả)
  useEffect(() => {
    const hasFinishedBefore = testData?.status === "FINISHED";

    if (hasFinishedBefore && quizId && questionIds.length > 0) {
      const loadAnswersForFinishedQuiz = async () => {
        try {
          const answers = await fetchQuizAnswers(quizId, questionIds);
          const answersByQuestionId = new Map(
            answers.map((answer) => [answer.questionId, answer.correctAnswer]),
          );
          setAnswerKey(answersByQuestionId);
        } catch (error) {
          console.error("Lỗi tải đáp án:", error);
          toast.error("Không thể tải đáp án của bài thi cũ.");
        }
      };
      loadAnswersForFinishedQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, questionIds.length, testData?.status]);

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

  const saveProgress = async (
    status,
    finalScore = null,
    answersData = selectedAnswers,
  ) => {
    const currentProgressId = testData?.progressId;

    if (!currentProgressId) {
      console.warn(
        "Không tìm thấy progressId hoặc id hợp lệ trong testData:",
        testData,
      );
      return;
    }

    return saveQuizTestProgress(quizId, {
      progressId: currentProgressId,
      status,
      answers: answersData,
      score: finalScore,
      currentQuestionIndex,
      elapsedSeconds: Math.max(
        0,
        Math.floor((Date.now() - startedAtRef.current) / 1000),
      ),
      questionIds: questionIds,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProgress("IN_PROGRESS");
      toast.success("Đã tạm lưu tiến độ bài kiểm tra!");
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

      // Cập nhật lại trạng thái testData thành FINISHED để đồng bộ UI
      setTestData((prev) => ({ ...prev, status: "FINISHED" }));
      setShowScoreModal(true);
      toast.success("Nộp bài kiểm tra thành công!");
    } catch (error) {
      toast.error(error.message || "Gặp lỗi khi nộp bài.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Làm lại bài kiểm tra (Retake)
  const handleRetake = async () => {
    const confirmRetake = window.confirm(
      "Bạn có chắc chắn muốn làm lại bài kiểm tra này? Toàn bộ kết quả cũ sẽ bị xóa.",
    );
    if (!confirmRetake) return;

    setIsSaving(true);
    try {
      const progressId = testData?.progressId;

      if (progressId) {
        // GỌI API RETAKE CHUYÊN BIỆT TRÊN SERVER
        await retakeProgress(progressId);
      } else {
        // Dự phòng nếu đi từ study qua chưa có progressId (tạo nháp IN_PROGRESS)
        await saveProgress("IN_PROGRESS", null, {});
      }

      // RESET TOÀN BỘ TRẠNG THÁI CLIENT
      setAnswerKey(null); // GIẤU HOÀN TOÀN ĐÁP ÁN (Không gọi lại API tải đáp án)
      setSelectedAnswers({});
      setScore(null);
      setCurrentQuestionIndex(0);
      setShowScoreModal(false);
      startedAtRef.current = Date.now(); // Khởi động lại bộ đếm giờ

      // Cập nhật lại status của bài kiểm tra hiện tại về IN_PROGRESS
      setTestData((prev) => ({
        ...prev,
        status: "IN_PROGRESS",
        answers: {},
        score: null,
        currentQuestionIndex: 0,
        elapsedSeconds: 0,
      }));

      toast.success("Khởi tạo lại bài kiểm tra thành công! Bắt đầu làm bài.");
    } catch (error) {
      toast.error(error?.message || "Không thể khởi tạo lại bài kiểm tra.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!testData) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Không tìm thấy dữ liệu đề kiểm tra
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Vui lòng khởi tạo đề kiểm tra mới từ trang ôn tập.
        </p>
        <Link
          to={`/quizzes/${quizId}/study`}
          state={{ from: state?.from }}
          className="mt-6 inline-flex rounded-xl bg-[#0077b6] hover:bg-[#0096c7] px-5 py-2.5 text-sm font-bold text-white shadow-md transition"
        >
          Quay lại trang ôn tập
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* SIDEBAR ĐIỀU HƯỚNG */}
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

      {/* NỘI DUNG HIỂN THỊ CHI TIẾT CÂU HỎI */}
      <main className="space-y-6">
        <PageHeader
          backUrl={`/quizzes/${quizId}/study`}
          badge="Bài kiểm tra"
          title="Nội Dung Bài Kiểm Tra Thử"
          description={
            answerKey
              ? "Đang ở chế độ xem lại đáp án. Bạn có thể chọn làm lại bài kiểm tra bất cứ lúc nào."
              : "Lựa chọn đáp án cẩn thận, không thể sửa sau khi đã nộp bài."
          }
        >
          {answerKey && (
            <>
              <div className="rounded-xl bg-[#e6f4ea] px-4 py-2 border border-[#c3e6cb] text-sm font-bold text-[#137333] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#137333]" /> Kết quả: {score}/
                {questions.length} Câu đúng
              </div>

              <button
                type="button"
                onClick={handleRetake}
                className="rounded-xl bg-[#f0f7ff] border border-[#bae6fd] px-4 py-2 text-sm font-bold text-[#0077b6] hover:bg-[#e0f2fe] transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" /> Làm lại bài
              </button>
            </>
          )}
        </PageHeader>

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
                "scroll-mt-24 rounded-xl border bg-white shadow-2xs transition-all duration-300",
                selectedAnswer
                  ? "border-[#0077b6] ring-4 ring-[#0077b6]/10"
                  : "border-[#e2e8f0]",
              )}
            >
              <div className="flex flex-wrap items-center gap-2 border-b border-[#e2e8f0] bg-[#f8fafc] px-5 py-4 rounded-t-xl">
                <span className="rounded-lg bg-[#0077b6] px-3 py-1 text-xs font-bold text-white">
                  Câu hỏi {index + 1}
                </span>
                {question.level && (
                  <span className="rounded-lg bg-white border border-[#e2e8f0] px-2.5 py-1 text-xs font-medium text-[#64748b]">
                    Cấp độ: {question.level}
                  </span>
                )}
              </div>

              <div className="p-5">
                {question.contentImageUrl && (
                  <div className="mb-4 overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-2">
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
                              ? "border-[#10b981] bg-[#e6f4ea] shadow-2xs"
                              : isWrongSelection
                                ? "border-[#ef4444] bg-[#fee2e2] shadow-2xs"
                                : "border-[#e2e8f0] bg-[#f8fafc] opacity-60 cursor-not-allowed"
                            : isSelected
                              ? "border-[#0077b6] bg-[#f0f7ff]"
                              : "border-[#e2e8f0] bg-white hover:border-[#bae6fd] hover:bg-[#f0f7ff]/50",
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
                          className="mt-1 h-4 w-4 text-[#0077b6] focus:ring-[#0077b6]/30 disabled:cursor-not-allowed accent-[#0077b6]"
                        />
                        <div className="min-w-0 flex-1 -mt-0.5">
                          <span
                            className={cx(
                              "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold border mr-2",
                              answerKey
                                ? isCorrect
                                  ? "bg-[#10b981] text-white border-[#10b981]"
                                  : isWrongSelection
                                    ? "bg-[#ef4444] text-white border-[#ef4444]"
                                    : "bg-white text-[#94a3b8]"
                                : isSelected
                                  ? "bg-[#0077b6] text-white border-[#0077b6]"
                                  : "bg-white text-[#64748b] border-[#e2e8f0]",
                            )}
                          >
                            {option.label}
                          </span>
                          <MarkdownContent className="inline text-sm font-medium text-[#0f172a]">
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


      {/* POPUP HIỂN THỊ KẾT QUẢ ĐIỂM SỐ */}
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
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowScoreModal(false)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition"
              >
                Xem chi tiết đáp án
              </button>
              <button
                type="button"
                onClick={handleRetake}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" /> Làm lại bài kiểm tra mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
