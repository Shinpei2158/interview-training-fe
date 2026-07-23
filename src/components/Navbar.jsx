import NotificationBell from "./notifications/NotificationBell";

function Navbar() {
  return (
    <nav className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs px-6 flex items-center justify-end gap-3 sticky top-0 z-30">
      <NotificationBell />
    </nav>
  );
}

export default Navbar;
