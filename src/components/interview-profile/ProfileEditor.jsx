import { useMemo, useState } from "react";

import { useSaveMyInterviewProfile } from "@/hooks/interview/useInterviewApi";
import { useCategoryBrowse } from "@/hooks/useCategoryBrowse";
import { useToast } from "@/context/ToastContext";
import { defaultAvailability } from "@/components/interview/common/interviewUtils";
import AvailabilityGrid from "./AvailabilityGrid";
import SkillGroupSelector from "./SkillGroupSelector";

function flattenSubcategories(categories = []) {
  return categories.flatMap((category) => (category.subCategories || []).map((subCategory) => ({ ...subCategory, categoryName: category.name })));
}

export default function ProfileEditor({ profile }) {
  const { toast } = useToast();
  const { data: categories = [] } = useCategoryBrowse();
  const skills = useMemo(() => flattenSubcategories(categories), [categories]);
  const [form, setForm] = useState(() => ({
    title: profile?.title || "",
    company: profile?.company || "",
    yearsExperience: profile?.yearsExperience ?? "",
    languages: profile?.languages?.join(", ") || "",
    subcategoryIds: profile?.subcategories?.map((item) => item.id) || [],
    description: profile?.description || "",
    availabilities: profile?.availabilities?.length ? profile.availabilities : defaultAvailability(),
  }));

  const mutation = useSaveMyInterviewProfile();

  const toggleSkill = (id) => {
    setForm((current) => {
      const exists = current.subcategoryIds.includes(id);
      if (!exists && current.subcategoryIds.length >= 5) {
        toast.error("Choose up to 5 skills");
        return current;
      }
      return { ...current, subcategoryIds: exists ? current.subcategoryIds.filter((item) => item !== id) : [...current.subcategoryIds, id] };
    });
  };

  return (
    <section className="rounded-lg border bg-white p-5">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({
            title: form.title,
            company: form.company,
            yearsExperience: form.yearsExperience === "" ? null : Number(form.yearsExperience),
            languages: form.languages.split(",").map((language) => language.trim()).filter(Boolean),
            subcategoryIds: form.subcategoryIds,
            description: form.description,
            availabilities: form.availabilities,
          });
        }}
      >
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Profile title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded-lg border px-3 py-2" placeholder="Company" value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} />
          <input className="rounded-lg border px-3 py-2" min="0" max="80" type="number" placeholder="Years of experience" value={form.yearsExperience} onChange={(event) => setForm((current) => ({ ...current, yearsExperience: event.target.value }))} />
          <input className="rounded-lg border px-3 py-2" placeholder="Languages, comma separated" value={form.languages} onChange={(event) => setForm((current) => ({ ...current, languages: event.target.value }))} />
        </div>
        <SkillGroupSelector skills={skills} selectedIds={form.subcategoryIds} onToggle={toggleSkill} />
        <textarea className="min-h-28 w-full rounded-lg border px-3 py-2" placeholder="Describe what you can interview candidates on" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        <AvailabilityGrid value={form.availabilities} onChange={(availabilities) => setForm((current) => ({ ...current, availabilities }))} />
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}
