import FindInterviewView from "@/components/booking-calendar/FindInterviewView";
import InterviewHeader from "@/components/interview/common/InterviewHeader";

export default function FindInterviewPage() {
  return (
    <div className="space-y-6">
      <InterviewHeader
        title="Find Interview"
        description="Find an interviewer and submit a request from their live availability calendar."
      />
      <FindInterviewView />
    </div>
  );
}
