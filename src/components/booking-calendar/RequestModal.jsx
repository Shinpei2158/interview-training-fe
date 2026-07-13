import { useMemo, useState } from "react";
import { X } from "lucide-react";

import {
  useCreateInterviewRequest,
  useProfileBookings,
} from "@/hooks/interview/useInterviewApi";
import {
  addDays,
  formatShortDate,
  getWeekOfMonth,
  slotKey,
  slotDateFromKey,
  startOfCalendarWeek,
  toApiDateTime,
} from "@/components/interview/common/interviewUtils";
import BookingCalendarGrid from "./BookingCalendarGrid";
import RequestFormPanel from "./RequestFormPanel";

function weekWindow() {
  const start = startOfCalendarWeek(new Date());
  const end = addDays(start, 7);
  return { start, end };
}

export default function RequestModal({ profile, onClose }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedSkillIds, setSelectedSkillIds] = useState(
    profile.subcategories?.map((item) => item.id).slice(0, 1) || [],
  );
  const [message, setMessage] = useState("");
  const { start, end } = useMemo(weekWindow, []);

  const profileBookingsWindow = useMemo(() => ({
    startsAt: toApiDateTime(start),
    endsAt: toApiDateTime(end),
  }), [start, end]);
  const { data: bookings = [] } = useProfileBookings(profile.id, profileBookingsWindow);

  const selectedSlots = [...selectedKeys].sort(
    (left, right) => slotDateFromKey(left, start) - slotDateFromKey(right, start),
  );
  const scheduledAt = selectedSlots.length
    ? slotDateFromKey(selectedSlots[0], start)
    : null;
  const durationMinutes = selectedSlots.length * 60;
  const weekLabelDate = addDays(start, 3);

  const mutation = useCreateInterviewRequest({ onSuccess: onClose });

  const toggleSlot = (dayOfWeek, hour) => {
    const key = slotKey(dayOfWeek, hour);
    setSelectedKeys((current) => {
      if (!current.size || current.has(key)) {
        return current.has(key) ? new Set() : new Set([key]);
      }

      const selected = [...current].map((item) => {
        const [day, selectedHour] = item.split("-").map(Number);
        return { key: item, day, hour: selectedHour };
      });
      const sameDay = selected.every((item) => item.day === dayOfWeek);
      const hours = selected.map((item) => item.hour);
      const minHour = Math.min(...hours);
      const maxHour = Math.max(...hours);

      if (sameDay && (hour === minHour - 1 || hour === maxHour + 1)) {
        return new Set([...current, key]);
      }

      return new Set([key]);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{profile.title}</h3>
            <p className="text-sm text-slate-500">{profile.interviewerName}</p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Week {getWeekOfMonth(weekLabelDate)} of{" "}
              {new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(weekLabelDate)}
              <span className="font-normal text-slate-500">
                {" "}({formatShortDate(start)} - {formatShortDate(addDays(end, -1))})
              </span>
            </p>
          </div>
          <button
            className="rounded-lg p-2 hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <form
          className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({
              profileId: profile.id,
              payload: {
                scheduledAt: toApiDateTime(scheduledAt),
                durationMinutes,
                subcategoryIds: selectedSkillIds,
                message,
              },
            });
          }}
        >
          <BookingCalendarGrid
            availability={profile.availabilities}
            bookings={bookings}
            selectedKeys={selectedKeys}
            onToggle={toggleSlot}
            weekStart={start}
          />
          <RequestFormPanel
            profile={profile}
            selectedSkillIds={selectedSkillIds}
            setSelectedSkillIds={setSelectedSkillIds}
            durationMinutes={durationMinutes}
            message={message}
            setMessage={setMessage}
            isSubmitting={mutation.isPending}
          />
        </form>
      </div>
    </div>
  );
}
