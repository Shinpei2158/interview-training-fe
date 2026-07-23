import { useState } from "react";
import {
  X,
  Calendar,
  User,
  Video,
  CheckCircle2,
  AlertTriangle,
  Star,
  Lock,
} from "lucide-react";
import {
  useBookingFeedback,
  useSubmitInterviewFeedback,
} from "@/hooks/interview/useInterviewApi";
import { formatDateTime } from "@/components/interview/common/interviewUtils";
import { useNavigate } from "react-router-dom";
import ReportIssueModal from "./ReportIssueModal";
import CandidateFeedbackView from "@/components/feedback/CandidateFeedbackView";

function isInterviewReady(booking, now = new Date()) {
  if (!booking?.scheduledAt) return false;
  const startsAt = new Date(booking.scheduledAt);
  const endsAt = new Date(
    startsAt.getTime() + (booking.durationMinutes || 60) * 60000,
  );
  return now >= startsAt && now <= endsAt;
}

export default function ScheduleDetailModal({ booking, user, onClose }) {
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const isInterviewer = booking.interviewerId === user?.id;
  const isCandidate = booking.candidateId === user?.id;
  const ready = booking.status === "ACCEPTED" && isInterviewReady(booking);

  // Feedback state
  const { data: feedbackData, isLoading: loadingFeedback } = useBookingFeedback(
    booking.id,
  );
  const submitFeedbackMutation = useSubmitInterviewFeedback();

  const [generalComment, setGeneralComment] = useState("");
  const [details, setDetails] = useState(() =>
    (booking.subcategories || []).map((skill) => ({
      skillId: skill.id,
      rating: 5,
      shortNote: "",
    })),
  );

  const updateDetail = (skillId, patch) => {
    setDetails((current) =>
      current.map((detail) =>
        detail.skillId === skillId ? { ...detail, ...patch } : detail,
      ),
    );
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    submitFeedbackMutation.mutate({
      bookingId: booking.id,
      payload: { generalComment, details },
    });
  };

  const hasInterviewerFeedback = feedbackData?.hasInterviewerFeedback;
  const submittedFeedback = feedbackData?.interviewerFeedback;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full h-full sm:h-auto max-h-full sm:max-h-[90vh] max-w-3xl flex flex-col rounded-none sm:rounded-3xl bg-white shadow-2xl border border-[#e2e8f0] overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-0.5 text-xs font-bold rounded-full border ${
                  booking.status === "COMPLETED"
                    ? "bg-[#f0f7ff] text-[#0077b6] border-[#bae6fd]"
                    : booking.status === "ACCEPTED"
                      ? "bg-[#e6f4ea] text-[#137333] border-[#c3e6cb]"
                      : "bg-[#fef3c7] text-[#d97706] border-[#fde68a]"
                }`}
              >
                {booking.status}
              </span>
              <span className="text-xs font-medium text-[#64748b]">
                Session ID: {booking.id?.slice(0, 8)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#0f172a] mt-1.5">
              {booking.profileTitle || "Interview Schedule"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body (Scrollable with custom scrollbar) */}
        <div className="flex-1 overflow-y-auto pl-6 pr-4 py-6 space-y-6 custom-scrollbar">
          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd] flex items-center justify-center font-bold text-sm">
                <User size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                  Ứng viên
                </p>
                <p className="text-sm font-bold text-[#0f172a]">
                  {booking.candidateName}
                </p>
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd] flex items-center justify-center font-bold text-sm">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                  Thời gian lên lịch
                </p>
                <p className="text-sm font-bold text-[#0f172a]">
                  {formatDateTime(booking.scheduledAt)} (
                  {booking.durationMinutes} phút)
                </p>
              </div>
            </div>
          </div>

          {/* Action Header bar (Enter room & Report Issue) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f8fafc] p-3.5 rounded-2xl border border-[#e2e8f0]">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#fca5a5] bg-[#fee2e2] px-3.5 py-2 text-xs font-semibold text-[#dc2626] hover:bg-red-100 transition active:scale-95"
            >
              <AlertTriangle size={15} />
              Báo cáo sự cố (Report Issue)
            </button>

            {ready && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/interview/room/${booking.id}`);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ff6b35] hover:bg-[#e85d04] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#ff6b35]/20 animate-pulse transition active:scale-95"
              >
                <Video size={16} />
                Vào phòng phỏng vấn (Enter Room)
              </button>
            )}
          </div>

          {/* MUTUAL FEEDBACK SECTION (Candidate & Interviewer) */}
          {booking.status === "COMPLETED" && (
            <div className="pt-3 border-t border-[#e2e8f0] space-y-6">
              <h4 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#10b981]" />
                <span>Kết quả & Đánh giá phỏng vấn (Mutual Feedback)</span>
              </h4>

              {loadingFeedback ? (
                <p className="text-xs text-[#64748b]">
                  Đang tải thông tin đánh giá...
                </p>
              ) : (
                <div className="space-y-6">
                  {/* INTERVIEWER FEEDBACK BLOCK */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                        1. Đánh giá từ Người phỏng vấn (Interviewer Feedback)
                      </h5>
                      {hasInterviewerFeedback && (
                        <span className="inline-flex items-center gap-1 bg-[#e6f4ea] text-[#137333] border border-[#c3e6cb] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                          <Lock size={12} />
                          Đã hoàn tất
                        </span>
                      )}
                    </div>

                    {hasInterviewerFeedback ? (
                      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 space-y-3">
                        <div className="space-y-2">
                          {submittedFeedback?.details?.map((detail) => (
                            <div
                              key={detail.skillId}
                              className="bg-white border border-[#e2e8f0] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <span className="text-xs font-bold text-[#0f172a]">
                                {detail.skillName}
                              </span>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                  <Star
                                    size={14}
                                    className="fill-amber-400 text-amber-400"
                                  />
                                  <span>{detail.rating} / 5</span>
                                </div>
                                {detail.shortNote && (
                                  <span className="text-xs text-[#64748b] bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">
                                    "{detail.shortNote}"
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {submittedFeedback?.generalComment && (
                          <div className="space-y-1 pt-2 border-t border-[#e2e8f0]">
                            <span className="text-[11px] font-bold text-[#64748b] uppercase">
                              Nhận xét chung:
                            </span>
                            <p className="text-xs text-[#0f172a] leading-relaxed bg-white p-3 rounded-xl border border-[#e2e8f0]">
                              {submittedFeedback.generalComment}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : isInterviewer ? (
                      <form
                        onSubmit={handleFeedbackSubmit}
                        className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 space-y-4"
                      >
                        <div className="space-y-2.5">
                          {(booking.subcategories || []).map((skill) => {
                            const detail = details.find(
                              (item) => item.skillId === skill.id,
                            ) || {
                              rating: 5,
                              shortNote: "",
                            };
                            return (
                              <div
                                key={skill.id}
                                className="bg-white border border-[#e2e8f0] rounded-xl p-3 grid gap-2.5 md:grid-cols-[1fr_110px_2fr] md:items-center"
                              >
                                <span className="text-xs font-bold text-[#0f172a]">
                                  {skill.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <label className="text-[11px] font-semibold text-[#64748b]">
                                    Điểm:
                                  </label>
                                  <select
                                    value={detail.rating}
                                    onChange={(e) =>
                                      updateDetail(skill.id, {
                                        rating: Number(e.target.value),
                                      })
                                    }
                                    className="rounded-lg border border-[#e2e8f0] bg-white px-2 py-1 text-xs font-bold text-amber-600 focus:outline-none"
                                  >
                                    {[1, 2, 3, 4, 5].map((score) => (
                                      <option key={score} value={score}>
                                        {score} ★
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Ghi chú ngắn về kĩ năng này..."
                                  value={detail.shortNote}
                                  onChange={(e) =>
                                    updateDetail(skill.id, {
                                      shortNote: e.target.value,
                                    })
                                  }
                                  className="rounded-lg border border-[#e2e8f0] px-3 py-1 text-xs text-[#0f172a] placeholder-slate-400 focus:border-[#0077b6] focus:outline-none"
                                />
                              </div>
                            );
                          })}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0f172a] mb-1">
                            Nhận xét tổng quan chung (General Note):
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={generalComment}
                            onChange={(e) => setGeneralComment(e.target.value)}
                            placeholder="Viết nhận xét tổng quan..."
                            className="w-full rounded-xl border border-[#e2e8f0] bg-white p-2.5 text-xs text-[#0f172a] focus:border-[#0077b6] focus:outline-none"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submitFeedbackMutation.isPending}
                            className="rounded-xl bg-[#0077b6] hover:bg-[#0096c7] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 transition active:scale-95"
                          >
                            {submitFeedbackMutation.isPending
                              ? "Đang gửi..."
                              : "Gửi Feedback (Xác nhận 1 lần)"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 text-xs text-[#64748b] italic text-center">
                        Interviewer chưa gửi đánh giá phản hồi cho buổi phỏng
                        vấn này.
                      </div>
                    )}
                  </div>

                  {/* CANDIDATE FEEDBACK BLOCK */}
                  <div className="space-y-3 pt-2 border-t border-[#e2e8f0]">
                    <h5 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                      2. Đánh giá từ Ứng viên
                    </h5>
                    <CandidateFeedbackView
                      booking={booking}
                      feedbackData={feedbackData}
                      isCandidate={isCandidate}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex justify-end shrink-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#e2e8f0] px-5 py-2 text-xs font-semibold text-[#0f172a] bg-white hover:bg-[#f0f7ff] hover:text-[#0077b6] transition active:scale-95"
          >
            Đóng
          </button>
        </div>

        {/* Incident Report Modal */}
        {showReportModal && (
          <ReportIssueModal
            bookingId={booking.id}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </div>
    </div>
  );
}
