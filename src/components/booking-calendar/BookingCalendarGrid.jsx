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
  const availableKeys = rangesToKeys(availability);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <div className="grid min-w-[720px] grid-cols-[72px_repeat(7,minmax(84px,1fr))] text-sm">
        <div className="border-b bg-slate-50 p-2" />
        {DAYS.map((day) => (
          <div key={day.value} className="border-b border-l bg-slate-50 p-2 text-center font-medium">
            <span className="block">{day.label}</span>
            <span className="mt-0.5 block text-xs font-normal text-slate-500">
              {formatShortDate(slotDateFromKey(`${day.value}-7`, weekStart))}
            </span>
          </div>
        ))}
        {HOURS.map((hour) => (
          <>
            <div key={`time-${hour}`} className="border-b bg-slate-50 p-2 text-xs text-slate-500">{String(hour).padStart(2, "0")}:00</div>
            {DAYS.map((day) => {
              const key = slotKey(day.value, hour);
              const slotStart = slotDateFromKey(key, weekStart);
              const available = availableKeys.has(key);
              const status = statusForSlot(bookings, day.value, hour, weekStart);
              const selected = selectedKeys.has(key);
              const inPast = slotStart <= new Date();
              const blocked = inPast || !available || status === "ACCEPTED" || status === "COMPLETED" || status === "PENDING";
              const color = inPast
                ? "bg-slate-100 opacity-50 cursor-not-allowed"
                : !available
                ? "bg-slate-100"
                : status === "PENDING"
                  ? "bg-green-500"
                  : ["ACCEPTED", "COMPLETED"].includes(status)
                    ? "bg-red-500"
                    : selected
                      ? "bg-blue-500"
                      : "bg-slate-300 hover:bg-slate-400";
              return (
                <button
                  key={key}
                  type="button"
                  disabled={blocked}
                  onClick={blocked ? undefined : () => onToggle(day.value, hour)}
                  className={`h-9 border-b border-l ${color} disabled:cursor-not-allowed`}
                  aria-label={`${day.label} ${hour}:00`}
                />
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
