import { useState, useMemo } from "react";
import {
  useMyInterviewBookings,
  useAcceptInterviewBooking,
  useRejectInterviewBooking,
} from "@/hooks/interview/useInterviewApi";
import InterviewHeader from "@/components/interview/common/InterviewHeader";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  CalendarClock,
  Clock,
  MessageSquare,
  Check,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { formatDateTime } from "@/components/interview/common/interviewUtils";
import RequestDetailModal from "@/components/bookings/RequestDetailModal";

const TABS = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING", label: "Đang chờ duyệt" },
  { id: "ACCEPTED", label: "Đã chấp nhận" },
  { id: "COMPLETED", label: "Đã hoàn thành" },
  { id: "CANCELLED_REJECTED", label: "Đã huỷ / Từ chối" },
];

const ITEMS_PER_PAGE = 6;

export default function InterviewerRequestsPage() {
  const { data: user } = useAuth();
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data, isLoading } = useMyInterviewBookings();
  const acceptMutation = useAcceptInterviewBooking();
  const rejectMutation = useRejectInterviewBooking();

  // Filter requests for interviewer
  const allMyRequests = useMemo(() => {
    return (data?.content || []).filter(
      (b) => b.interviewerId === user?.id
    );
  }, [data, user?.id]);

  const filteredRequests = useMemo(() => {
    return allMyRequests.filter((booking) => {
      if (activeTab === "ALL") return true;
      if (activeTab === "PENDING") return booking.status === "PENDING";
      if (activeTab === "ACCEPTED") return booking.status === "ACCEPTED";
      if (activeTab === "COMPLETED") return booking.status === "COMPLETED";
      if (activeTab === "CANCELLED_REJECTED")
        return ["REJECTED", "CANCELLED"].includes(booking.status);
      return true;
    });
  }, [allMyRequests, activeTab]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE));
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "ACCEPTED":
        return "bg-[#f0f7ff] text-[#0077b6] border-[#bae6fd]";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <InterviewHeader
        title="Danh Sách Yêu Cầu Phỏng Vấn"
        description="Quản lý toàn bộ yêu cầu phỏng vấn từ ứng viên: Đang chờ duyệt, Đã duyệt, Đã hoàn thành hoặc Từ chối."
      />

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {TABS.map((tab) => {
            const count = allMyRequests.filter((b) => {
              if (tab.id === "ALL") return true;
              if (tab.id === "PENDING") return b.status === "PENDING";
              if (tab.id === "ACCEPTED") return b.status === "ACCEPTED";
              if (tab.id === "COMPLETED") return b.status === "COMPLETED";
              if (tab.id === "CANCELLED_REJECTED")
                return ["REJECTED", "CANCELLED"].includes(b.status);
              return true;
            }).length;

            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Requests Card Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-sm text-slate-500 shadow-sm">
          Đang tải danh sách yêu cầu phỏng vấn...
        </div>
      ) : paginatedRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 mx-auto flex items-center justify-center">
            <Filter size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Không có yêu cầu phỏng vấn nào phù hợp trong mục này.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedRequests.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between group relative"
            >
              <div className="space-y-4">
                {/* Header card info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {booking.candidateName}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        {booking.profileTitle}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Time & Duration */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-medium">
                    <CalendarClock size={15} className="text-indigo-600 flex-shrink-0" />
                    <span>{formatDateTime(booking.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={15} className="text-indigo-600 flex-shrink-0" />
                    <span>Thời lượng: {booking.durationMinutes} phút</span>
                  </div>
                </div>

                {/* Subcategories */}
                {booking.subcategories && booking.subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {booking.subcategories.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-lg bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message snippet */}
                {booking.message && (
                  <p className="text-xs text-slate-500 italic line-clamp-2 flex items-start gap-1.5 bg-slate-50/50 p-2 rounded-lg">
                    <MessageSquare size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>"{booking.message}"</span>
                  </p>
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-600 group-hover:underline">
                  Xem chi tiết &rarr;
                </span>

                {booking.status === "PENDING" && (
                  <div
                    className="flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => acceptMutation.mutate(booking.id)}
                      disabled={acceptMutation.isPending}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      title="Chấp nhận"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectMutation.mutate(booking.id)}
                      disabled={rejectMutation.isPending}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                      title="Từ chối"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-bold text-slate-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedBooking && (
        <RequestDetailModal
          booking={selectedBooking}
          user={user}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
