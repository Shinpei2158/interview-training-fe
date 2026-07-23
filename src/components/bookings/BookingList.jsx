import { useEffect, useState } from "react";
import {
  CalendarClock,
  Check,
  Clock,
  MessageSquare,
  X,
  Video,
  AlertTriangle,
  MessageSquareHeart,
  Coins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useAcceptInterviewBooking,
  useCompleteInterviewBooking,
  useMyInterviewBookings,
  useRejectInterviewBooking,
} from "@/hooks/interview/useInterviewApi";
import { formatDateTime } from "@/components/interview/common/interviewUtils";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ReportIssueModal from "./ReportIssueModal";
import SubCategoryTag from "@/components/common/SubCategoryTag";

function isInterviewReady(booking, now = new Date()) {
  if (!booking?.scheduledAt) return false;
  const startsAt = new Date(booking.scheduledAt);
  const endsAt = new Date(
    startsAt.getTime() + (booking.durationMinutes || 60) * 60000,
  );
  return now >= startsAt && now <= endsAt;
}

const getStatusBadge = (status) => {
  switch (status) {
    case "ACCEPTED":
      return {
        label: "Đã chấp nhận",
        className: "bg-[#e6f4ea] text-[#137333] border-[#c3e6cb]",
      };
    case "COMPLETED":
      return {
        label: "Đã hoàn thành",
        className: "bg-[#f0f7ff] text-[#0077b6] border-[#bae6fd]",
      };
    case "PENDING":
      return {
        label: "Đang chờ duyệt",
        className: "bg-[#fef3c7] text-[#d97706] border-[#fde68a]",
      };
    case "REJECTED":
    case "CANCELLED":
      return {
        label: "Từ chối / Hủy",
        className: "bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]",
      };
    default:
      return {
        label: status,
        className: "bg-slate-50 text-slate-700 border-slate-200",
      };
  }
};

export default function BookingList({ user, mode }) {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reportBookingId, setReportBookingId] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const { data, isLoading } = useMyInterviewBookings();
  const acceptMutation = useAcceptInterviewBooking();
  const rejectMutation = useRejectInterviewBooking();
  const completeMutation = useCompleteInterviewBooking();

  const bookings = (data?.content || []).filter((booking) => {
    if (mode === "requests")
      return booking.status === "PENDING" && booking.interviewerId === user?.id;
    if (mode === "schedule")
      return ["ACCEPTED", "COMPLETED"].includes(booking.status);
    return true;
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center text-sm font-medium text-[#64748b] shadow-2xs">
          Đang tải danh sách lịch phỏng vấn...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-[#f0f7ff] text-[#0077b6] mx-auto flex items-center justify-center">
            <CalendarClock size={24} />
          </div>
          <p className="text-base font-bold text-[#0f172a]">
            Chưa có lịch phỏng vấn nào
          </p>
          <p className="text-xs text-[#64748b] max-w-sm mx-auto">
            Các cuộc phỏng vấn đã được chấp nhận sẽ hiển thị ở đây. Đúng giờ phỏng vấn bạn có thể tham gia vào phòng phỏng vấn trực tuyến.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isInterviewer = booking.interviewerId === user?.id;
            const canEnter =
              booking.status === "ACCEPTED" && isInterviewReady(booking, now);
            const statusBadge = getStatusBadge(booking.status);

            return (
              <article
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="group rounded-2xl border border-[#e2e8f0] p-6 bg-white shadow-2xs hover:shadow-md hover:border-[#bae6fd] hover:bg-[#f0f7ff]/30 transition-all duration-300 cursor-pointer space-y-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-bold text-[#0f172a] text-lg group-hover:text-[#0077b6] transition-colors">
                        {booking.profileTitle}
                      </h4>
                      <span
                        className={`rounded-full border px-3 py-0.5 text-xs font-bold ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-[#64748b]">
                      Ứng viên:{" "}
                      <span className="text-[#0f172a] font-bold">
                        {booking.candidateName}
                      </span>{" "}
                      · Người phỏng vấn:{" "}
                      <span className="text-[#0077b6] font-bold">
                        {booking.interviewerName}
                      </span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#0f172a] pt-1">
                      <span className="inline-flex items-center gap-1.5 bg-[#f8fafc] px-3 py-1.5 rounded-xl border border-[#e2e8f0]">
                        <CalendarClock size={15} className="text-[#0077b6]" />
                        {formatDateTime(booking.scheduledAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-[#f8fafc] px-3 py-1.5 rounded-xl border border-[#e2e8f0]">
                        <Clock size={15} className="text-[#0077b6]" />
                        {booking.durationMinutes} phút
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-[#fff7ed] px-3 py-1.5 rounded-xl border border-[#ffedd5] text-[#ff6b35] font-bold">
                        <Coins size={15} />
                        {booking.points || 10} pts
                      </span>
                    </div>

                    {booking.subcategories && booking.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {booking.subcategories.map((item) => (
                          <SubCategoryTag key={item.id} name={item.name} size="sm" />
                        ))}
                      </div>
                    )}

                    {booking.message && (
                      <p className="inline-flex gap-2 text-xs italic text-[#64748b] bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] w-full mt-1">
                        <MessageSquare
                          size={15}
                          className="text-[#0077b6] shrink-0 mt-0.5"
                        />
                        <span>"{booking.message}"</span>
                      </p>
                    )}

                    {booking.status === "ACCEPTED" && !canEnter && (
                      <p className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1.5 mt-1">
                        <Clock size={14} />
                        Phòng phỏng vấn chưa đến giờ mở (Mở đúng lúc{" "}
                        {formatDateTime(booking.scheduledAt)}).
                      </p>
                    )}
                  </div>

                  <div
                    className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {canEnter && (
                      <button
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ff6b35] hover:bg-[#e85d04] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#ff6b35]/20 animate-pulse transition active:scale-95"
                        onClick={() =>
                          navigate(`/interview/room/${booking.id}`)
                        }
                      >
                        <Video size={16} />
                        Vào phòng phỏng vấn
                      </button>
                    )}

                    <button
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#fca5a5] bg-[#fee2e2] px-3.5 py-2 text-xs font-semibold text-[#dc2626] hover:bg-red-100 transition active:scale-95"
                      onClick={() => setReportBookingId(booking.id)}
                    >
                      <AlertTriangle size={14} />
                      Báo sự cố
                    </button>

                    {isInterviewer && booking.status === "PENDING" && (
                      <>
                        <button
                          className="inline-flex items-center gap-1 rounded-xl bg-[#10b981] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#059669] transition shadow-2xs active:scale-95"
                          onClick={() => acceptMutation.mutate(booking.id)}
                        >
                          <Check size={15} />
                          Chấp nhận
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-xl bg-[#ef4444] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#dc2626] transition shadow-2xs active:scale-95"
                          onClick={() => rejectMutation.mutate(booking.id)}
                        >
                          <X size={15} />
                          Từ chối
                        </button>
                      </>
                    )}

                    {booking.status === "ACCEPTED" && isInterviewer && (
                      <button
                        className="rounded-xl border border-[#e2e8f0] px-3.5 py-2 text-xs font-semibold text-[#0f172a] bg-white hover:bg-[#f0f7ff] hover:text-[#0077b6] transition active:scale-95"
                        onClick={() => completeMutation.mutate(booking.id)}
                      >
                        Hoàn thành
                      </button>
                    )}

                    {booking.status === "COMPLETED" && (
                      <button
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#bae6fd] bg-[#f0f7ff] px-3.5 py-2 text-xs font-bold text-[#0077b6] hover:bg-[#e0f2fe] transition active:scale-95"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <MessageSquareHeart size={15} />
                        Xem / Gửi Feedback
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <ScheduleDetailModal
          booking={selectedBooking}
          user={user}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {reportBookingId && (
        <ReportIssueModal
          bookingId={reportBookingId}
          onClose={() => setReportBookingId(null)}
        />
      )}
    </div>
  );
}

