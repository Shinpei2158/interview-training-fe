import { DAYS, HOURS, defaultAvailability, rangesToKeys, slotKey, slotsToRanges } from "@/components/interview/common/interviewUtils";

export default function AvailabilityGrid({ value, onChange }) {
  const activeKeys = rangesToKeys(value?.length ? value : defaultAvailability());

  const toggle = (dayOfWeek, hour) => {
    const next = new Set(activeKeys);
    const key = slotKey(dayOfWeek, hour);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(slotsToRanges(next));
  };

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-slate-800">Availability</h4>
      <div className="overflow-x-auto rounded-lg border">
        <div className="grid min-w-[720px] grid-cols-[72px_repeat(7,minmax(84px,1fr))] text-sm">
          <div className="border-b bg-slate-50 p-2" />
          {DAYS.map((day) => <div key={day.value} className="border-b border-l bg-slate-50 p-2 text-center font-medium">{day.label}</div>)}
          {HOURS.map((hour) => (
            <>
              <div key={`time-${hour}`} className="border-b bg-slate-50 p-2 text-xs text-slate-500">{String(hour).padStart(2, "0")}:00</div>
              {DAYS.map((day) => {
                const active = activeKeys.has(slotKey(day.value, hour));
                return (
                  <button
                    key={slotKey(day.value, hour)}
                    type="button"
                    onClick={() => toggle(day.value, hour)}
                    className={`h-9 border-b border-l ${active ? "bg-blue-500 hover:bg-blue-600" : "bg-white hover:bg-slate-100"}`}
                    aria-label={`${day.label} ${hour}:00`}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
