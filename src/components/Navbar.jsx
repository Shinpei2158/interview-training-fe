import { useAuth } from "@/hooks/auth/useAuth";
import AvatarDropdown from "./AvatarDropdown";
import NotificationBell from "./notifications/NotificationBell";

function Navbar() {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="h-16 bg-white border-b shadow-sm px-6 flex items-center justify-end gap-3">
      <NotificationBell />
      <AvatarDropdown user={user} />
    </nav>
  );
}

export default Navbar;
