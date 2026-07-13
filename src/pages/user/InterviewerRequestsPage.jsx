import BookingList from "@/components/bookings/BookingList";
import InterviewHeader from "@/components/interview/common/InterviewHeader";
import { useAuth } from "@/hooks/auth/useAuth";

export default function InterviewerRequestsPage() {
  const { data: user } = useAuth();

  return (
    <div className="space-y-6">
      <InterviewHeader
        title="List Requests"
        description="Review candidate requests and accept the interviews you want to schedule."
      />
      <BookingList user={user} mode="requests" />
    </div>
  );
}
