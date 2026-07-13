import { useAuth } from "@/hooks/auth/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";

export default function AdminDashboardPage() {
  const { data: user } = useAuth();
  const logoutMutation = useLogout();

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">Interview Training</p>
          <h1 className="dashboard__title">Practice categories</h1>
          {user?.email ? (
            <p className="dashboard__subtitle">Signed in as {user.email}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="dashboard__logout"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Signing out…" : "Sign out"}
        </button>
      </header>
    </div>
  );
}
