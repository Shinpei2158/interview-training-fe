import InterviewHeader from "@/components/interview/common/InterviewHeader";
import MyProfileView from "@/components/interview-profile/MyProfileView";
import { useAuth } from "@/hooks/auth/useAuth";

export default function InterviewerProfilePage() {
  const { data: user } = useAuth();

  return (
    <div className="space-y-6">
      <InterviewHeader
        title="My Profile"
        description="Configure your public interviewer profile, skill coverage, and weekly availability."
      />
      <MyProfileView user={user} />
    </div>
  );
}
