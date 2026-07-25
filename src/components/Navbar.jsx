import { Menu } from "lucide-react";
import NotificationBell from "./notifications/NotificationBell";

function Navbar({ onMenuClick }) {
  return (
    <nav className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs px-6 flex items-center justify-between sticky top-0 z-30">
      <button
        type="button"
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-[#f0f7ff] hover:text-[#0077b6] lg:hidden transition-colors cursor-pointer"
        title="Mở thanh điều hướng"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 flex justify-end">
        <NotificationBell />
      </div>
    </nav>
  );
}

export default Navbar;
