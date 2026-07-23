import { DAYS, HOURS, defaultAvailability, rangesToKeys, slotKey, slotsToRanges } from "@/components/interview/common/interviewUtils";
import { Trash2, CalendarRange, Moon } from "lucide-react";

export default function AvailabilityGrid({ value, onChange }) {
  const activeKeys = rangesToKeys(value?.length ? value : defaultAvailability());

  const toggle = (dayOfWeek, hour) => {
    const next = new Set(activeKeys);
    const key = slotKey(dayOfWeek, hour);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(slotsToRanges(next));
  };

  // Toggle all hours for a specific day column
  const toggleDayColumn = (dayOfWeek) => {
    const next = new Set(activeKeys);
    const dayKeys = HOURS.map((h) => slotKey(dayOfWeek, h));
    const allActive = dayKeys.every((k) => next.has(k));
    
    if (allActive) {
      dayKeys.forEach((k) => next.delete(k));
    } else {
      dayKeys.forEach((k) => next.add(k));
    }
    onChange(slotsToRanges(next));
  };

  // Toggle all days for a specific hour row
  const toggleHourRow = (hour) => {
    const next = new Set(activeKeys);
    const hourKeys = DAYS.map((d) => slotKey(d.value, hour));
    const allActive = hourKeys.every((k) => next.has(k));

    if (allActive) {
      hourKeys.forEach((k) => next.delete(k));
    } else {
      hourKeys.forEach((k) => next.add(k));
    }
    onChange(slotsToRanges(next));
  };

  // Preset selectors
  const applyPreset = (type) => {
    const next = new Set();
    if (type === "WEEKDAYS_9_5") {
      // Mon to Fri (1-5), hours 9 to 16 inclusive (9 AM to 5 PM)
      DAYS.filter((d) => d.value >= 1 && d.value <= 5).forEach((d) => {
        for (let h = 9; h < 17; h++) {
          next.add(slotKey(d.value, h));
        }
      });
    } else if (type === "EVENINGS") {
      // All days, 6 PM to 9 PM (18:00 - 21:00)
      DAYS.forEach((d) => {
        for (let h = 18; h < 21; h++) {
          next.add(slotKey(d.value, h));
        }
      });
    }
    onChange(slotsToRanges(next));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wide">Khung Giờ Rảnh Theo Tuần</h4>
          <p className="text-xs text-[#64748b]">Bấm vào tiêu đề cột/hàng để chọn nhanh cả ngày hoặc cả khung giờ. Bấm từng ô để bật/tắt giờ lẻ.</p>
        </div>
        
        {/* Preset controls */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset("WEEKDAYS_9_5")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#bae6fd] bg-[#f0f7ff] hover:bg-[#e0f2fe] text-xs font-bold text-[#0077b6] transition active:scale-95 shadow-2xs"
          >
            <CalendarRange size={13} />
            Giờ Hành Chính (9h-17h T2-T6)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("EVENINGS")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ffedd5] bg-[#fff7ed] hover:bg-[#ffedd5] text-xs font-bold text-[#ff6b35] transition active:scale-95 shadow-2xs"
          >
            <Moon size={13} />
            Buổi Tối (18h-21h)
          </button>
          <button
            type="button"
            onClick={() => onChange([])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#fca5a5] bg-[#fee2e2] hover:bg-red-100 text-xs font-bold text-[#dc2626] transition active:scale-95 shadow-2xs"
          >
            <Trash2 size={13} />
            Xóa Tất Cả
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0] shadow-2xs bg-white">
        <div className="grid min-w-[720px] grid-cols-[76px_repeat(7,minmax(84px,1fr))] text-sm">
          {/* Header Row */}
          <div className="border-b border-[#e2e8f0] bg-[#f8fafc] p-2.5 font-bold text-[#64748b] text-[11px] flex items-center justify-center tracking-wider">GIỜ</div>
          {DAYS.map((day) => {
            const dayKeys = HOURS.map((h) => slotKey(day.value, h));
            const allActive = dayKeys.every((k) => activeKeys.has(k));
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDayColumn(day.value)}
                className={`border-b border-l border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-center font-bold text-xs uppercase tracking-wider transition ${
                  allActive ? "text-[#0077b6] bg-[#f0f7ff]" : "text-[#0f172a] hover:bg-[#f0f7ff]"
                }`}
                title={`Chọn toàn bộ ${day.label}`}
              >
                {day.label}
              </button>
            );
          })}

          {/* Time Rows */}
          {HOURS.map((hour) => {
            const hourKeys = DAYS.map((d) => slotKey(d.value, hour));
            const allActive = hourKeys.every((k) => activeKeys.has(k));
            return (
              <div key={`row-${hour}`} className="contents">
                <button
                  type="button"
                  onClick={() => toggleHourRow(hour)}
                  className={`border-b border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-left font-semibold text-[11px] transition ${
                    allActive ? "text-[#0077b6] bg-[#f0f7ff]" : "text-[#64748b] hover:bg-[#f0f7ff]"
                  }`}
                  title={`Chọn tất cả các ngày lúc ${String(hour).padStart(2, "0")}:00`}
                >
                  {String(hour).padStart(2, "0")}:00
                </button>
                {DAYS.map((day) => {
                  const active = activeKeys.has(slotKey(day.value, hour));
                  return (
                    <button
                      key={slotKey(day.value, hour)}
                      type="button"
                      onClick={() => toggle(day.value, hour)}
                      className={`h-9 border-b border-l border-[#e2e8f0] transition duration-150 ${
                        active 
                          ? "bg-[#0077b6] hover:bg-[#0096c7] shadow-inner" 
                          : "bg-white hover:bg-[#f0f7ff]"
                      }`}
                      aria-label={`${day.label} ${hour}:00`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
