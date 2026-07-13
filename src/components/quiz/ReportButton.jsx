import { Flag, X } from "lucide-react";
import { useState } from "react";

import { reportContent } from "@/api/quiz";
import { useToast } from "@/context/ToastContext";

const REASONS = ["Missing context", "Corrupted images", "Incorrect answer key"];

export default function ReportButton({ reportType, targetId }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await reportContent({
        reportType,
        targetId,
        reason: [reason, details.trim()].filter(Boolean).join(": "),
      });
      toast.success("Report submitted");
      setOpen(false);
      setDetails("");
    } catch (error) {
      toast.error(error.message || "Unable to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <Flag size={14} />
        Report
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <form onSubmit={submit} className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Report content</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-4 w-full rounded-lg border px-3 py-2 text-sm">
              {REASONS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <textarea value={details} onChange={(event) => setDetails(event.target.value)} className="mt-3 min-h-24 w-full rounded-lg border px-3 py-2 text-sm" placeholder="Add helpful details" />
            <button disabled={isSubmitting} className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              Submit report
            </button>
          </form>
        </div>
      )}
    </>
  );
}
