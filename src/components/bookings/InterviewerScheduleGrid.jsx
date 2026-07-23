import { useMemo } from "react";
import {
  DAYS,
  HOURS,
  formatShortDate,
  slotDateFromKey,
  slotKey,
} from "@/components/interview/common/interviewUtils";

export default function InterviewerScheduleGrid({
  bookings = [],
  weekStart,
  onSelectBooking,
}) {
  // Map bookings to slots for quick lookup
  const slotBookingMap = useMemo(() => {
    const map = new Map();
    bookings.forEach((booking) => {
      if (!booking.scheduledAt) return;
      const start = new Date(booking.scheduledAt);
      const durationHours = Math.ceil((booking.durationMinutes || 60) / 60);

      // Match booking day of week and start hour
      const dayOfWeek = start.getDay(); // 0 is Sun, 1 is Mon, ...
      const startHour = start.getHours();

      for (let h = 0; h < durationHours; h++) {
        const hour = startHour + h;
        const key = slotKey(dayOfWeek, hour);
        if (!map.has(key)) {
          map.set(key, booking);
        }
      }
    });
    return map;
  }, [bookings]);

  return (
    <div className="space-y-4">
      {/* Legend Panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700">
          <span className="font-bold text-slate-900">Chú thích lịch phỏng vấn (Schedule Legend):</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white border border-amber-200 px-2.5 py-1 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-amber-800">Chờ duyệt (Pending)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-indigo-200 px-2.5 py-1 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-indigo-600" />
              <span className="text-indigo-800">Đã duyệt / Chuẩn bị (Accepted)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-emerald-200 px-2.5 py-1 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-emerald-800">Đã hoàn thành (Completed)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-rose-200 px-2.5 py-1 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-rose-800">Đã huỷ / Từ chối (Cancelled)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
        <div className="grid min-w-[760px] grid-cols-[72px_repeat(7,minmax(96px,1fr))] text-xs">
          {/* Header row */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-3" />
          {DAYS.map((day) => (
            <div
              key={day.value}
              className="border-b border-l border-slate-100 bg-slate-50/50 p-3 text-center"
            >
              <span className="block font-bold text-slate-800">{day.label}</span>
              <span className="mt-0.5 block text-[10px] font-medium text-slate-400">
                {formatShortDate(slotDateFromKey(`${day.value}-7`, weekStart))}
              </span>
            </div>
          ))}

          {/* Time slot rows */}
          {HOURS.map((hour) => (
            <div key={`row-${hour}`} className="contents">
              <div className="border-b border-slate-100 bg-slate-50/30 p-2.5 font-semibold text-slate-500 text-right pr-3 flex items-center justify-end">
                {String(hour).padStart(2, "0")}:00
              </div>
              {DAYS.map((day) => {
                const key = slotKey(day.value, hour);
                const booking = slotBookingMap.get(key);

                if (!booking) {
                  return (
                    <div
                      key={key}
                      className="h-12 border-b border-l border-slate-100 bg-slate-50/20"
                    />
                  );
                }

                let badgeClass =
                  "h-12 border-b border-l p-1 flex flex-col justify-center items-start text-left cursor-pointer transition-all hover:brightness-95";

                if (booking.status === "PENDING") {
                  badgeClass += " bg-amber-100 border-amber-300 text-amber-900";
                } else if (booking.status === "ACCEPTED") {
                  badgeClass += " bg-indigo-600 border-indigo-700 text-white shadow-sm";
                } else if (booking.status === "COMPLETED") {
                  badgeClass += " bg-emerald-600 border-emerald-700 text-white shadow-sm";
                } else {
                  badgeClass += " bg-rose-100 border-rose-200 text-rose-800";
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectBooking(booking)}
                    className={badgeClass}
                    title={`Click để xem chi tiết: ${booking.candidateName}`}
                  >
                    <span className="font-bold truncate text-[11px] w-full">
                      {booking.candidateName}
                    </span>
                    <span className="text-[9px] opacity-80 truncate w-full">
                      {booking.profileTitle || booking.status}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
