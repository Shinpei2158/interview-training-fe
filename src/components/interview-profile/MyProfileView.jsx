import { useMyInterviewProfile } from "@/hooks/interview/useInterviewApi";
import ProfileEditor from "./ProfileEditor";

export default function MyProfileView({ user }) {
  const { data: profile, isLoading } = useMyInterviewProfile(user);

  if (isLoading) return <section className="rounded-lg border bg-white p-5 text-sm text-slate-500">Loading profile...</section>;
  return <ProfileEditor key={profile?.id || "new-profile"} profile={profile} />;
}
