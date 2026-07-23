import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMyQuizzes,
  useCreateQuiz,
  useDeleteQuiz,
} from "@/hooks/quiz/useInterviewerQuiz";
import { useCategoryBrowse } from "@/hooks/useCategoryBrowse";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/common/PageHeader";
import SubCategoryTag from "@/components/common/SubCategoryTag";
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
        toast.error("Bạn chỉ được chọn tối đa 3 danh mục con");
        return;
      }
      if (lockedCategoryId && sub.categoryId !== lockedCategoryId) {
        toast.error(
          "Tất cả các danh mục con được chọn phải thuộc cùng một danh mục chính",
        );
        return;
      }
      setSelectedSubIds((prev) => [...prev, sub.id]);
    }
  };

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bộ câu hỏi");
      return;
    }
    if (selectedSubIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục con");
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
        "Bạn có chắc chắn muốn xóa bộ câu hỏi này? Thao tác này không thể hoàn tác.",
      )
    ) {
      deleteQuizMutation.mutate(quizId);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
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
      <PageHeader
        badge="Dành cho Interviewer"
        title="Quản Lý Bộ Câu Hỏi"
        description="Tạo mới, chỉnh sửa và quản lý danh sách các bộ câu hỏi phỏng vấn kỹ thuật của bạn."
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b6] hover:bg-[#0096c7] text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          Tạo Bộ Câu Hỏi Mới
        </button>
      </PageHeader>

      {isQuizzesLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-[#0077b6]" size={32} />
          <p className="text-sm text-slate-400 font-medium">
            Đang tải danh sách bộ câu hỏi...
          </p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl py-16 px-6 text-center shadow-xs space-y-4 max-w-lg mx-auto mt-6">
          <FolderOpen size={48} className="mx-auto text-slate-300" />
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Chưa có bộ câu hỏi nào được tạo
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Tạo bộ câu hỏi giúp bạn dễ dàng đánh giá trình độ ứng viên theo từng chủ đề chuyên sâu.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0f7ff] hover:bg-[#e0f2fe] text-[#0077b6] border border-[#bae6fd] text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <Plus size={14} />
            Tạo Bộ Câu Hỏi Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Status Badge & Question Count */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${getStatusBadgeClass(quiz.status)}`}
                  >
                    {quiz.status === "PENDING" ? "Chờ duyệt" : quiz.status === "COMPLETED" ? "Đã duyệt" : quiz.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <FileQuestion size={12} />
                    {quiz.totalQuestion} câu hỏi
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem] leading-relaxed">
                    {quiz.description || "Chưa có mô tả."}
                  </p>
                </div>

                {/* Subcategory Tags */}
                {quiz.subCategories && quiz.subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {quiz.subCategories.map((sub) => (
                      <SubCategoryTag key={sub.id} name={sub.name} size="sm" />
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-6">
                {quiz.status === "PENDING" ? (
                  <button
                    onClick={() =>
                      navigate(`/interviewer/quiz/${quiz.id}/edit`)
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition active:scale-95 cursor-pointer"
                  >
                    <Eye size={13} />
                    Xem chi tiết (Đang chờ duyệt)
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/interviewer/quiz/${quiz.id}/edit`)
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#f0f7ff] border border-[#bae6fd] hover:bg-[#e0f2fe] text-[#0077b6] text-xs font-bold transition active:scale-95 cursor-pointer"
                    >
                      <Edit size={13} />
                      Chỉnh sửa câu hỏi
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-500 transition active:scale-95 cursor-pointer"
                      title="Xóa bộ câu hỏi"
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
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl max-w-xl w-full flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="text-[#0077b6]" size={18} />
                <h3 className="text-base font-bold text-slate-800">
                  Tạo Bộ Câu Hỏi Mới
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleCreateQuiz}
              className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar"
            >
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Tên Bộ Câu Hỏi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lập trình bất đồng bộ & Đa luồng trong Java"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Mô Tả
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả ngắn gọn nội dung và mục tiêu đánh giá..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition resize-none"
                />
              </div>

              {/* Subcategories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Chọn Danh Mục Con <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Đã chọn {selectedSubIds.length}/3
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Chọn tối đa 3 danh mục con.{" "}
                  <strong className="text-slate-600 font-semibold">
                    Lưu ý:
                  </strong>{" "}
                  Tất cả danh mục con phải thuộc cùng một danh mục công nghệ chính.
                </p>

                {/* Subcategory List grouped by parent category */}
                <div className="border border-slate-100 rounded-xl max-h-56 overflow-y-auto p-4 bg-slate-50/50 space-y-4 custom-scrollbar">
                  {categories.map((category) => {
                    const isSelectable =
                      !lockedCategoryId || category.id === lockedCategoryId;
                    return (
                      <div
                        key={category.id}
                        className={`space-y-2 transition-opacity ${!isSelectable ? "opacity-40" : ""}`}
                      >
                        <span className="text-[10px] font-bold text-[#0077b6] uppercase tracking-wider block">
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
                                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition active:scale-95 cursor-pointer ${
                                  isSelected
                                    ? "bg-[#0077b6] text-white border-[#0077b6] shadow-xs"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-[#f0f7ff] hover:text-[#0077b6]"
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
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateQuiz}
                disabled={createQuizMutation.isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#0077b6] hover:bg-[#0096c7] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {createQuizMutation.isPending ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo Bộ Câu Hỏi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
