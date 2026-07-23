import { groupByCategory } from "@/components/interview/common/interviewUtils";

export default function SkillGroupSelector({ skills, selectedIds, onToggle }) {
  const groups = groupByCategory(skills);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
        <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wide">Kỹ Năng Đủ Điều Kiện Đánh Giá</h4>
        <span className="text-xs font-bold text-[#0077b6] bg-[#f0f7ff] px-2.5 py-0.5 rounded-full border border-[#bae6fd]">
          Đã chọn {selectedIds.length}/5
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {Object.entries(groups).map(([categoryName, items]) => (
          <section key={categoryName} className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-2xs space-y-2">
            <h5 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">{categoryName}</h5>
            <div className="flex flex-wrap gap-2 pt-1">
              {items.map((item) => {
                const checked = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggle(item.id)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                      checked
                        ? "border-[#0077b6] bg-[#0077b6] text-white shadow-xs"
                        : "border-[#bae6fd] bg-[#f0f7ff] text-[#0077b6] hover:bg-[#e0f2fe]"
                    }`}
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
