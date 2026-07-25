import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  updateUserActive,
} from "@/api/users";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/common/PageHeader";
import {
  Users,
  ShieldCheck,
  UserX,
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("ALL"); // ALL, BANNED
  const [searchKw, setSearchKw] = useState("");

  // Fetch users list
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchUsers({ size: 1000 }),
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

      {/* ALL / BANNED USERS TABLE */}
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
    </div>
  );
}
