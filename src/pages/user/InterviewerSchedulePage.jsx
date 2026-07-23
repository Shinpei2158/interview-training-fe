import { useState, useMemo } from "react";
import { useMyInterviewBookings } from "@/hooks/interview/useInterviewApi";
import InterviewHeader from "@/components/interview/common/InterviewHeader";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  startOfCalendarWeek,
  addDays,
  formatShortDate,
  getWeekOfMonth,
} from "@/components/interview/common/interviewUtils";
import InterviewerScheduleGrid from "@/components/bookings/InterviewerScheduleGrid";
import ScheduleDetailModal from "@/components/bookings/ScheduleDetailModal";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export default function InterviewerSchedulePage() {
  const { data: user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Week navigation state (defaulting to start of current week)
  const [weekStart, setWeekStart] = useState(() => startOfCalendarWeek(new Date()));

  const { data, isLoading } = useMyInterviewBookings();

  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);

  // Filter bookings belonging to interviewer
  const interviewerBookings = useMemo(() => {
    return (data?.content || []).filter(
      (b) => b.interviewerId === user?.id
    );
  }, [data, user?.id]);

  const handlePrevWeek = () => setWeekStart((prev) => addDays(prev, -7));
  const handleNextWeek = () => setWeekStart((prev) => addDays(prev, 7));
  const handleResetCurrentWeek = () => setWeekStart(startOfCalendarWeek(new Date()));

  const weekLabelDate = addDays(weekStart, 3);

  return (
    <div className="space-y-6 pb-12">
      <InterviewHeader
        title="Lịch Phỏng Vấn Dành Cho Interviewer"
        description="Xem lịch phỏng vấn theo tuần. Nhấn trực tiếp vào khung giờ để xem chi tiết hoặc gửi nhận xét cho ứng viên."
      />

      {/* Week Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Tuần {getWeekOfMonth(weekLabelDate)}
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              {formatShortDate(weekStart)} &mdash; {formatShortDate(addDays(weekEnd, -1))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
            title="Tuần trước"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={handleResetCurrentWeek}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RotateCcw size={14} />
            Tuần hiện tại
          </button>

          <button
            type="button"
            onClick={handleNextWeek}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
            title="Tuần kế tiếp"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-sm text-slate-500 shadow-sm">
          Đang tải lịch phỏng vấn...
        </div>
      ) : (
        <InterviewerScheduleGrid
          bookings={interviewerBookings}
          weekStart={weekStart}
          onSelectBooking={(booking) => setSelectedBooking(booking)}
        />
      )}

      {/* Schedule Detail & Immutable Feedback Modal */}
      {selectedBooking && (
        <ScheduleDetailModal
          booking={selectedBooking}
          user={user}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
