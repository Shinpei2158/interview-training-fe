import { useMemo, useState } from "react";
import {
  X,
  Star,
  Calendar,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

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
import SubCategoryTag from "@/components/common/SubCategoryTag";

function weekWindow() {
  const start = startOfCalendarWeek(new Date());
  const end = addDays(start, 7);
  return { start, end };
}

import { useAuth } from "@/hooks/auth/useAuth";

export default function RequestModal({ profile, onClose }) {
  const { data: user } = useAuth();
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedSkillIds, setSelectedSkillIds] = useState(
    profile.subcategories?.map((item) => item.id).slice(0, 1) || [],
  );
  const [message, setMessage] = useState("");
  const { start, end } = useMemo(weekWindow, []);

  const profileBookingsWindow = useMemo(
    () => ({
      startsAt: toApiDateTime(start),
      endsAt: toApiDateTime(end),
    }),
    [start, end],
  );
  const { data: bookings = [] } = useProfileBookings(
    profile.id,
    profileBookingsWindow,
  );

  const selectedSlots = [...selectedKeys].sort(
    (left, right) =>
      slotDateFromKey(left, start) - slotDateFromKey(right, start),
  );
  const scheduledAt = selectedSlots.length
    ? slotDateFromKey(selectedSlots[0], start)
    : null;
  const durationMinutes = selectedSlots.length * 60;
  const weekLabelDate = addDays(start, 3);

  const mutation = useCreateInterviewRequest({ onSuccess: onClose });

  const requiredPoints = profile.pointsRequired || 10;
  const candidatePoints = user?.point || 0;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:px-4 sm:py-8">
      <div className="h-full sm:h-auto max-h-full sm:max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-none sm:rounded-3xl bg-white pl-4 pr-3 py-5 sm:pl-6 sm:pr-4 sm:py-6 shadow-2xl border border-slate-200/80 flex flex-col gap-5 custom-scrollbar">
        {/* Header - Profile details */}
        <div className="relative border-b border-slate-100 pb-5">
          <button
            type="button"
            className="absolute top-0 right-0 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col md:flex-row items-start gap-5 pr-10">
            {/* Avatar & Experience badge */}
            <div className="flex-shrink-0 relative">
              <img
                src={profile.avatarUrl || "/default-avatar.png"}
                alt={profile.interviewerName}
                className="h-16 w-16 rounded-2xl object-cover ring-4 ring-indigo-50/50"
              />
              {profile.yearsExperience != null && (
                <span className="absolute -bottom-1 -right-1 bg-[#0077b6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-white">
                  {profile.yearsExperience} năm KN
                </span>
              )}
            </div>

            {/* Profile Information */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {profile.interviewerName}
                </h3>
                {profile.company && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd] rounded-lg">
                    {profile.company}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                {profile.title}
              </p>

              {profile.description && (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-3xl whitespace-pre-wrap">
                  {profile.description}
                </p>
              )}

              {/* Rating & Subcategories summary */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                {profile.averageRating != null && (
                  <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    {profile.averageRating.toFixed(1)} (
                    {profile.totalRatings || 0} đánh giá)
                  </span>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {profile.subcategories?.map((sc) => (
                    <SubCategoryTag key={sc.id} name={sc.name} size="sm" />
                  ))}
                </div>
              </div>

              {/* Verification Credentials */}
              {(profile.verificationImageUrl ||
                profile.verificationDocuments?.length > 0) && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    Hồ Sơ Đã Xác Minh
                  </h5>
                  <div className="flex flex-wrap items-start gap-3">
                    {/* Verification Image */}
                    {profile.verificationImageUrl && (
                      <a
                        href={profile.verificationImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-xs hover:shadow-md"
                      >
                        <img
                          src={profile.verificationImageUrl}
                          alt="Verification"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-all">
                          <ExternalLink
                            size={16}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </a>
                    )}

                    {/* Verification Documents */}
                    {profile.verificationDocuments?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profile.verificationDocuments.map((docUrl, idx) => {
                          const isImage =
                            /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(docUrl);
                          const fileName =
                            docUrl.split("/").pop()?.split("?")[0] ||
                            `Tài liệu ${idx + 1}`;
                          const shortName =
                            fileName.length > 20
                              ? fileName.slice(0, 17) + "..."
                              : fileName;

                          return (
                            <a
                              key={idx}
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-2 bg-white border border-slate-200 hover:border-[#0077b6] rounded-xl px-3 py-2 text-xs text-slate-700 hover:text-[#0077b6] transition-all shadow-xs hover:shadow-md max-w-[200px]"
                              title={fileName}
                            >
                              {isImage ? (
                                <ImageIcon
                                  size={14}
                                  className="text-emerald-500 flex-shrink-0"
                                />
                              ) : (
                                <FileText
                                  size={14}
                                  className="text-[#0077b6] flex-shrink-0"
                                />
                              )}
                              <span className="truncate font-medium">
                                {shortName}
                              </span>
                              <ExternalLink
                                size={10}
                                className="text-slate-300 group-hover:text-[#0077b6] flex-shrink-0 transition"
                              />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date / Week summary bar */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar size={16} className="text-[#0077b6]" />
              <span>Chọn Khung Giờ Phỏng Vấn</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn một hoặc nhiều khung giờ 1 tiếng liên tiếp để đặt lịch phỏng vấn.
            </p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0077b6] animate-pulse" />
            Tuần {getWeekOfMonth(weekLabelDate)} ({formatShortDate(start)} -{" "}
            {formatShortDate(addDays(end, -1))})
          </div>
        </div>

        {/* Booking Form + Grid */}
        <form
          className="grid gap-6 lg:grid-cols-[1fr_320px]"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({
              profileId: profile.id,
              payload: {
                scheduledAt: toApiDateTime(scheduledAt),
                durationMinutes,
                subcategoryIds: selectedSkillIds,
                points: requiredPoints,
                message,
              },
            });
          }}
        >
          <div className="min-w-0">
            <BookingCalendarGrid
              availability={profile.availabilities}
              bookings={bookings}
              selectedKeys={selectedKeys}
              onToggle={toggleSlot}
              weekStart={start}
            />
          </div>
          <div className="flex-shrink-0">
            <RequestFormPanel
              profile={profile}
              selectedSkillIds={selectedSkillIds}
              setSelectedSkillIds={setSelectedSkillIds}
              durationMinutes={durationMinutes}
              candidatePoints={candidatePoints}
              requiredPoints={requiredPoints}
              message={message}
              setMessage={setMessage}
              isSubmitting={mutation.isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
