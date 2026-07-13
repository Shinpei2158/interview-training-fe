import BookingList from "@/components/bookings/BookingList";
import InterviewHeader from "@/components/interview/common/InterviewHeader";
import { useAuth } from "@/hooks/auth/useAuth";

export default function MyInterviewSchedulePage() {
  const { data: user } = useAuth();

  return (
    <div className="space-y-6">
      <InterviewHeader
        title="My Schedule"
        description="Accepted interviews appear here. At the scheduled time, both participants can enter the virtual room."
      />
      <BookingList user={user} mode="schedule" />
    </div>
  );
}
