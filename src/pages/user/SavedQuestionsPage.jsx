import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  FolderPlus,
  Lock,
  X,
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Tag,
} from "lucide-react";

import {
  createQuiz,
  fetchMyPrivateQuizzes,
  fetchSavedQuestions,
} from "@/api/quiz";
import { useToast } from "@/context/ToastContext";
import SearchFilterPanel from "@/components/SearchFilterPanel";
import PrivateQuizCard from "@/components/quiz/PrivateQuizCard";
import MarkdownContent from "@/components/MarkdownContent";

// ─── Create Private Quiz Modal ─────────────────────────────────────────────
function CreatePrivateQuizModal({ selectedIds, onSuccess, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      createQuiz({
        title: title.trim(),
        description: description.trim() || undefined,
        status: "PRIVATED",
        questionIds: selectedIds,
      }),
    onSuccess: () => {
      toast.success("Private quiz created successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-private-quizzes"] });
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 5) return;
    mutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Lock size={15} className="text-indigo-600" />
            </div>
            <h2 className="font-bold text-slate-800 text-base">
              Create Private Quiz
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-indigo-700 font-medium">
            {selectedIds.length} question{selectedIds.length !== 1 ? "s" : ""}{" "}
            selected
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">
              Quiz Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React Hooks Review"
              minLength={5}
              maxLength={100}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
            <p className="text-xs text-slate-400">Min 5 characters</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 block">
              Description{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this quiz..."
              maxLength={1000}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                mutation.isPending || !title.trim() || title.trim().length < 5
              }
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Page
export default function SavedQuestionsPage() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPrivateQuizzes, setShowPrivateQuizzes] = useState(true);

  // Search & filter state (applied client-side on the fetched list)
  const [filters, setFilters] = useState({ keyword: "", subCategoryIds: [] });

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["saved-questions"],
    queryFn: fetchSavedQuestions,
  });

  const { data: privateQuizzes = [], isLoading: isLoadingPrivate } = useQuery({
    queryKey: ["my-private-quizzes"],
    queryFn: fetchMyPrivateQuizzes,
  });

  // ── Client-side filtering ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase();
    const subIds = filters.subCategoryIds;

    return questions.filter((q) => {
      // keyword: match question content or quiz title
      const matchesKw =
        !kw ||
        q.content?.toLowerCase().includes(kw) ||
        q.quizTitle?.toLowerCase().includes(kw);

      // subCategory filter: the question's subCategories must include all selected
      const matchesSub =
        subIds.length === 0 ||
        subIds.some((id) => (q.subCategories || []).some((sc) => sc.id === id));

      return matchesKw && matchesSub;
    });
  }, [questions, filters]);

  // Group by quizTitle
  const grouped = useMemo(
    () =>
      filtered.reduce((acc, q) => {
        acc[q.quizTitle] ||= [];
        acc[q.quizTitle].push(q);
        return acc;
      }, {}),
    [filtered],
  );

  const selectedCount = selectedIds.length;

  const toggle = (questionId) => {
    setSelectedIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  const handleSearch = ({ keyword, subCategoryIds }) => {
    setFilters({ keyword, subCategoryIds });
  };

  const handleModalSuccess = () => {
    setShowCreateModal(false);
    setSelectedIds([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Quizzes
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Bookmark size={26} />
          Saved Questions
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Browse your saved questions, filter by skill, and create private
          quizzes to practice.
        </p>
      </div>

      {/* Search & filter panel (reused from QuizPage) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <SearchFilterPanel
          onSearch={handleSearch}
          placeholder="Search by question content or quiz title..."
        />
      </div>

      {/* Selection action bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 bg-indigo-600 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              {selectedCount}
            </div>
            <span className="text-sm font-semibold">
              question{selectedCount !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              Clear
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-white text-indigo-600 hover:bg-indigo-50 transition active:scale-95 shadow-sm"
            >
              <FolderPlus size={14} />
              Create Private Quiz
            </button>
          </div>
        </div>
      )}

      {/* ── Private Quizzes Section ───────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition"
          onClick={() => setShowPrivateQuizzes((prev) => !prev)}
        >
          <div className="flex items-center gap-2.5">
            <Lock size={16} className="text-indigo-500" />
            <span className="font-semibold text-slate-800">
              My Private Quizzes
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              {isLoadingPrivate ? "…" : privateQuizzes.length}
            </span>
          </div>
          {showPrivateQuizzes ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </button>

        {showPrivateQuizzes && (
          <div className="border-t border-slate-100 px-6 py-5">
            {isLoadingPrivate ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
              </div>
            ) : privateQuizzes.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                No private quizzes yet. Select questions below and create one!
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {privateQuizzes.map((quiz) => (
                  <PrivateQuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Saved Question Bank ───────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Bookmark size={16} className="text-slate-500" />
            <span className="font-semibold text-slate-800">
              Saved Question Bank
            </span>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {isLoading ? "…" : filtered.length} / {questions.length}
            </span>
          </div>
          {filters.keyword || filters.subCategoryIds.length > 0 ? (
            <button
              onClick={() => setFilters({ keyword: "", subCategoryIds: [] })}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition"
            >
              <X size={12} /> Clear filters
            </button>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
          </div>
        ) : (
          <div className="px-6 py-5 space-y-6">
            {Object.entries(grouped).map(([quizTitle, items]) => {
              // Collect unique subcategories across all items in this group
              const groupSubs = [
                ...new Map(
                  items
                    .flatMap((q) => q.subCategories || [])
                    .map((sc) => [sc.id, sc]),
                ).values(),
              ];

              return (
                <div key={quizTitle}>
                  {/* Quiz group header */}
                  <div className="flex items-center gap-2 mb-3">
                    <Search
                      size={13}
                      className="text-slate-400 flex-shrink-0"
                    />
                    <h2 className="font-semibold text-slate-800 text-sm">
                      {quizTitle}
                    </h2>
                  </div>

                  {/* Sub-category tags for this group */}
                  {groupSubs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {groupSubs.map((sc) => (
                        <span
                          key={sc.id}
                          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                        >
                          <Tag size={9} />
                          {sc.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Questions */}
                  <div className="space-y-2.5">
                    {items.map((q) => {
                      const isChecked = selectedIds.includes(q.questionId);
                      return (
                        <label
                          key={q.questionId}
                          className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                            isChecked
                              ? "border-indigo-300 bg-indigo-50/60"
                              : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 accent-indigo-600 flex-shrink-0"
                            checked={isChecked}
                            onChange={() => toggle(q.questionId)}
                          />
                          {q.contentImageUrl && (
                            <img
                              src={q.contentImageUrl}
                              alt="Question attachment"
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <MarkdownContent className="font-medium text-slate-800 text-sm leading-snug">
                              {q.content}
                            </MarkdownContent>

                            <p className="mt-1.5 text-xs text-slate-400">
                              Level:{" "}
                              <span className="font-semibold capitalize text-slate-500">
                                {q.level?.toLowerCase()}
                              </span>{" "}
                              · Answer:{" "}
                              <span className="font-semibold text-emerald-600">
                                {q.correctAnswer}
                              </span>
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <Bookmark size={28} className="mx-auto text-slate-200" />
                <p className="text-sm text-slate-400">
                  {questions.length === 0
                    ? "No saved questions yet."
                    : "No questions match your filters."}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Create private quiz modal */}
      {showCreateModal && (
        <CreatePrivateQuizModal
          selectedIds={selectedIds}
          onSuccess={handleModalSuccess}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
