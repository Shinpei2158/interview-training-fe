import { useState } from "react";
import { X, AlertTriangle, Send } from "lucide-react";
import { useSubmitReport } from "@/hooks/interview/useInterviewApi";

const ISSUE_CATEGORIES = [
  "Lỗi âm thanh / video (Audio/Video Issue)",
  "Rớt kết nối / Lag (Connection Drop)",
  "Đối phương không tham gia (Participant No-show)",
  "Hành vi không phù hợp (Inappropriate Behavior)",
  "Lỗi giao diện / hệ thống (System Error)",
  "Khác (Other)",
];

export default function ReportIssueModal({ bookingId, onClose }) {
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const reportMutation = useSubmitReport();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const fullReason = `[${category}] ${description.trim()}`;
    reportMutation.mutate(
      {
        reportType: "INTERVIEW_SESSION",
        targetId: bookingId,
        reason: fullReason,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Báo cáo sự cố phỏng vấn</h3>
            <p className="text-xs text-slate-500">Report issue / incident</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Loại sự cố (Issue Category)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none transition"
            >
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mô tả chi tiết sự cố (Description)
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vui lòng nêu chi tiết sự cố bạn gặp phải trong quá trình phỏng vấn..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={reportMutation.isPending || !description.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition shadow-sm"
            >
              <Send size={14} />
              {reportMutation.isPending ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
