import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMyQuizzes,
  useCreateQuiz,
  useDeleteQuiz,
} from "@/hooks/quiz/useInterviewerQuiz";
import { useCategoryBrowse } from "@/hooks/useCategoryBrowse";
import { useToast } from "@/context/ToastContext";
import InterviewHeader from "@/components/interview/common/InterviewHeader";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  BookOpen,
  Loader2,
  FileQuestion,
  X,
  FolderOpen,
} from "lucide-react";

function flattenSubcategories(categories = []) {
  return categories.flatMap((category) =>
    (category.subCategories || []).map((subCategory) => ({
      ...subCategory,
      categoryId: category.id,
      categoryName: category.name,
    })),
  );
}

export default function InterviewerQuizListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: quizzes = [], isLoading: isQuizzesLoading } = useMyQuizzes();
  const { data: categories = [] } = useCategoryBrowse();
  const createQuizMutation = useCreateQuiz();
  const deleteQuizMutation = useDeleteQuiz();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubIds, setSelectedSubIds] = useState([]);

  // Flattened list of all subcategories with parent category details
  const allSubcategories = useMemo(
    () => flattenSubcategories(categories),
    [categories],
  );

  // Determine active parent category ID to enforce same-category rule
  const lockedCategoryId = useMemo(() => {
    if (selectedSubIds.length === 0) return null;
    const firstSub = allSubcategories.find(
      (sub) => sub.id === selectedSubIds[0],
    );
    return firstSub ? firstSub.categoryId : null;
  }, [selectedSubIds, allSubcategories]);

  const handleToggleSubcategory = (sub) => {
    const isSelected = selectedSubIds.includes(sub.id);
    if (isSelected) {
      setSelectedSubIds((prev) => prev.filter((id) => id !== sub.id));
    } else {
      if (selectedSubIds.length >= 3) {
        toast.error("You can select at most 3 subcategories");
        return;
      }
      if (lockedCategoryId && sub.categoryId !== lockedCategoryId) {
        toast.error(
          "All selected subcategories must belong to the same category",
        );
        return;
      }
      setSelectedSubIds((prev) => [...prev, sub.id]);
    }
  };

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (selectedSubIds.length === 0) {
      toast.error("Please select at least one subcategory");
      return;
    }

    createQuizMutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        subCategoryIds: selectedSubIds,
      },
      {
        onSuccess: (data) => {
          setIsModalOpen(false);
          setTitle("");
          setDescription("");
          setSelectedSubIds([]);
          // Redirect straight to editor
          navigate(`/interviewer/quiz/${data.id}/edit`);
        },
      },
    );
  };

  const handleDeleteQuiz = (quizId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this quiz? This action cannot be undone.",
      )
    ) {
      deleteQuizMutation.mutate(quizId);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <InterviewHeader
          title="Quiz Management"
          description="Create, edit, and publish custom developer quizzes for candidate assessment."
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow active:scale-95 transition-all self-start sm:self-center"
        >
          <Plus size={16} />
          Create New Quiz
        </button>
      </div>

      {isQuizzesLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <p className="text-sm text-slate-400 font-medium">
            Loading your quizzes...
          </p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl py-16 px-6 text-center shadow-sm space-y-4 max-w-lg mx-auto mt-6">
          <FolderOpen size={48} className="mx-auto text-slate-300" />
          <div>
            <h3 className="text-base font-bold text-slate-800">
              No quizzes created yet
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Quizzes let you evaluate candidates on specific technologies.
              Create your first assessment quiz to get started.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl transition"
          >
            <Plus size={14} />
            Create First Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Status Badge & Question Count */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${getStatusBadgeClass(quiz.status)}`}
                  >
                    {quiz.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <FileQuestion size={12} />
                    {quiz.totalQuestion} questions
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem] leading-relaxed">
                    {quiz.description || "No description provided."}
                  </p>
                </div>

                {/* Subcategory Tags */}
                {quiz.subCategories && quiz.subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {quiz.subCategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-semibold text-slate-500"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-50 mt-6">
                {quiz.status === "PENDING" ? (
                  <button
                    onClick={() =>
                      navigate(`/interviewer/quiz/${quiz.id}/edit`)
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition active:scale-95"
                  >
                    <Eye size={13} />
                    View Details (Pending Review)
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/interviewer/quiz/${quiz.id}/edit`)
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold transition active:scale-95"
                    >
                      <Edit size={13} />
                      Edit Questions
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="px-3.5 py-2 rounded-xl border border-slate-100 hover:border-red-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition active:scale-95"
                      title="Delete Quiz"
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-xl w-full flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="text-indigo-500" size={18} />
                <h3 className="text-base font-bold text-slate-800">
                  Create Assessment Quiz
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleCreateQuiz}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Quiz Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java Concurrency and Multithreading"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what this quiz evaluates..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                />
              </div>

              {/* Subcategories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Select Subcategories <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {selectedSubIds.length}/3 selected
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Choose up to 3 subcategories.{" "}
                  <strong className="text-slate-600 font-semibold">
                    Important:
                  </strong>{" "}
                  All subcategories must belong to the same main technology
                  category.
                </p>

                {/* Subcategory List grouped by parent category */}
                <div className="border border-slate-100 rounded-xl max-h-56 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
                  {categories.map((category) => {
                    const isSelectable =
                      !lockedCategoryId || category.id === lockedCategoryId;
                    return (
                      <div
                        key={category.id}
                        className={`space-y-2 transition-opacity ${!isSelectable ? "opacity-40" : ""}`}
                      >
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                          {category.name}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(category.subCategories || []).map((sub) => {
                            const isSelected = selectedSubIds.includes(sub.id);
                            return (
                              <button
                                type="button"
                                key={sub.id}
                                onClick={() =>
                                  handleToggleSubcategory({
                                    ...sub,
                                    categoryId: category.id,
                                  })
                                }
                                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition active:scale-95 ${
                                  isSelected
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                }`}
                              >
                                {sub.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Modal Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateQuiz}
                disabled={createQuizMutation.isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition active:scale-95 disabled:opacity-50"
              >
                {createQuizMutation.isPending ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Quiz"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
