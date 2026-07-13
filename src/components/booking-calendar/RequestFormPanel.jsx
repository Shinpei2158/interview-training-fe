import { groupByCategory } from "@/components/interview/common/interviewUtils";

export default function RequestFormPanel({ profile, selectedSkillIds, setSelectedSkillIds, durationMinutes, message, setMessage, isSubmitting }) {
  const groups = groupByCategory(profile.subcategories || []);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-semibold">Selected skills</h4>
        <div className="space-y-3">
          {Object.entries(groups).map(([categoryName, skills]) => (
            <section key={categoryName} className="rounded-lg border p-3">
              <h5 className="text-sm font-medium text-slate-700">{categoryName}</h5>
              <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => setSelectedSkillIds((current) => current.includes(skill.id) ? current.filter((id) => id !== skill.id) : [...current, skill.id])}
                    className={`rounded-md border px-3 py-2 text-sm ${selectedSkillIds.includes(skill.id) ? "border-blue-500 bg-blue-50 text-blue-700" : "hover:bg-slate-50"}`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-700">
        Duration: <span className="font-semibold">{durationMinutes || 0} minutes</span>
      </div>
      <textarea className="min-h-20 w-full rounded-lg border px-3 py-2" placeholder="Message for the interviewer" value={message} onChange={(event) => setMessage(event.target.value)} />
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60" disabled={isSubmitting || !durationMinutes || !selectedSkillIds.length}>
        {isSubmitting ? "Sending..." : "Submit request"}
      </button>
    </div>
  );
}
