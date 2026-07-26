import BookingList from "@/components/bookings/BookingList";
import InterviewHeader from "@/components/interview/common/InterviewHeader";
import { useAuth } from "@/hooks/auth/useAuth";

export default function MyInterviewSchedulePage() {
  const { data: user } = useAuth();

  return (
    <div className="space-y-6">
      <InterviewHeader
        title="Lịch Phỏng Vấn Của Tôi"
        description="Quản lý toàn bộ lịch phỏng vấn và yêu cầu của bạn: Đang chờ duyệt, Đã chấp nhận, Đã hoàn thành hoặc Từ chối."
      />
      <BookingList user={user} mode="schedule" />
    </div>
  );
}
