import { useState } from "react";
import { Star, CheckCircle2, Lock, MessageSquare, Award, Clock, Heart, ThumbsUp } from "lucide-react";
import { useSubmitInterviewFeedback } from "@/hooks/interview/useInterviewApi";
import Stars from "@/components/interview/common/Stars";

export default function CandidateFeedbackView({ booking, feedbackData, isCandidate }) {
  const submitMutation = useSubmitInterviewFeedback();
  const hasCandidateFeedback = feedbackData?.hasCandidateFeedback;
  const candidateFeedback = feedbackData?.candidateFeedback;

  const [form, setForm] = useState({
    rating: 5,
    punctualityRating: 5,
    attitudeRating: 5,
    expertiseRating: 5,
    comments: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate({
      bookingId: booking.id,
      payload: form,
    });
  };

  if (hasCandidateFeedback) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Đánh giá từ Ứng viên
            </h5>
          </div>
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <Lock size={12} />
            Đã hoàn tất
          </span>
        </div>

        {/* Overall & Star Ratings breakdown */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700">Đánh giá tổng quan:</span>
            <div className="flex items-center gap-1.5 font-bold text-amber-500 text-sm bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span>{candidateFeedback?.rating} / 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <Clock size={14} className="text-indigo-500" /> Đúng giờ:
              </span>
              <span className="font-bold text-slate-800">{candidateFeedback?.punctualityRating} ★</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <Heart size={14} className="text-rose-500" /> Thái độ:
              </span>
              <span className="font-bold text-slate-800">{candidateFeedback?.attitudeRating} ★</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <ThumbsUp size={14} className="text-emerald-500" /> Chuyên môn:
              </span>
              <span className="font-bold text-slate-800">{candidateFeedback?.expertiseRating} ★</span>
            </div>
          </div>
        </div>

        {/* Candidate Comment */}
        {candidateFeedback?.comments && (
          <div className="space-y-1.5">
            <h6 className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-indigo-600" /> Nhận xét từ ứng viên:
            </h6>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-100">
              "{candidateFeedback.comments}"
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!isCandidate) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic text-center">
        Ứng viên chưa gửi đánh giá phản hồi cho buổi phỏng vấn này.
      </div>
    );
  }

  // Candidate Submission Form
  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Star size={16} className="text-amber-500 fill-amber-500" />
          <span>Gửi đánh giá cho Interviewer ({booking.interviewerName})</span>
        </h4>
        <span className="text-[11px] font-medium text-slate-500 italic">Chỉ được gửi 1 lần</span>
      </div>

      {/* Main Overall Rating */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-800">Đánh giá chung chất lượng buổi phỏng vấn:</span>
        <Stars value={form.rating} onChange={(rating) => setForm((c) => ({ ...c, rating }))} />
      </div>

      {/* Breakdown Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { key: "punctualityRating", label: "Đúng giờ", icon: Clock },
          { key: "attitudeRating", label: "Thái độ", icon: Heart },
          { key: "expertiseRating", label: "Chuyên môn", icon: ThumbsUp },
        ].map(({ key, label, icon: Icon }) => (
          <div key={key} className="bg-white p-3 rounded-xl border border-slate-100 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Icon size={14} className="text-[#0077b6]" />
              {label}
            </label>
            <select
              value={form[key]}
              onChange={(e) => setForm((c) => ({ ...c, [key]: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((score) => (
                <option key={score} value={score}>
                  {score} ★
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Detailed Comments */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Nhận xét & Đóng góp ý kiến:
        </label>
        <textarea
          required
          rows={3}
          value={form.comments}
          onChange={(e) => setForm((c) => ({ ...c, comments: e.target.value }))}
          placeholder="Viết nhận xét chi tiết về tác phong, kiến thức hoặc trải nghiệm phỏng vấn của bạn..."
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0077b6] focus:outline-none"
        />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={submitMutation.isPending}
          className="rounded-xl bg-[#0077b6] hover:bg-[#0096c7] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50 transition shadow-xs cursor-pointer"
        >
          {submitMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>
    </form>
  );
}
