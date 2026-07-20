import { useState } from "react";
import { HelpCircle, Info } from "lucide-react";
import {
  DAYS,
  HOURS,
  formatShortDate,
  rangesToKeys,
  slotDateFromKey,
  slotKey,
} from "@/components/interview/common/interviewUtils";

function statusForSlot(bookings, dayOfWeek, hour, weekStart) {
  const slotStart = slotDateFromKey(slotKey(dayOfWeek, hour), weekStart);
  const slotEnd = new Date(slotStart.getTime() + 3600000);
  return bookings.find((booking) => {
    const start = new Date(booking.scheduledAt);
    const end = new Date(start.getTime() + booking.durationMinutes * 60000);
    return slotStart < end && slotEnd > start;
  })?.status;
}

export default function BookingCalendarGrid({
  availability,
  bookings = [],
  selectedKeys,
  onToggle,
  weekStart,
}) {
  const [showHelp, setShowHelp] = useState(true);
  const availableKeys = rangesToKeys(availability);

  return (
    <div className="space-y-4">
      {/* Legend & Instructions Panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <HelpCircle size={16} className="text-indigo-600" />
            <span>Booking Guide & Calendar Legend</span>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5 transition"
          >
            {showHelp ? "Hide details" : "Show details"}
          </button>
        </div>

        {showHelp && (
          <div className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-xl p-3 flex items-start gap-2.5">
            <Info size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-700">How to choose slots:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Click on any available light-blue slot to select it.</li>
                <li>You can select consecutive 1-hour slots on the <strong>same day</strong> to extend the booking duration.</li>
                <li>Slots in the past or already booked by others cannot be selected.</li>
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100/80">
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-2">
            <span className="w-3.5 h-3.5 rounded border border-indigo-200 bg-indigo-50/80 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-700">Available</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-2">
            <span className="w-3.5 h-3.5 rounded border border-indigo-700 bg-indigo-600 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-700">Selected</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-2">
            <span className="w-3.5 h-3.5 rounded border border-amber-300 bg-amber-100 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-700">Pending Review</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-2">
            <span className="w-3.5 h-3.5 rounded border border-rose-300 bg-rose-100 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-700">Booked (Busy)</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-2">
            <span className="relative w-3.5 h-3.5 rounded border border-slate-300 bg-slate-100 overflow-hidden before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,#cbd5e1,#cbd5e1_1px,transparent_1px,transparent_4px)] opacity-60 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-700">Past Available</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-2">
            <span className="w-3.5 h-3.5 rounded border border-slate-100 bg-slate-50/30 flex-shrink-0" />
            <span className="text-[11px] font-medium text-slate-700">Not Offered</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
        <div className="grid min-w-[720px] grid-cols-[72px_repeat(7,minmax(84px,1fr))] text-xs">
          {/* Header row */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-3" />
          {DAYS.map((day) => (
            <div key={day.value} className="border-b border-l border-slate-100 bg-slate-50/50 p-3 text-center">
              <span className="block font-bold text-slate-700">{day.label}</span>
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
                const slotStart = slotDateFromKey(key, weekStart);
                const available = availableKeys.has(key);
                const status = statusForSlot(bookings, day.value, hour, weekStart);
                const selected = selectedKeys.has(key);
                const inPast = slotStart <= new Date();
                const blocked = inPast || !available || status === "ACCEPTED" || status === "COMPLETED" || status === "PENDING";
                
                // Color formatting logic
                let cellClass = "h-10 border-b border-l border-slate-100 transition-all duration-150 disabled:cursor-not-allowed";
                let style = {};

                if (inPast) {
                  if (available) {
                    cellClass += " bg-slate-100/80 border-slate-200/80 opacity-60 relative overflow-hidden";
                    // Inline repeating diagonal gradient for consistent styling across platforms
                    style = {
                      backgroundImage: "repeating-linear-gradient(-45deg, #cbd5e1, #cbd5e1 1.5px, transparent 1.5px, transparent 6px)"
                    };
                  } else {
                    cellClass += " bg-slate-50/30";
                  }
                } else if (!available) {
                  cellClass += " bg-slate-50/30";
                } else if (status === "PENDING") {
                  cellClass += " bg-amber-100 border-amber-200 text-amber-800";
                } else if (["ACCEPTED", "COMPLETED"].includes(status)) {
                  cellClass += " bg-rose-100 border-rose-200 text-rose-800";
                } else if (selected) {
                  cellClass += " bg-indigo-600 border-indigo-700 text-white shadow-sm ring-1 ring-indigo-500 scale-[0.98] rounded-md z-10";
                } else {
                  cellClass += " bg-indigo-50/70 hover:bg-indigo-100 border-indigo-200/70 text-indigo-700 hover:scale-[0.98] hover:rounded-md cursor-pointer";
                }

                return (
                  <button
                    key={key}
                    type="button"
                    style={style}
                    disabled={blocked}
                    onClick={blocked ? undefined : () => onToggle(day.value, hour)}
                    className={cellClass}
                    aria-label={`${day.label} ${hour}:00`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
