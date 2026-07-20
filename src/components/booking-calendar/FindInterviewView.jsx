import { useState } from "react";
import {
  Star,
  Briefcase,
  Users,
  ChevronRight,
  SearchX,
  Loader2,
} from "lucide-react";

import { useInterviewProfiles } from "@/hooks/interview/useInterviewApi";
import SearchFilterPanel from "@/components/SearchFilterPanel";
import RequestModal from "./RequestModal";

export default function FindInterviewView() {
  const [filters, setFilters] = useState({ keyword: "", subCategoryIds: [] });
  const [selectedProfile, setSelectedProfile] = useState(null);

  const { data, isLoading } = useInterviewProfiles(filters);
  const profiles = data?.content || [];

  const handleSearch = ({ keyword, subCategoryIds }) => {
    setFilters({ keyword, subCategoryIds });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <SearchFilterPanel
          onSearch={handleSearch}
          placeholder="Search by interviewer name, title or skill..."
        />
      </div>

      {/* Results Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={36} />
          <p className="text-sm text-slate-400 font-medium">
            Finding interviewers for you...
          </p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <SearchX size={28} className="text-slate-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-base">
              No interviewers found
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search keywords or category filters.
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 font-medium px-1">
            {data?.totalElements ?? profiles.length} interviewer
            {(data?.totalElements ?? profiles.length) !== 1 ? "s" : ""} found
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => setSelectedProfile(profile)}
              />
            ))}
          </div>
        </>
      )}

      {selectedProfile && (
        <RequestModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}

function ProfileCard({ profile, onClick }) {
  const rating = profile.averageRating;
  const totalRatings = profile.totalRatings ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative text-left bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={profile.avatarUrl || "/default-avatar.png"}
              alt={profile.interviewerName || "Interviewer"}
              className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100"
            />
            {profile.yearsExperience != null && (
              <span className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {profile.yearsExperience}y
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-1">
              {profile.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {profile.interviewerName}
              {profile.company ? (
                <>
                  {" "}
                  <span className="text-slate-300">·</span>{" "}
                  <span className="text-indigo-500">{profile.company}</span>
                </>
              ) : null}
            </p>
          </div>

          {/* Rating badge */}
          {rating != null && (
            <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                <Star
                  size={12}
                  className="text-amber-500 fill-amber-500 flex-shrink-0"
                />
                <span className="text-xs font-bold text-amber-700">
                  {rating.toFixed(1)}
                </span>
              </span>
              <span className="text-[10px] text-slate-400">
                {totalRatings} review{totalRatings !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {profile.description && (
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {profile.description}
          </p>
        )}

        {/* Subcategory tags */}
        {profile.subcategories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.subcategories.slice(0, 4).map((item) => (
              <span
                key={item.id}
                className="text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
              >
                {item.name}
              </span>
            ))}
            {profile.subcategories.length > 4 && (
              <span className="text-[11px] text-slate-400 px-2 py-0.5">
                +{profile.subcategories.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {profile.yearsExperience != null && (
            <span className="flex items-center gap-1">
              <Briefcase size={11} />
              {profile.yearsExperience} yr
              {profile.yearsExperience !== 1 ? "s" : ""}
            </span>
          )}
          {totalRatings > 0 && (
            <span className="flex items-center gap-1">
              <Users size={11} />
              {totalRatings} interview{totalRatings !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 group-hover:gap-1.5 transition-all">
          Book <ChevronRight size={12} />
        </span>
      </div>
    </button>
  );
}
