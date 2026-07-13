import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, FolderPlus } from "lucide-react";

import { createQuiz, fetchSavedQuestions } from "@/api/quiz";
import { useToast } from "@/context/ToastContext";

export default function SavedQuestionsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState([]);
  const [setName, setSetName] = useState("");
  const [keyword, setKeyword] = useState("");

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["saved-questions"],
    queryFn: fetchSavedQuestions,
  });

  const selectedCount = selectedIds.length;

  const grouped = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return questions.filter((question) => {
      if (!normalizedKeyword) return true;
      return [question.quizTitle, question.content]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedKeyword));
    }).reduce((acc, question) => {
      acc[question.quizTitle] ||= [];
      acc[question.quizTitle].push(question);
      return acc;
    }, {});
  }, [questions, keyword]);

  const mutation = useMutation({
    mutationFn: () =>
      createQuiz({
        title: setName,
        status: "PRIVATED",
        questionIds: selectedIds,
      }),
    onSuccess: () => {
      toast.success("Private quiz created");
      setSelectedIds([]);
      setSetName("");
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const toggle = (questionId) => {
    setSelectedIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-blue-600">Quizzes</p>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Bookmark size={24} />
          Saved Questions
        </h1>
      </div>

      <section className="rounded-lg border bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700">
              Search saved questions
            </label>
            <input
              className="mt-2 w-full rounded-lg border px-3 py-2"
              placeholder="Search by quiz or question"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700">
              Private quiz name
            </label>
            <input
              className="mt-2 w-full rounded-lg border px-3 py-2"
              placeholder="React hooks review"
              value={setName}
              onChange={(event) => setSetName(event.target.value)}
            />
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={
              !setName.trim() || selectedCount === 0 || mutation.isPending
            }
            onClick={() => mutation.mutate()}
          >
            <FolderPlus size={18} />
            Create private quiz from {selectedCount}
          </button>
        </div>
      </section>

      <section className="rounded-lg border bg-white">
        <div className="border-b p-4 font-semibold">Saved question bank</div>
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">
            Loading saved questions...
          </p>
        ) : (
          <div className="space-y-5 p-4">
            {Object.entries(grouped).map(
              ([quizTitle, items]) => {
                const groupSubCategories = [
                  ...new Map(
                    items
                      .flatMap((question) => question.subCategories || [])
                      .map((subCategory) => [subCategory.id, subCategory]),
                  ).values(),
                ];

                return (
                <div key={quizTitle}>
                  <h2 className="mb-3 font-semibold text-slate-900">
                    {quizTitle}
                  </h2>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {groupSubCategories.map((subCategory) => (
                      <span
                        key={subCategory.id}
                        className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        {subCategory.name}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {items.map((question) => (
                      <label
                        key={question.questionId}
                        className="flex gap-3 rounded-lg border p-4"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={selectedIds.includes(question.questionId)}
                          onChange={() => toggle(question.questionId)}
                        />
                        <div>
                          <p className="font-medium text-slate-900">
                            {question.content}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(question.subCategories || []).map((subCategory) => (
                              <span
                                key={subCategory.id}
                                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
                              >
                                {subCategory.name}
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-sm text-slate-500">
                            Level {question.level} - Correct answer{" "}
                            {question.correctAnswer}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            },
            )}
            {!questions.length && (
              <p className="text-sm text-slate-500">No saved questions yet.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
