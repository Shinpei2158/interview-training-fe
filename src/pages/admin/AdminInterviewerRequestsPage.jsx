import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPendingInterviewerRequests,
  approveInterviewerRequest,
  rejectInterviewerRequest,
} from "@/api/admin";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/common/PageHeader";
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  X,
  Search,
} from "lucide-react";

export default function AdminInterviewerRequestsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchKw, setSearchKw] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState({});

  // Fetch pending interviewer requests
  const { data: pendingRequests = [], isLoading } = useQuery({
    queryKey: ["admin-pending-interviewers"],
    queryFn: fetchPendingInterviewerRequests,
  });

  const approveRequestMutation = useMutation({
    mutationFn: (userId) => approveInterviewerRequest(userId),
    onSuccess: () => {
      toast.success("Đã phê duyệt tài khoản thành Interviewer!");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-interviewers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedRequest(null);
    },
    onError: (err) => toast.error(err.message || "Phê duyệt thất bại"),
  });

  const rejectRequestMutation = useMutation({
    mutationFn: ({ userId, reason }) => rejectInterviewerRequest(userId, reason),
    onSuccess: () => {
      toast.success("Đã từ chối đơn đăng ký thành công.");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-interviewers"] });
      setSelectedRequest(null);
    },
    onError: (err) => toast.error(err.message || "Thao tác thất bại"),
  });

  // Filter requests by search keyword
  const filteredRequests = pendingRequests.filter((req) => {
    const kw = searchKw.trim().toLowerCase();
    return (
      !kw ||
      req.username?.toLowerCase().includes(kw) ||
      req.email?.toLowerCase().includes(kw) ||
      req.title?.toLowerCase().includes(kw) ||
      req.company?.toLowerCase().includes(kw)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <PageHeader
        badge="Quản trị viên"
        title="Duyệt Hồ Sơ Chuyên Gia (Interviewer)"
        description="Thẩm định thông tin chuyên môn, CV, chứng chỉ và phê duyệt/từ chối yêu cầu nâng quyền của người dùng."
      />

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64748b] bg-slate-100 px-3 py-1.5 rounded-lg">
            Đơn đang chờ duyệt: {pendingRequests.length}
          </span>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-[#64748b]" />
          <input
            type="text"
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
            placeholder="Tìm theo tên, email, công ty..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0f172a] focus:outline-none focus:border-[#0077b6] transition"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center text-sm font-medium text-[#64748b]">
            Đang tải danh sách đơn đăng ký...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center space-y-3">
            <UserCheck size={40} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-[#0f172a]">
              Không có đơn xin duyệt làm Interviewer nào.
            </p>
            <p className="text-xs text-[#64748b]">
              Hệ thống hiện tại sạch bóng các yêu cầu xét duyệt mới.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fff7ed] border border-[#ffedd5] text-[#ff6b35] font-bold flex items-center justify-center text-sm">
                        {req.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#0f172a]">
                          {req.username}
                        </h4>
                        <p className="text-xs text-[#64748b]">{req.email}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fef3c7] text-[#d97706] border border-[#fde68a]">
                      PENDING
                    </span>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] space-y-2 text-xs text-[#0f172a]">
                    <p>
                      <strong className="text-[#0077b6]">Vị trí chuyên môn:</strong>{" "}
                      {req.title}
                    </p>
                    <p>
                      <strong className="text-[#0077b6]">Công ty:</strong> {req.company}
                    </p>
                    <p>
                      <strong className="text-[#0077b6]">Kinh nghiệm:</strong>{" "}
                      {req.yearsExperience || req.experienceYears} năm
                    </p>
                    {req.description && (
                      <p className="text-[#64748b] italic border-t border-slate-100 pt-2 mt-1">
                        "{req.description}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(req)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] hover:bg-[#f0f7ff] hover:text-[#0077b6] transition"
                  >
                    <Eye size={15} /> Xem hồ sơ & bằng cấp
                  </button>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const reason = window.prompt(
                          "Nhập lý do từ chối đơn ứng tuyển của " + req.username + ":",
                          "Hồ sơ chưa đạt đủ tiêu chuẩn kiểm duyệt của DevPrep."
                        );
                        if (reason !== null) {
                          rejectRequestMutation.mutate({
                            userId: req.userId,
                            reason: reason || "Hồ sơ chưa đạt tiêu chuẩn",
                          });
                        }
                      }}
                      disabled={rejectRequestMutation.isPending}
                      className="px-3.5 py-2 rounded-xl bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5] text-xs font-bold hover:bg-red-100 transition active:scale-95 disabled:opacity-50"
                    >
                      Từ chối
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Bạn có chắc chắn muốn phê duyệt ${req.username} lên vai trò Chuyên gia (Interviewer)?`
                          )
                        ) {
                          approveRequestMutation.mutate(req.userId);
                        }
                      }}
                      disabled={approveRequestMutation.isPending}
                      className="px-4 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#059669] transition shadow-2xs active:scale-95 disabled:opacity-50"
                    >
                      Phê duyệt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Inspection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between shrink-0 bg-white">
              <h3 className="text-lg font-bold text-[#0f172a]">
                Chi tiết Hồ sơ & Bằng cấp Chuyên gia
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="space-y-1">
                <p className="text-base font-bold text-[#0f172a]">
                  {selectedRequest.username} ({selectedRequest.email})
                </p>
                <p className="text-xs font-semibold text-[#0077b6]">
                  {selectedRequest.title} - {selectedRequest.company} ({selectedRequest.yearsExperience || selectedRequest.experienceYears} năm kinh nghiệm)
                </p>
              </div>

              {selectedRequest.description && (
                <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] text-xs text-[#0f172a] leading-relaxed">
                  <strong>Giới thiệu bản thân / Đơn ứng tuyển:</strong>
                  <p className="mt-2 text-[#64748b] whitespace-pre-line">{selectedRequest.description}</p>
                </div>
              )}

              {selectedRequest.verificationImageUrl && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                    Ảnh chân dung / Giấy tờ xác minh chân dung:
                  </h4>
                  <div className="rounded-2xl overflow-hidden border border-[#e2e8f0] bg-slate-100 flex justify-center max-h-80">
                    <img
                      src={selectedRequest.verificationImageUrl}
                      alt="Face Verification"
                      className="max-h-80 w-auto object-contain"
                    />
                  </div>
                </div>
              )}

              {selectedRequest.verificationDocuments && selectedRequest.verificationDocuments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                    CV & Bằng cấp đính kèm:
                  </h4>
                  <div className="space-y-2">
                    {selectedRequest.verificationDocuments.map((doc, i) => (
                      <a
                        key={i}
                        href={doc}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl border border-brand-100 bg-brand-50/50 hover:bg-brand-50 flex items-center justify-between text-xs font-semibold text-[#0077b6] transition group"
                      >
                        <span className="flex items-center gap-2">
                          <FileText size={16} /> Tài liệu xác minh #{i + 1}
                        </span>
                        <span className="text-[11px] text-[#64748b] group-hover:underline">Click để xem chi tiết →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  const reason = window.prompt(
                    "Nhập lý do từ chối đơn ứng tuyển:",
                    "Hồ sơ chưa đạt đủ tiêu chuẩn kiểm duyệt của DevPrep."
                  );
                  if (reason !== null) {
                    rejectRequestMutation.mutate({
                      userId: selectedRequest.userId,
                      reason: reason || "Hồ sơ chưa đạt tiêu chuẩn",
                    });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5] text-xs font-bold"
              >
                Từ chối đơn
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Bạn có chắc chắn phê duyệt chuyên gia ${selectedRequest.username}?`
                    )
                  ) {
                    approveRequestMutation.mutate(selectedRequest.userId);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold"
              >
                Phê duyệt ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
