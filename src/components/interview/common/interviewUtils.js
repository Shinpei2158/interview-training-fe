export const DAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

export const HOURS = Array.from({ length: 16 }, (_, index) => index + 7);

export function defaultAvailability() {
  return DAYS.flatMap((day) => {
    const start = [6, 0].includes(day.value) ? 7 : 15;
    const end = [6, 0].includes(day.value) ? 23 : 21;
    return Array.from({ length: end - start }, (_, index) => ({
      dayOfWeek: day.value,
      startTime: `${String(start + index).padStart(2, "0")}:00`,
      endTime: `${String(start + index + 1).padStart(2, "0")}:00`,
    }));
  });
}

export function slotKey(dayOfWeek, hour) {
  return `${dayOfWeek}-${hour}`;
}

export function slotsToRanges(activeKeys) {
  return DAYS.flatMap((day) => {
    const hours = HOURS.filter((hour) => activeKeys.has(slotKey(day.value, hour)));
    const ranges = [];
    let start = null;
    hours.forEach((hour, index) => {
      if (start == null) start = hour;
      const next = hours[index + 1];
      if (next !== hour + 1) {
        ranges.push({
          dayOfWeek: day.value,
          startTime: `${String(start).padStart(2, "0")}:00`,
          endTime: `${String(hour + 1).padStart(2, "0")}:00`,
        });
        start = null;
      }
    });
    return ranges;
  });
}

export function rangesToKeys(ranges = []) {
  return new Set(
    ranges.flatMap((range) => {
      const start = Number(String(range.startTime).slice(0, 2));
      const end = Number(String(range.endTime).slice(0, 2));
      return Array.from({ length: Math.max(0, end - start) }, (_, index) => slotKey(range.dayOfWeek, start + index));
    }),
  );
}

export function formatDateTime(value) {
  return value ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
}

export function toApiDateTime(date) {
  if (!date) return null;
  const value = new Date(date);
  const pad = (number) => String(number).padStart(2, "0");
  return [
    value.getFullYear(),
    pad(value.getMonth() + 1),
    pad(value.getDate()),
  ].join("-") + `T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
}

export function startOfCalendarWeek(date = new Date()) {
  const start = new Date(date);
  start.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return start;
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

export function slotDateFromKey(key, weekStart) {
  const [day, hour] = key.split("-").map(Number);
  const dayIndex = DAYS.findIndex((item) => item.value === day);
  const date = addDays(weekStart, dayIndex);
  date.setHours(hour, 0, 0, 0);
  return date;
}

export function getWeekOfMonth(date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekStart = startOfCalendarWeek(firstOfMonth);
  return Math.floor((startOfCalendarWeek(date) - firstWeekStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export function formatShortDate(date) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

export function groupByCategory(items = []) {
  return items.reduce((groups, item) => {
    const key = item.categoryName || "Other";
    return { ...groups, [key]: [...(groups[key] || []), item] };
  }, {});
}
