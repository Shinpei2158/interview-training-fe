import InterviewHeader from "@/components/interview/common/InterviewHeader";
import MyProfileView from "@/components/interview-profile/MyProfileView";
import { useAuth } from "@/hooks/auth/useAuth";

export default function InterviewerProfilePage() {
  const { data: user } = useAuth();

  return (
    <div className="space-y-6">
      <InterviewHeader
        title="Hồ Sơ Chuyên Gia Phỏng Vấn"
        description="Cấu hình thông tin hồ sơ công khai, danh sách kỹ năng đánh giá chuyên môn, bằng cấp xác minh và lịch rảnh cố định theo tuần."
      />
      <MyProfileView user={user} />
    </div>
  );
}
