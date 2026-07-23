import { useMyInterviewProfile } from "@/hooks/interview/useInterviewApi";
import ProfileEditor from "./ProfileEditor";

export default function MyProfileView({ user }) {
  const { data: profile, isLoading } = useMyInterviewProfile(user);

  if (isLoading) return <section className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-sm font-medium text-slate-500 shadow-2xs">Đang tải hồ sơ chuyên gia...</section>;
  return <ProfileEditor key={profile?.id || "new-profile"} profile={profile} />;
}
