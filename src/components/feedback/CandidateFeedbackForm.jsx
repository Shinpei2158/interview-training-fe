import { useState } from "react";

import { useSubmitInterviewFeedback } from "@/hooks/interview/useInterviewApi";
import Stars from "@/components/interview/common/Stars";

export default function CandidateFeedbackForm({ booking }) {
  const [form, setForm] = useState({ rating: 5, punctualityRating: 5, attitudeRating: 5, expertiseRating: 5, comments: "" });
  const mutation = useSubmitInterviewFeedback();

  return (
    <form className="mt-4 rounded-lg border bg-slate-50 p-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate({ bookingId: booking.id, payload: form }); }}>
      <Stars value={form.rating} onChange={(rating) => setForm((current) => ({ ...current, rating }))} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {["punctualityRating", "attitudeRating", "expertiseRating"].map((field) => (
          <label key={field} className="rounded-lg border bg-white px-3 py-2 text-sm">
            <span className="font-medium capitalize text-slate-700">{field.replace("Rating", "")}</span>
            <select className="mt-2 w-full rounded border px-2 py-1" value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: Number(event.target.value) }))}>
              {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}</option>)}
            </select>
          </label>
        ))}
      </div>
      <textarea className="mt-3 min-h-24 w-full rounded-lg border px-3 py-2" placeholder="Open feedback" value={form.comments} onChange={(event) => setForm((current) => ({ ...current, comments: event.target.value }))} />
      <button className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60" disabled={mutation.isPending}>Submit feedback</button>
    </form>
  );
}
