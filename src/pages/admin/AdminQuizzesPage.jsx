import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminQuizzes,
  approveQuizAdmin,
  requestQuizEditAdmin,
} from "@/api/admin";
import { deleteQuiz, fetchQuizQuestions } from "@/api/quiz";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/common/PageHeader";
import {
  GraduationCap,
  FileCheck,
  Edit3,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  Clock,
  X,
  Loader2,
  FileText,
} from "lucide-react";

export default function AdminQuizzesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchKw, setSearchKw] = useState("");
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState(null);
  const [requestNote, setRequestNote] = useState("");
  const [editRequestQuizId, setEditRequestQuizId] = useState(null);

  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["admin-quizzes"],
    queryFn: fetchAdminQuizzes,
  });

  const { data: questions = [], isLoading: loadingQuestions } = useQuery({
    queryKey: ["admin-quiz-questions", selectedQuizForQuestions?.id],
    queryFn: () => fetchQuizQuestions(selectedQuizForQuestions.id),
    enabled: !!selectedQuizForQuestions?.id,
  });

  const approveMutation = useMutation({
    mutationFn: (quizId) => approveQuizAdmin(quizId),
    onSuccess: () => {
      toast.success("Đã phê duyệt bộ câu hỏi công khai!");
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
    },
    onError: (err) => toast.error(err.message || "Phê duyệt thất bại"),
  });

  const deleteMutation = useMutation({
    mutationFn: (quizId) => deleteQuiz(quizId),
    onSuccess: () => {
      toast.success("Đã xóa bộ câu hỏi thành công.");
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
    },
    onError: (err) => toast.error(err.message || "Xóa bộ câu hỏi thất bại"),
  });

  const requestEditMutation = useMutation({
    mutationFn: ({ quizId, note }) => requestQuizEditAdmin(quizId, note),
    onSuccess: () => {
      toast.success("Đã gửi yêu cầu chỉnh sửa cho tác giả.");
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
      setEditRequestQuizId(null);
      setRequestNote("");
    },
    onError: (err) => toast.error(err.message || "Thao tác thất bại"),
  });

  const filteredQuizzes = useMemo(() => {
    const kw = searchKw.trim().toLowerCase();
    return quizzes.filter((q) => {
      const matchesKw =
        !kw ||
        q.title?.toLowerCase().includes(kw) ||
        q.authorName?.toLowerCase().includes(kw) ||
        q.category?.toLowerCase().includes(kw);

      if (!matchesKw) return false;
      if (activeTab === "PENDING") return q.status === "PENDING";
      if (activeTab === "PUBLISHED") return q.status === "PUBLISHED";
      return true;
    });
  }, [quizzes, searchKw, activeTab]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <PageHeader
        badge="Quản trị viên"
        title="Quản Lý & Duyệt Bộ Câu Hỏi Phỏng Vấn"
        description="Kiểm duyệt nội dung các bộ câu hỏi phỏng vấn do Interviewer tạo trước khi công khai lên hệ thống."
      />

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "ALL"
                ? "bg-[#0077b6] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#f0f7ff] hover:text-[#0077b6]"
            }`}
          >
            Tất cả bộ câu hỏi ({quizzes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PENDING")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PENDING"
                ? "bg-[#ff6b35] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#fff7ed] hover:text-[#ff6b35]"
            }`}
          >
            <Clock size={14} /> Chờ duyệt ({quizzes.filter((q) => q.status === "PENDING").length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PUBLISHED")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PUBLISHED"
                ? "bg-[#10b981] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#e6f4ea] hover:text-[#10b981]"
            }`}
          >
            <CheckCircle2 size={14} /> Đã công khai ({quizzes.filter((q) => q.status === "PUBLISHED").length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-[#64748b]" />
          <input
            type="text"
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
            placeholder="Tìm theo tên bộ câu hỏi hoặc tác giả..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0f172a] focus:outline-none focus:border-[#0077b6] transition"
          />
        </div>
      </div>

      {/* Quiz Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm font-medium text-[#64748b]">
            Đang tải danh sách bộ câu hỏi...
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="p-12 text-center text-sm font-bold text-[#0f172a]">
            Không tìm thấy bộ câu hỏi phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="px-6 py-4">Tên Bộ Câu Hỏi</th>
                  <th className="px-6 py-4">Tác Giả (Interviewer)</th>
                  <th className="px-6 py-4">Số Câu Hỏi</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-sm font-medium text-[#0f172a]">
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-[#f0f7ff]/40 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#0f172a] hover:text-[#0077b6] transition cursor-pointer" onClick={() => setSelectedQuizForQuestions(quiz)}>
                          {quiz.title}
                        </p>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-[#0369a1] bg-[#e0f2fe] px-2 py-0.5 rounded-md">
                          {quiz.category || "General"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-[#0f172a]">{quiz.authorName}</p>
                      <p className="text-[#64748b]">{quiz.authorEmail}</p>
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-[#0077b6]">
                      {quiz.totalQuestions || 20} câu
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                          quiz.status === "PUBLISHED"
                            ? "bg-[#e6f4ea] text-[#137333] border-[#c3e6cb]"
                            : quiz.status === "PENDING"
                            ? "bg-[#fef3c7] text-[#d97706] border-[#fde68a]"
                            : "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]"
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedQuizForQuestions(quiz)}
                          className="p-2 rounded-xl border border-[#e2e8f0] text-[#0077b6] hover:bg-[#f0f7ff] transition"
                          title="Xem danh sách câu hỏi"
                        >
                          <Eye size={16} />
                        </button>

                        {quiz.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => approveMutation.mutate(quiz.id)}
                              disabled={approveMutation.isPending}
                              className="px-3 py-1.5 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#059669] transition active:scale-95"
                            >
                              Phê duyệt
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditRequestQuizId(quiz.id)}
                              className="px-3 py-1.5 rounded-xl border border-[#fde68a] bg-[#fef3c7] text-[#d97706] text-xs font-bold hover:bg-amber-100 transition active:scale-95"
                            >
                              Yêu cầu sửa
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Xác nhận xóa bộ câu hỏi này?")) {
                              deleteMutation.mutate(quiz.id);
                            }
                          }}
                          className="p-2 rounded-xl border border-[#fca5a5] text-[#dc2626] bg-[#fee2e2] hover:bg-red-100 transition cursor-pointer"
                          title="Xóa bộ câu hỏi"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Questions Modal */}
      {selectedQuizForQuestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">
                  Chi tiết câu hỏi: {selectedQuizForQuestions.title}
                </h3>
                <p className="text-xs text-[#64748b]">
                  Tác giả: {selectedQuizForQuestions.authorName}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuizForQuestions(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {loadingQuestions ? (
                <div className="py-8 text-center text-xs text-[#64748b] flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-[#0077b6]" size={18} />
                  Đang tải câu hỏi...
                </div>
              ) : questions.length === 0 ? (
                <p className="text-xs text-[#64748b] text-center py-6">
                  Chưa có danh sách câu hỏi chi tiết.
                </p>
              ) : (
                questions.map((q, i) => (
                  <div key={q.id || i} className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] space-y-2 text-xs text-[#0f172a]">
                    <p className="font-bold text-[#0077b6]">Câu {i + 1}: {q.content}</p>
                    <p className="text-[#64748b]">Level: <span className="font-semibold text-[#0f172a]">{q.level}</span> · Đáp án đúng: <span className="font-bold text-[#10b981]">{q.correctAnswer}</span></p>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-end shrink-0 bg-white">
              <button
                onClick={() => setSelectedQuizForQuestions(null)}
                className="px-4 py-2 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] hover:bg-[#f0f7ff]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {editRequestQuizId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#e2e8f0] space-y-4">
            <h3 className="text-base font-bold text-[#0f172a]">Yêu cầu tác giả chỉnh sửa</h3>
            <textarea
              rows={4}
              required
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              placeholder="Nhập ghi chú những phần cần bổ sung/sửa đổi..."
              className="w-full p-3 rounded-xl border border-[#e2e8f0] text-xs text-[#0f172a] focus:border-[#0077b6] outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditRequestQuizId(null)}
                className="px-4 py-2 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0f172a]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() =>
                  requestEditMutation.mutate({
                    quizId: editRequestQuizId,
                    note: requestNote,
                  })
                }
                disabled={requestEditMutation.isPending || !requestNote.trim()}
                className="px-4 py-2 rounded-xl bg-[#ff6b35] text-white text-xs font-bold hover:bg-[#e85d04]"
              >
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
