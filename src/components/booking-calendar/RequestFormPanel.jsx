import { groupByCategory } from "@/components/interview/common/interviewUtils";
import { Clock, MessageSquare, Award, AlertTriangle, Coins } from "lucide-react";

export default function RequestFormPanel({
  profile,
  selectedSkillIds,
  setSelectedSkillIds,
  durationMinutes,
  candidatePoints = 0,
  requiredPoints = 10,
  message,
  setMessage,
  isSubmitting,
}) {
  const groups = groupByCategory(profile.subcategories || []);

  const toggleSkill = (skillId) => {
    setSelectedSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId],
    );
  };

  const isInsufficientPoints = candidatePoints < requiredPoints;

  return (
    <div className="space-y-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
      {/* Skill Selection Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#64748b] tracking-wide uppercase flex items-center gap-1.5">
          <Award size={14} className="text-[#0077b6]" />
          <span>Yêu cầu Đánh giá Kỹ năng</span>
        </h4>
        <div className="space-y-3">
          {Object.entries(groups).map(([categoryName, skills]) => (
            <section
              key={categoryName}
              className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-2xs"
            >
              <h5 className="text-xs font-bold text-[#0f172a] mb-2">
                {categoryName}
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => {
                  const isSelected = selectedSkillIds.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all font-semibold cursor-pointer ${
                        isSelected
                          ? "border-[#0077b6] bg-[#0077b6] text-white shadow-2xs"
                          : "border-[#bae6fd] bg-[#f0f7ff] text-[#0077b6] hover:bg-[#e0f2fe]"
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Points Requirement & Candidate Points Panel */}
      <div className="bg-[#fff7ed] border border-[#ffedd5] rounded-xl p-3 space-y-2 text-xs text-[#0f172a]">
        <div className="flex items-center justify-between font-bold">
          <span className="flex items-center gap-1.5 text-[#ff6b35]">
            <Coins size={15} />
            <span>Chi phí buổi phỏng vấn:</span>
          </span>
          <span className="bg-[#ff6b35] text-white px-2 py-0.5 rounded-md text-[11px] font-extrabold">
            {requiredPoints} pts
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#ffedd5]">
          <span className="text-[#64748b]">Điểm hiện có của bạn:</span>
          <span className="font-extrabold text-[#0077b6]">{candidatePoints} pts</span>
        </div>
      </div>

      {/* Warning if Insufficient Points */}
      {isInsufficientPoints && (
        <div className="bg-[#fee2e2] border border-[#fca5a5] rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#dc2626] animate-in fade-in">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Không đủ điểm đặt phỏng vấn!</p>
            <p className="text-[11px] leading-relaxed mt-0.5">
              Bạn cần tối thiểu <strong>{requiredPoints} pts</strong> nhưng hiện chỉ có <strong>{candidatePoints} pts</strong> (thiếu {requiredPoints - candidatePoints} pts). Hãy hoàn thành các bài kiểm tra thử để tích lũy thêm điểm!
            </p>
          </div>
        </div>
      )}

      {/* Duration Summary */}
      <div className="bg-[#f0f7ff] border border-[#bae6fd] rounded-xl p-3 flex items-center justify-between text-xs text-[#0f172a] font-bold">
        <span className="flex items-center gap-1.5 text-[#0077b6]">
          <Clock size={14} />
          <span>Thời lượng phỏng vấn:</span>
        </span>
        <span className="bg-[#0077b6] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
          {durationMinutes || 0} phút
        </span>
      </div>

      {/* Message textarea */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#64748b] tracking-wide uppercase flex items-center gap-1.5">
          <MessageSquare size={12} className="text-[#0077b6]" />
          <span>Ghi chú gửi Interviewer</span>
        </label>
        <textarea
          className="min-h-[90px] w-full rounded-xl border border-[#e2e8f0] p-3 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0077b6] bg-white transition"
          placeholder="Nêu mong muốn, câu hỏi hoặc mục tiêu cho buổi phỏng vấn thử này..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-md bg-[#ff6b35] hover:bg-[#e85d04] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        disabled={isSubmitting || !durationMinutes || !selectedSkillIds.length || isInsufficientPoints}
      >
        {isSubmitting
          ? "Đang gửi yêu cầu..."
          : isInsufficientPoints
          ? `Cần thêm ${requiredPoints - candidatePoints} pts để đặt`
          : "Gửi Yêu Cầu Đặt Phỏng Vấn"}
      </button>
    </div>
  );
}

