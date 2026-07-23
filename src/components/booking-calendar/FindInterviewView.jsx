import { useState } from "react";
import {
  Star,
  Briefcase,
  ChevronRight,
  SearchX,
  Loader2,
  Award,
} from "lucide-react";

import SubCategoryTag from "@/components/common/SubCategoryTag";
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
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <SearchFilterPanel
          onSearch={handleSearch}
          placeholder="Tìm theo tên Interviewer, chức danh hoặc kỹ năng..."
        />
      </div>

      {/* Results Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="animate-spin text-[#0077b6]" size={36} />
          <p className="text-sm text-slate-400 font-medium">
            Đang tìm kiếm Interviewer cho bạn...
          </p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <SearchX size={28} className="text-slate-400" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-base">
              Không tìm thấy Interviewer nào
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục kỹ năng.
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500 font-bold px-1">
            Tìm thấy {data?.totalElements ?? profiles.length} Interviewer
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
      className="group relative text-left bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md hover:border-[#0077b6]/30 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0077b6] to-[#1e6091] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

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
              <span className="absolute -bottom-1.5 -right-1.5 bg-[#0077b6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {profile.yearsExperience}y
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">
              {profile.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {profile.interviewerName}
              {profile.company ? (
                <>
                  {" "}
                  <span className="text-slate-300">·</span>{" "}
                  <span className="text-[#0077b6] font-medium">{profile.company}</span>
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
                {totalRatings} đánh giá
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
              <SubCategoryTag key={item.id} name={item.name} size="sm" />
            ))}
            {profile.subcategories.length > 4 && (
              <span className="text-[11px] font-semibold bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd] px-2 py-0.5 rounded-lg">
                +{profile.subcategories.length - 4} khác
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-[#64748b]">
          {profile.yearsExperience != null && (
            <span className="flex items-center gap-1 font-medium">
              <Briefcase size={11} className="text-[#0077b6]" />
              {profile.yearsExperience} năm KN
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#d97706] bg-[#fef3c7] border border-[#fde68a] px-2 py-0.5 rounded-lg">
            <Award size={12} />
            {profile.pointsRequired || 10} pts
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0077b6] group-hover:gap-1.5 transition-all">
          Đặt phỏng vấn <ChevronRight size={12} />
        </span>
      </div>
    </button>
  );
}
