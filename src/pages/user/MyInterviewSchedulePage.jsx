import BookingList from "@/components/bookings/BookingList";
import InterviewHeader from "@/components/interview/common/InterviewHeader";
import { useAuth } from "@/hooks/auth/useAuth";

export default function MyInterviewSchedulePage() {
  const { data: user } = useAuth();

  return (
    <div className="space-y-6">
      <InterviewHeader
        title="Lịch Phỏng Vấn Của Tôi"
        description="Các buổi phỏng vấn đã được chấp nhận sẽ hiển thị tại đây. Khi đến giờ hẹn, bạn có thể tham gia phòng phỏng vấn trực tuyến."
      />
      <BookingList user={user} mode="schedule" />
    </div>
  );
}
