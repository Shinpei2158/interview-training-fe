import { useState } from "react";
import { Search, Star } from "lucide-react";

import { useInterviewProfiles } from "@/hooks/interview/useInterviewApi";
import RequestModal from "./RequestModal";

export default function FindInterviewView() {
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({ keyword: "" });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { data, isLoading } = useInterviewProfiles(filters);
  const profiles = data?.content || [];

  return (
    <section className="rounded-lg border bg-white p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold">Find Interview</h3>
          <p className="text-sm text-slate-500">Browse interviewer profiles and submit a request.</p>
        </div>
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); setFilters({ keyword }); }}>
          <input className="rounded-lg border px-3 py-2" placeholder="Search profiles" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          <button className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-slate-50" aria-label="Search"><Search size={18} /></button>
        </form>
      </div>
      {isLoading ? <p className="text-sm text-slate-500">Loading profiles...</p> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {profiles.map((profile) => (
            <button key={profile.id} type="button" className="rounded-lg border p-4 text-left hover:border-blue-300 hover:bg-blue-50/40" onClick={() => setSelectedProfile(profile)}>
              <div className="flex items-start gap-3">
                <img src={profile.avatarUrl || "/default-avatar.png"} alt={profile.interviewerName || "Interviewer"} className="h-11 w-11 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900">{profile.title}</h4>
                  <p className="text-sm text-slate-500">{profile.interviewerName}{profile.company ? ` · ${profile.company}` : ""}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Star size={16} className="text-amber-500" />{profile.averageRating?.toFixed(1)}</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-700">{profile.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.subcategories?.map((item) => <span key={item.id} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{item.name}</span>)}
              </div>
            </button>
          ))}
          {!profiles.length && <p className="text-sm text-slate-500">No interviewer profiles found.</p>}
        </div>
      )}
      {selectedProfile && <RequestModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}
    </section>
  );
}
