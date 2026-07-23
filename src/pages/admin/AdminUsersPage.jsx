import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  updateUserActive,
  updateUserRole,
} from "@/api/users";
import {
  fetchPendingInterviewerRequests,
  approveInterviewerRequest,
  rejectInterviewerRequest,
} from "@/api/admin";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/common/PageHeader";
import {
  Users,
  ShieldCheck,
  UserX,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  X,
  Loader2,
} from "lucide-react";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("ALL"); // ALL, PENDING_INTERVIEWER, BANNED
  const [searchKw, setSearchKw] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch users list
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchUsers({ size: 1000 }),
  });

  // Fetch pending interviewer requests
  const { data: pendingRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["admin-pending-interviewers"],
    queryFn: fetchPendingInterviewerRequests,
  });

  // Mutations
  const activeMutation = useMutation({
    mutationFn: ({ userId, isActive }) => updateUserActive(userId, isActive),
    onSuccess: (_, variables) => {
      toast.success(variables.isActive ? "Đã mở khóa tài khoản!" : "Đã khóa tài khoản thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => toast.error(err.message || "Thao tác thất bại"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: () => {
      toast.success("Đã cập nhật vai trò người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => toast.error(err.message || "Không thể cập nhật role"),
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
      toast.success("Đã từ chối đơn đăng ký.");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-interviewers"] });
      setSelectedRequest(null);
    },
    onError: (err) => toast.error(err.message || "Thao tác thất bại"),
  });

  const rawUsers = Array.isArray(usersData?.data?.content)
    ? usersData.data.content
    : Array.isArray(usersData?.content)
    ? usersData.content
    : Array.isArray(usersData)
    ? usersData
    : [];

  // Filter users
  const filteredUsers = useMemo(() => {
    const kw = searchKw.trim().toLowerCase();
    return rawUsers.filter((u) => {
      const matchesKw =
        !kw ||
        u.username?.toLowerCase().includes(kw) ||
        u.email?.toLowerCase().includes(kw);

      if (!matchesKw) return false;

      if (activeTab === "BANNED") return u.active === false;
      return true;
    });
  }, [rawUsers, searchKw, activeTab]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <PageHeader
        badge="Quản trị viên"
        title="Quản Lý Người Dùng & Duyệt Interviewer"
        description="Phê duyệt đơn đăng ký nâng quyền Interviewer, mở/khóa tài khoản và quản lý phân quyền hệ thống."
      />

      {/* Tabs & Search Bar */}
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
            Tất cả người dùng ({rawUsers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PENDING_INTERVIEWER")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PENDING_INTERVIEWER"
                ? "bg-[#ff6b35] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#fff7ed] hover:text-[#ff6b35]"
            }`}
          >
            <ShieldCheck size={14} />
            Đơn xin làm Interviewer ({pendingRequests.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("BANNED")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "BANNED"
                ? "bg-[#dc2626] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626]"
            }`}
          >
            <UserX size={14} />
            Tài khoản bị khóa ({rawUsers.filter((u) => u.active === false).length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-[#64748b]" />
          <input
            type="text"
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0f172a] focus:outline-none focus:border-[#0077b6] transition"
          />
        </div>
      </div>

      {/* PENDING INTERVIEWER REQUESTS SECTION */}
      {activeTab === "PENDING_INTERVIEWER" ? (
        <div className="space-y-4">
          {loadingRequests ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center text-sm font-medium text-[#64748b]">
              Đang tải danh sách đơn đăng ký...
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center space-y-2">
              <UserCheck size={32} className="mx-auto text-[#64748b]" />
              <p className="text-sm font-bold text-[#0f172a]">
                Hiện tại không có đơn xin nâng quyền Interviewer nào chờ duyệt.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pendingRequests.map((req) => (
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

                    <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] space-y-1.5 text-xs text-[#0f172a]">
                      <p>
                        <strong className="text-[#0077b6]">Chức danh / Kinh nghiệm:</strong>{" "}
                        {req.title} ({req.experienceYears} năm)
                      </p>
                      <p className="text-[#64748b] italic">"{req.bio}"</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] hover:bg-[#f0f7ff] hover:text-[#0077b6] transition"
                    >
                      <Eye size={15} /> Xem hồ sơ & bằng cấp
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          rejectRequestMutation.mutate({
                            userId: req.userId,
                            reason: "Hồ sơ chưa đạt tiêu chuẩn",
                          })
                        }
                        disabled={rejectRequestMutation.isPending}
                        className="px-3.5 py-2 rounded-xl bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5] text-xs font-bold hover:bg-red-100 transition active:scale-95"
                      >
                        Từ chối
                      </button>
                      <button
                        type="button"
                        onClick={() => approveRequestMutation.mutate(req.userId)}
                        disabled={approveRequestMutation.isPending}
                        className="px-4 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#059669] transition shadow-2xs active:scale-95"
                      >
                        Chấp nhận
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ALL / BANNED USERS TABLE */
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
          {loadingUsers ? (
            <div className="p-12 text-center text-sm font-medium text-[#64748b]">
              Đang tải danh sách người dùng...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="px-6 py-4">Người dùng</th>
                    <th className="px-6 py-4">Role Hiện Tại</th>
                    <th className="px-6 py-4">Trạng Thái</th>
                    <th className="px-6 py-4 text-right">Hành Động Quản Trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-sm font-medium text-[#0f172a]">
                  {filteredUsers.map((u) => {
                    const isBanned = u.active === false;
                    return (
                      <tr key={u.id} className="hover:bg-[#f0f7ff]/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                u.avatarUrl ||
                                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                              }
                              alt="Avatar"
                              className="w-9 h-9 rounded-full object-cover border border-[#e2e8f0]"
                            />
                            <div>
                              <p className="font-bold text-[#0f172a]">
                                {u.username || "User"}
                              </p>
                              <p className="text-xs text-[#64748b]">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              u.role === "ADMIN"
                                ? "bg-[#e6f4ea] text-[#137333] border-[#c3e6cb]"
                                : u.role === "INTERVIEWER"
                                ? "bg-[#fff7ed] text-[#ff6b35] border-[#ffedd5]"
                                : "bg-[#f0f7ff] text-[#0077b6] border-[#bae6fd]"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              isBanned
                                ? "bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]"
                                : "bg-[#e6f4ea] text-[#137333] border-[#c3e6cb]"
                            }`}
                          >
                            {isBanned ? (
                              <>
                                <XCircle size={13} /> Khóa (Banned)
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={13} /> Hoạt động
                              </>
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role Switcher */}
                            {u.role !== "ADMIN" && (
                              <button
                                type="button"
                                onClick={() =>
                                  roleMutation.mutate({
                                    userId: u.id,
                                    role: u.role === "INTERVIEWER" ? "USER" : "INTERVIEWER",
                                  })
                                }
                                className="px-3 py-1.5 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0077b6] hover:bg-[#f0f7ff] transition"
                              >
                                {u.role === "INTERVIEWER" ? "Hạ về USER" : "Up INTERVIEWER"}
                              </button>
                            )}

                            {/* Ban / Unban Button */}
                            <button
                              type="button"
                              onClick={() =>
                                activeMutation.mutate({
                                  userId: u.id,
                                  isActive: isBanned,
                                })
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                                isBanned
                                  ? "bg-[#10b981] text-white hover:bg-[#059669]"
                                  : "bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5] hover:bg-red-100"
                              }`}
                            >
                              {isBanned ? "Mở khóa" : "Khóa tài khoản"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Verification Inspection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between shrink-0 bg-white">
              <h3 className="text-lg font-bold text-[#0f172a]">
                Chi tiết Hồ sơ & Bằng cấp Interviewer
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="space-y-1">
                <p className="text-base font-bold text-[#0f172a]">
                  {selectedRequest.username} ({selectedRequest.email})
                </p>
                <p className="text-xs font-semibold text-[#0077b6]">
                  {selectedRequest.title} - {selectedRequest.experienceYears} năm kinh nghiệm
                </p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] text-xs text-[#0f172a] leading-relaxed">
                <strong>Giới thiệu bản thân:</strong>
                <p className="mt-1 text-[#64748b]">{selectedRequest.bio}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                  Ảnh xác thực khuôn mặt / Chân dung:
                </h4>
                <div className="flex gap-3 overflow-x-auto">
                  {selectedRequest.verificationImages?.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt="Verification"
                      className="w-36 h-36 rounded-2xl object-cover border border-[#e2e8f0]"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                  Chứng chỉ & Tài liệu đính kèm:
                </h4>
                <div className="space-y-2">
                  {selectedRequest.documents?.map((doc, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-[#e2e8f0] bg-white flex items-center justify-between text-xs font-semibold text-[#0077b6]"
                    >
                      <span className="flex items-center gap-2">
                        <FileText size={16} /> {doc}
                      </span>
                      <span className="text-[11px] text-[#64748b]">Tài liệu hợp lệ</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                type="button"
                onClick={() =>
                  rejectRequestMutation.mutate({
                    userId: selectedRequest.userId,
                    reason: "Hồ sơ chưa đầy đủ",
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5] text-xs font-bold"
              >
                Từ chối đơn
              </button>
              <button
                type="button"
                onClick={() => approveRequestMutation.mutate(selectedRequest.userId)}
                className="px-5 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold"
              >
                Phê duyệt lên Interviewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
