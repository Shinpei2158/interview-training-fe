import FindInterviewView from "@/components/booking-calendar/FindInterviewView";
import InterviewHeader from "@/components/interview/common/InterviewHeader";

export default function FindInterviewPage() {
  return (
    <div className="space-y-6">
      <InterviewHeader
        title="Tìm Kiếm Interviewer"
        description="Tìm kiếm người phỏng vấn và đặt lịch theo khung giờ rảnh thực tế của chuyên gia."
      />
      <FindInterviewView />
    </div>
  );
}
