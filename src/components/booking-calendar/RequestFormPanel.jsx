import { groupByCategory } from "@/components/interview/common/interviewUtils";
import { Clock, MessageSquare, Award } from "lucide-react";

export default function RequestFormPanel({
  profile,
  selectedSkillIds,
  setSelectedSkillIds,
  durationMinutes,
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

  return (
    <div className="space-y-5 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
      {/* Skill Selection Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
          <Award size={14} className="text-indigo-600" />
          <span>Selected Skills</span>
        </h4>
        <div className="space-y-3">
          {Object.entries(groups).map(([categoryName, skills]) => (
            <section
              key={categoryName}
              className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm"
            >
              <h5 className="text-xs font-bold text-slate-600 mb-2">
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
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all font-medium ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300"
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

      {/* Duration Summary */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-950 font-semibold shadow-sm">
        <span className="flex items-center gap-1.5 text-indigo-700">
          <Clock size={14} />
          <span>Duration:</span>
        </span>
        <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
          {durationMinutes || 0} mins
        </span>
      </div>

      {/* Message textarea */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
          <MessageSquare size={12} className="text-slate-400" />
          <span>Note for interviewer</span>
        </label>
        <textarea
          className="min-h-[100px] w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition"
          placeholder="State your expectations, goals or questions for this mock interview session..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
        disabled={isSubmitting || !durationMinutes || !selectedSkillIds.length}
      >
        {isSubmitting ? "Sending Request..." : "Submit Booking Request"}
      </button>
    </div>
  );
}
