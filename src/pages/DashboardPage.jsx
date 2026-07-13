import { useAuth } from "@/hooks/auth/useAuth";
import Statistic from "./user/Statistic";

export default function DashboardPage() {
  const { data: user } = useAuth();
  return (
    <div className="space-y-6">
      <Statistic user={user} />
    </div>
  );
}
