import {
  X,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Check,
  Ban,
  Video,
  Award,
  AlertCircle,
} from "lucide-react";
import {
  useAcceptInterviewBooking,
  useRejectInterviewBooking,
} from "@/hooks/interview/useInterviewApi";
import { formatDateTime } from "@/components/interview/common/interviewUtils";
import { useNavigate } from "react-router-dom";
import SubCategoryTag from "@/components/common/SubCategoryTag";

function isInterviewReady(booking, now = new Date()) {
  if (!booking?.scheduledAt) return false;
  const startsAt = new Date(booking.scheduledAt);
  const endsAt = new Date(
    startsAt.getTime() + (booking.durationMinutes || 60) * 60000,
  );
  return now >= startsAt && now <= endsAt;
}

export default function RequestDetailModal({ booking, user, onClose }) {
  const navigate = useNavigate();
  const acceptMutation = useAcceptInterviewBooking();
  const rejectMutation = useRejectInterviewBooking();
  const isInterviewer = booking.interviewerId === user?.id;
  const ready = booking.status === "ACCEPTED" && isInterviewReady(booking);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "ACCEPTED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full h-full sm:h-auto max-h-full sm:max-h-[90vh] max-w-2xl flex flex-col rounded-none sm:rounded-3xl bg-white shadow-2xl border border-[#e2e8f0] overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-0.5 text-xs font-bold rounded-full border ${getStatusBadge(
                  booking.status,
                )}`}
              >
                {booking.status}
              </span>
              <span className="text-xs font-medium text-[#64748b]">
                ID: {booking.id?.slice(0, 8)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mt-1.5">
              {booking.profileTitle || "Phỏng vấn Demo / Training"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body (Scrollable area) */}
        <div className="flex-1 overflow-y-auto pl-6 pr-4 py-6 space-y-6 custom-scrollbar">
          {/* Participant Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd] flex items-center justify-center font-bold text-sm">
                <User size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                  Ứng viên
                </p>
                <p className="text-sm font-bold text-[#0f172a]">
                  {booking.candidateName}
                </p>
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e6f4ea] text-[#137333] border border-[#c3e6cb] flex items-center justify-center font-bold text-sm">
                <Award size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                  Người phỏng vấn
                </p>
                <p className="text-sm font-bold text-[#0f172a]">
                  {booking.interviewerName}
                </p>
              </div>
            </div>
          </div>

          {/* Date, Time & Duration Panel */}
          <div className="bg-gradient-to-r from-[#f0f7ff] to-[#e0f2fe] rounded-2xl p-4 border border-[#bae6fd]/60 space-y-3">
            <h4 className="text-xs font-bold text-[#0077b6] uppercase tracking-wider">
              Thời gian lên lịch phỏng vấn
            </h4>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#0f172a]">
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#bae6fd] shadow-2xs">
                <Calendar size={16} className="text-[#0077b6]" />
                <span>{formatDateTime(booking.scheduledAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#bae6fd] shadow-2xs">
                <Clock size={16} className="text-[#0077b6]" />
                <span>{booking.durationMinutes} phút</span>
              </div>
            </div>
          </div>

          {/* Skills / Subcategories */}
          {booking.subcategories && booking.subcategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                Yêu cầu đánh giá danh mục con ({booking.subcategories.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {booking.subcategories.map((item) => (
                  <SubCategoryTag key={item.id} name={item.name} size="sm" />
                ))}
              </div>
            </div>
          )}

          {/* Candidate Message */}
          {booking.message && (
            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-[#e2e8f0] space-y-1.5">
              <h4 className="text-xs font-bold text-[#64748b] flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#0077b6]" />
                Ghi chú từ ứng viên:
              </h4>
              <p className="text-xs text-[#0f172a] leading-relaxed italic bg-white p-3 rounded-xl border border-[#e2e8f0]">
                "{booking.message}"
              </p>
            </div>
          )}

          {/* Virtual Room status warning */}
          {booking.status === "ACCEPTED" && (
            <div className="bg-[#fef3c7] border border-[#fde68a] rounded-2xl p-3.5 flex items-center gap-3 text-xs text-[#d97706]">
              <AlertCircle size={18} className="text-[#d97706] flex-shrink-0" />
              {ready ? (
                <span>Phòng phỏng vấn đang mở! Bạn có thể tham gia ngay.</span>
              ) : (
                <span>
                  Phòng phỏng vấn mở đúng vào lúc{" "}
                  <strong>{formatDateTime(booking.scheduledAt)}</strong> và tự
                  động đóng sau <strong>{booking.durationMinutes} phút</strong>.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex flex-wrap items-center justify-end gap-3 shrink-0 bg-white">
          {isInterviewer && booking.status === "PENDING" && (
            <>
              <button
                type="button"
                onClick={() => {
                  rejectMutation.mutate(booking.id, { onSuccess: onClose });
                }}
                disabled={rejectMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#fca5a5] bg-[#fee2e2] px-4 py-2.5 text-xs font-semibold text-[#dc2626] hover:bg-red-100 transition active:scale-95 cursor-pointer"
              >
                <Ban size={15} />
                Từ chối
              </button>

              <button
                type="button"
                onClick={() => {
                  acceptMutation.mutate(booking.id, { onSuccess: onClose });
                }}
                disabled={acceptMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#10b981] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#059669] transition shadow-2xs active:scale-95 cursor-pointer"
              >
                <Check size={15} />
                Chấp nhận yêu cầu
              </button>
            </>
          )}

          {ready && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/interview/room/${booking.id}`);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ff6b35] hover:bg-[#e85d04] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#ff6b35]/20 animate-pulse transition active:scale-95 cursor-pointer"
            >
              <Video size={16} />
              Vào phòng phỏng vấn
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-xs font-semibold text-[#0f172a] bg-white hover:bg-[#f0f7ff] hover:text-[#0077b6] transition active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
