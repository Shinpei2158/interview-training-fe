import { useAuth } from "@/hooks/auth/useAuth";
import UserDashboardView from "@/components/dashboard/UserDashboardView";
import InterviewerDashboardView from "@/components/dashboard/InterviewerDashboardView";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

export default function DashboardPage() {
  const { data: user } = useAuth();

  if (user?.role === "ADMIN") {
    return <AdminDashboardPage />;
  }

  if (user?.role === "INTERVIEWER") {
    return <InterviewerDashboardView user={user} />;
  }

  return <UserDashboardView user={user} />;
}

