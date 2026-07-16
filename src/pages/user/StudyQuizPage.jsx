import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchQuizLevelCounts,
  generateQuizTest,
  saveQuestion,
} from "@/api/quiz";
import { useStudyQuiz } from "@/hooks/quiz/useStudyQuiz";
import { useToast } from "@/context/ToastContext";
import { cx } from "../../utils/filter";
import QuestionCard from "@/components/QuestionCard";
import QuizSidebar from "@/components/QuizSidebar";
import { useQueryClient } from "@tanstack/react-query";

export default function StudyQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { questions, isLoading, isError } = useStudyQuiz(quizId);

  const [openAnswers, setOpenAnswers] = useState({});
  const [isTestFormOpen, setIsTestFormOpen] = useState(false);
  const [levelCounts, setLevelCounts] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [isLevelCountsLoading, setIsLevelCountsLoading] = useState(false);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [savingQuestionIds, setSavingQuestionIds] = useState([]);
  const questionRefs = useRef({});

  const selectedLevelTotal = useMemo(
    () =>
      levelCounts
        .filter((item) => selectedLevels.includes(item.level))
        .reduce((total, item) => total + item.totalQuestions, 0),
    [levelCounts, selectedLevels],
  );

  useEffect(() => {
    if (!isTestFormOpen || levelCounts.length > 0) return;

    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLevelCountsLoading(true);

    fetchQuizLevelCounts(quizId)
      .then((counts) => {
        if (!isMounted) return;
        setLevelCounts(counts);
        setSelectedLevels(
          counts
            .filter((item) => item.totalQuestions > 0)
            .map((item) => item.level),
        );
      })
      .catch((error) => {
        toast.error(error.message || "Không thể tải cấu hình bài thi");
      })
      .finally(() => {
        if (isMounted) setIsLevelCountsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isTestFormOpen, levelCounts.length, quizId, toast]);

  const scrollToQuestion = (questionId) => {
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const toggleAnswer = (questionId) => {
    setOpenAnswers((current) => ({
      ...current,
      [questionId]: !current[questionId],
    }));
  };

  const toggleLevel = (level) => {
    setSelectedLevels((current) =>
      current.includes(level)
        ? current.filter((item) => item !== level)
        : [...current, level],
    );
  };

  const handleSaveQuestion = async (questionId) => {
    setSavingQuestionIds((current) => [...current, questionId]);

    try {
      const result = await saveQuestion(questionId);

      queryClient.setQueryData(["quizzes", quizId, "questions"], (old = []) =>
        old.map((question) =>
          question.id === questionId
            ? {
                ...question,
                isSaved: result.active,
              }
            : question,
        ),
      );

      toast.success(
        result.active ? "Đã lưu câu hỏi thành công!" : "Đã bỏ lưu câu hỏi.",
      );
    } catch (error) {
      toast.error(error.message || "Thao tác lưu thất bại");
    } finally {
      setSavingQuestionIds((current) =>
        current.filter((id) => id !== questionId),
      );
    }
  };

  const handleGenerateTest = async (event) => {
    event.preventDefault();

    if (selectedLevels.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một cấp độ");
      return;
    }

    if (questionCount < 5 || questionCount > selectedLevelTotal) {
      toast.warning(
        `Số câu hỏi phải nằm trong khoảng từ 5 đến ${selectedLevelTotal}`,
      );
      return;
    }

    setIsGeneratingTest(true);

    try {
      const test = await generateQuizTest(quizId, {
        questionCount,
        levels: selectedLevels,
      });

      navigate(`/quizzes/${quizId}/test`, { state: { test } });
    } catch (error) {
      toast.error(error.message || "Không thể tạo đề thi");
    } finally {
      setIsGeneratingTest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">
          Đang tải tài liệu học tập...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <X className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Không thể tải bộ câu hỏi này
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Vui lòng làm mới trang hoặc chọn một bộ đề khác.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-0 py-6 lg:grid-cols-[340px_minmax(0,1fr)] bg-emerald-50/30">
      {/* Component Sidebar */}
      <QuizSidebar
        questions={questions}
        progressState={openAnswers}
        onQuestionClick={scrollToQuestion}
        mode="study"
      />

      {/* List Câu hỏi chính */}
      <main className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Study mode</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review calmly before starting a timed simulation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsTestFormOpen(true)}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-100 transition-all hover:bg-emerald-800"
            >
              Start test
            </button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center text-sm font-medium text-gray-400">
            Bộ câu hỏi này hiện tại chưa có dữ liệu.
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isAnswerOpen={Boolean(openAnswers[question.id])}
              isSaved={question.isSaved} // Hook API cần đồng bộ trả về flag này
              isSaving={savingQuestionIds.includes(question.id)}
              onToggleAnswer={toggleAnswer}
              onSaveToggle={handleSaveQuestion}
              innerRef={(node) => {
                questionRefs.current[question.id] = node;
              }}
            />
          ))
        )}
      </main>

      {/* 3. Form Modal tạo Test */}
      {isTestFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs px-4">
          <form
            onSubmit={handleGenerateTest}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-100 animate-scale-in"
          >
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Cấu hình đề thi
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Có{" "}
                  <span className="font-semibold text-blue-600">
                    {selectedLevelTotal}
                  </span>{" "}
                  câu hỏi khả dụng
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTestFormOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                Số lượng câu hỏi
              </label>
              <input
                type="number"
                min="5"
                max={Math.max(5, selectedLevelTotal)}
                value={questionCount}
                onChange={(event) =>
                  setQuestionCount(Number(event.target.value))
                }
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Lọc theo cấp độ câu hỏi
              </label>

              {isLevelCountsLoading ? (
                <div className="flex items-center text-xs text-gray-400 py-2">
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-blue-600" />
                  Đang quét dữ liệu phân loại...
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {levelCounts.map((item) => {
                    const isDisabled = item.totalQuestions === 0;
                    return (
                      <label
                        key={item.level}
                        className={cx(
                          "flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer transition-all",
                          isDisabled
                            ? "border-gray-100 bg-gray-50/50 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(item.level)}
                            disabled={isDisabled}
                            onChange={() => toggleLevel(item.level)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          {item.level}
                        </span>
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                          {item.totalQuestions}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isGeneratingTest || isLevelCountsLoading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isGeneratingTest && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Tạo đề thi ngay
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
