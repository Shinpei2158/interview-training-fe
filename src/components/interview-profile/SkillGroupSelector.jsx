import { groupByCategory } from "@/components/interview/common/interviewUtils";

export default function SkillGroupSelector({ skills, selectedIds, onToggle }) {
  const groups = groupByCategory(skills);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">Qualified skills</h4>
        <span className="text-xs text-slate-500">{selectedIds.length}/5 selected</span>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {Object.entries(groups).map(([categoryName, items]) => (
          <section key={categoryName} className="rounded-lg border p-3">
            <h5 className="text-sm font-semibold text-slate-800">{categoryName}</h5>
            <div className="mt-2 flex flex-wrap gap-2">
              {items.map((item) => {
                const checked = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggle(item.id)}
                    className={`rounded-md border px-3 py-2 text-sm ${checked ? "border-blue-500 bg-blue-50 text-blue-700" : "hover:bg-slate-50"}`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
