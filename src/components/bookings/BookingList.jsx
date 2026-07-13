import { useEffect, useState } from "react";
import { CalendarClock, Check, Clock, MessageSquare, X } from "lucide-react";

import {
  useAcceptInterviewBooking,
  useCompleteInterviewBooking,
  useMyInterviewBookings,
  useRejectInterviewBooking,
} from "@/hooks/interview/useInterviewApi";
import { formatDateTime } from "@/components/interview/common/interviewUtils";
import CandidateFeedbackForm from "@/components/feedback/CandidateFeedbackForm";
import InterviewerFeedbackForm from "@/components/feedback/InterviewerFeedbackForm";

function isInterviewReady(booking, now = new Date()) {
  if (!booking?.scheduledAt) return false;
  const startsAt = new Date(booking.scheduledAt);
  const endsAt = new Date(startsAt.getTime() + (booking.durationMinutes || 60) * 60000);
  return now >= startsAt && now <= endsAt;
}

export default function BookingList({ user, mode }) {
  const [openFeedbackId, setOpenFeedbackId] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const { data, isLoading } = useMyInterviewBookings();
  const acceptMutation = useAcceptInterviewBooking();
  const rejectMutation = useRejectInterviewBooking();
  const completeMutation = useCompleteInterviewBooking();

  const bookings = (data?.content || []).filter((booking) => {
    if (mode === "requests") return booking.status === "PENDING" && booking.interviewerId === user?.id;
    if (mode === "schedule") return ["ACCEPTED", "COMPLETED"].includes(booking.status);
    return true;
  });

  return (
    <section className="rounded-lg border bg-white p-5">
      {isLoading ? <p className="text-sm text-slate-500">Loading interviews...</p> : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isInterviewer = booking.interviewerId === user?.id;
            const canEnter = booking.status === "ACCEPTED" && isInterviewReady(booking, now);
            return (
              <article key={booking.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{booking.profileTitle}</h4>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{booking.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">Candidate: {booking.candidateName} · Interviewer: {booking.interviewerName}</p>
                    <p className="mt-2 inline-flex flex-wrap items-center gap-2 text-sm text-slate-600"><CalendarClock size={16} />{formatDateTime(booking.scheduledAt)}<Clock size={16} />{booking.durationMinutes} minutes</p>
                    <div className="mt-2 flex flex-wrap gap-2">{booking.subcategories?.map((item) => <span key={item.id} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">{item.name}</span>)}</div>
                    {booking.message && <p className="mt-2 inline-flex gap-2 text-sm text-slate-600"><MessageSquare size={16} />{booking.message}</p>}
                    {booking.status === "ACCEPTED" && !canEnter && <p className="mt-2 text-sm text-amber-700">The virtual room opens at the scheduled time.</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isInterviewer && booking.status === "PENDING" && (
                      <>
                        <button className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700" onClick={() => acceptMutation.mutate(booking.id)}><Check size={16} />Accept</button>
                        <button className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700" onClick={() => rejectMutation.mutate(booking.id)}><X size={16} />Reject</button>
                      </>
                    )}
                    {booking.status === "ACCEPTED" && <button className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50" onClick={() => completeMutation.mutate(booking.id)}>Complete</button>}
                    {booking.status === "COMPLETED" && <button className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setOpenFeedbackId(openFeedbackId === booking.id ? null : booking.id)}>Feedback</button>}
                  </div>
                </div>
                {openFeedbackId === booking.id && (isInterviewer ? <InterviewerFeedbackForm booking={booking} /> : <CandidateFeedbackForm booking={booking} />)}
              </article>
            );
          })}
          {!bookings.length && <p className="text-sm text-slate-500">No interviews to show here yet.</p>}
        </div>
      )}
    </section>
  );
}
