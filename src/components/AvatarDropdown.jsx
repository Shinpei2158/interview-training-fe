import { useLogout } from "@/hooks/auth/useLogout";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function AvatarDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const logoutMutation = useLogout();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="overflow-hidden rounded-full border-2 border-gray-200 hover:border-blue-500 transition-all duration-200"
      >
        <img
          src={user?.avatarUrl || "https://via.placeholder.com/40"}
          alt="avatar"
          className="w-10 h-10 object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <p className="font-semibold text-gray-900">{user?.username}</p>

            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Profile
            </Link>

            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Settings
            </a>

            <div className="border-t my-1"></div>

            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            >
              {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarDropdown;
