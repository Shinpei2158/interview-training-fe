import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAdminReports, resolveReportAdmin } from "@/api/admin";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/common/PageHeader";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Eye,
  X,
  Send,
  ShieldAlert,
} from "lucide-react";

export default function AdminReportsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchKw, setSearchKw] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: fetchAdminReports,
  });

  const resolveMutation = useMutation({
    mutationFn: ({ reportId, note }) => resolveReportAdmin(reportId, note),
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái giải quyết báo cáo!");
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      setSelectedReport(null);
      setResolutionNote("");
    },
    onError: (err) => toast.error(err.message || "Xử lý thất bại"),
  });

  const filteredReports = useMemo(() => {
    const kw = searchKw.trim().toLowerCase();
    return reports.filter((r) => {
      const matchesKw =
        !kw ||
        r.reason?.toLowerCase().includes(kw) ||
        r.reporterName?.toLowerCase().includes(kw) ||
        r.targetTitle?.toLowerCase().includes(kw);

      if (!matchesKw) return false;
      if (activeTab === "PENDING") return r.status === "PENDING";
      if (activeTab === "RESOLVED") return r.status === "RESOLVED";
      return true;
    });
  }, [reports, searchKw, activeTab]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <PageHeader
        badge="Quản trị viên"
        title="Xử Lý Báo Cáo Sự Cố & Vi Phạm"
        description="Tiếp nhận và giải quyết khiếu nại ca phỏng vấn, báo cáo nội dung câu hỏi hoặc hành vi vi phạm từ người dùng."
      />

      {/* Tabs & Search */}
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
            Tất cả Báo cáo ({reports.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PENDING")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PENDING"
                ? "bg-[#dc2626] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626]"
            }`}
          >
            <Clock size={14} /> Chưa xử lý ({reports.filter((r) => r.status === "PENDING").length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("RESOLVED")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "RESOLVED"
                ? "bg-[#10b981] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#e6f4ea] hover:text-[#10b981]"
            }`}
          >
            <CheckCircle2 size={14} /> Đã giải quyết ({reports.filter((r) => r.status === "RESOLVED").length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-[#64748b]" />
          <input
            type="text"
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
            placeholder="Tìm theo nội dung báo cáo hoặc tên..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e2e8f0] text-xs text-[#0f172a] focus:outline-none focus:border-[#0077b6] transition"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm font-medium text-[#64748b]">
            Đang tải danh sách báo cáo...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center text-sm font-bold text-[#0f172a]">
            Không có báo cáo sự cố nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="px-6 py-4">Mã / Loại Báo Cáo</th>
                  <th className="px-6 py-4">Đối Tượng Bị Báo Cáo</th>
                  <th className="px-6 py-4">Người Báo Cáo</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] text-sm font-medium text-[#0f172a]">
                {filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#f0f7ff]/40 transition">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#0077b6]">
                          {r.id}
                        </span>
                        <p className="text-[11px] font-semibold text-[#64748b]">
                          {r.reportType}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-[#0f172a]">
                      {r.targetTitle || "Hệ thống"}
                    </td>

                    <td className="px-6 py-4 text-xs">
                      <p className="font-bold text-[#0f172a]">{r.reporterName}</p>
                      <p className="text-[#64748b]">{r.reporterEmail}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                          r.status === "RESOLVED"
                            ? "bg-[#e6f4ea] text-[#137333] border-[#c3e6cb]"
                            : "bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReport(r);
                          setResolutionNote(r.resolutionNote || "");
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#0f172a] hover:bg-[#f0f7ff] hover:text-[#0077b6] transition active:scale-95"
                      >
                        <Eye size={15} /> Xử lý ngay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-[#dc2626]" />
                <h3 className="text-lg font-bold text-[#0f172a]">
                  Chi tiết Báo cáo: {selectedReport.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-xs text-[#0f172a]">
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] space-y-2">
                <p>
                  <strong>Người gửi:</strong> {selectedReport.reporterName} ({selectedReport.reporterEmail})
                </p>
                <p>
                  <strong>Đối tượng bị báo cáo:</strong> {selectedReport.targetTitle}
                </p>
                <p className="text-[#64748b]">
                  <strong>Thời gian gửi:</strong> {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="bg-[#fee2e2]/40 p-4 rounded-2xl border border-[#fca5a5]/60 text-xs text-[#dc2626]">
                <strong className="block mb-1">Nội dung lý do báo cáo:</strong>
                <p className="leading-relaxed font-medium">{selectedReport.reason}</p>
              </div>

              {selectedReport.status === "RESOLVED" ? (
                <div className="bg-[#e6f4ea] p-4 rounded-2xl border border-[#c3e6cb] space-y-1 text-[#137333]">
                  <strong>Kết quả xử lý:</strong>
                  <p>{selectedReport.resolutionNote}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block font-bold text-[#0f172a]">
                    Ghi chú kết quả xử lý (Resolution Note):
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Nhập hướng xử lý (ví dụ: Đã nhắc nhở / Khóa tài khoản / Trừ điểm)..."
                    className="w-full p-3 rounded-xl border border-[#e2e8f0] text-xs text-[#0f172a] focus:border-[#0077b6] outline-none"
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl border border-[#e2e8f0] text-xs font-semibold text-[#0f172a]"
              >
                Đóng
              </button>
              {selectedReport.status !== "RESOLVED" && (
                <button
                  type="button"
                  onClick={() =>
                    resolveMutation.mutate({
                      reportId: selectedReport.id,
                      note: resolutionNote,
                    })
                  }
                  disabled={resolveMutation.isPending || !resolutionNote.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition active:scale-95 disabled:opacity-50"
                >
                  <Send size={14} />
                  Xác nhận giải quyết
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
