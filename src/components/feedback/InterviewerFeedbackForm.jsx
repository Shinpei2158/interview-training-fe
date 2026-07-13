import { useState } from "react";

import { useSubmitInterviewFeedback } from "@/hooks/interview/useInterviewApi";

export default function InterviewerFeedbackForm({ booking }) {
  const [generalComment, setGeneralComment] = useState("");
  const [details, setDetails] = useState(() => (booking.subcategories || []).map((skill) => ({ skillId: skill.id, rating: 5, shortNote: "" })));
  const mutation = useSubmitInterviewFeedback();

  const updateDetail = (skillId, patch) => {
    setDetails((current) => current.map((detail) => detail.skillId === skillId ? { ...detail, ...patch } : detail));
  };

  return (
    <form className="mt-4 rounded-lg border bg-slate-50 p-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate({ bookingId: booking.id, payload: { generalComment, details } }); }}>
      <div className="space-y-2">
        {(booking.subcategories || []).map((skill) => {
          const detail = details.find((item) => item.skillId === skill.id) || { rating: 5, shortNote: "" };
          return (
            <div key={skill.id} className="grid gap-2 rounded-lg border bg-white p-3 md:grid-cols-[1fr_96px_2fr] md:items-center">
              <span className="text-sm font-medium text-slate-800">{skill.name}</span>
              <select className="rounded border px-2 py-1 text-sm" value={detail.rating} onChange={(event) => updateDetail(skill.id, { rating: Number(event.target.value) })}>
                {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}</option>)}
              </select>
              <input className="rounded border px-3 py-2 text-sm" placeholder="Short note" value={detail.shortNote} onChange={(event) => updateDetail(skill.id, { shortNote: event.target.value })} />
            </div>
          );
        })}
      </div>
      <textarea className="mt-3 min-h-28 w-full rounded-lg border px-3 py-2" placeholder="Holistic performance summary" value={generalComment} onChange={(event) => setGeneralComment(event.target.value)} />
      <button className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60" disabled={mutation.isPending}>Submit feedback</button>
    </form>
  );
}
