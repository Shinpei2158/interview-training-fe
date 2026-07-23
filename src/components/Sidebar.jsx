import { useEffect, useState, useMemo, useRef } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useLogout } from "../hooks/auth/useLogout";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  CalendarDays,
  ClipboardList,
  FileQuestion,
  LayoutDashboard,
  GraduationCap,
  BarChart3,
  Bookmark,
  MessageSquareText,
  Settings,
  UserRoundCog,
  Heart,
  ShieldCheck,
  Users,
  AlertTriangle,
  LogOut,
} from "lucide-react";

const SIDEBAR_MENU = [
  {
    title: "Bảng điều khiển",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["USER", "INTERVIEWER", "ADMIN"],
  },
  {
    title: "Bộ câu hỏi",
    icon: GraduationCap,
    roles: ["USER"],
    children: [
      { title: "Tất cả bộ đề", icon: FileQuestion, path: "/quiz" },
      { title: "Bộ đề yêu thích", icon: Heart, path: "/quiz/liked" },
      { title: "Tiến độ ôn tập", icon: BarChart3, path: "/my-progress" },
      { title: "Câu hỏi đã lưu", icon: Bookmark, path: "/quiz/saved" },
    ],
  },
  {
    title: "Phỏng vấn thử",
    icon: MessageSquareText,
    roles: ["USER"],
    children: [
      { title: "Tìm Interviewer", icon: UserRoundCog, path: "/interview" },
      { title: "Lịch phỏng vấn", icon: CalendarDays, path: "/interview/schedule" },
    ],
  },
  {
    title: "Dành cho Interviewer",
    icon: ClipboardList,
    roles: ["INTERVIEWER"],
    children: [
      { title: "Hồ sơ chuyên gia", icon: Settings, path: "/interviewer/profile" },
      {
        title: "Yêu cầu phỏng vấn",
        icon: ClipboardList,
        path: "/interviewer/requests",
      },
      { title: "Lịch làm việc", icon: CalendarDays, path: "/interviewer/schedule" },
    ],
  },
  {
    title: "Quản lý bộ câu hỏi",
    icon: GraduationCap,
    path: "/interviewer/quiz",
    roles: ["INTERVIEWER"],
  },
  {
    title: "Quản trị hệ thống",
    icon: ShieldCheck,
    roles: ["ADMIN"],
    children: [
      { title: "Tổng quan hệ thống", icon: BarChart3, path: "/admin/dashboard" },
      { title: "Quản lý người dùng", icon: Users, path: "/admin/users" },
      { title: "Quản lý bộ câu hỏi", icon: GraduationCap, path: "/admin/quizzes" },
      { title: "Xử lý sự cố & vi phạm", icon: AlertTriangle, path: "/admin/reports" },
    ],
  },
];

const isChildActive = (childPath, currentPath, siblings = []) => {
  if (currentPath === childPath) return true;

  if (
    childPath !== "/" &&
    (currentPath.startsWith(childPath + "/") || currentPath.startsWith(childPath))
  ) {
    const hasMoreSpecificSibling = siblings.some((s) => {
      if (s.path === childPath) return false;
      if (currentPath === s.path) return true;
      if (
        s.path !== "/" &&
        (currentPath.startsWith(s.path + "/") || currentPath.startsWith(s.path))
      ) {
        return s.path.length > childPath.length;
      }
      return false;
    });

    return !hasMoreSpecificSibling;
  }

  return false;
};

export default function Sidebar({ user, collapsed, setCollapsed }) {
  const { pathname } = useLocation();
  const logoutMutation = useLogout();
  const flyoutTimerRef = useRef(null);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const filteredMenu = useMemo(() => {
    return SIDEBAR_MENU.filter(
      (item) => !item.roles || item.roles.includes(user?.role),
    );
  }, [user?.role]);

  const [openMenus, setOpenMenus] = useState({
    "Bộ câu hỏi": false,
    "Phỏng vấn thử": false,
    "Dành cho Interviewer": false,
    "Quản trị hệ thống": false,
  });

  const [activeFlyout, setActiveFlyout] = useState(null);

  useEffect(() => {
    setOpenMenus((prev) => {
      const nextState = { ...prev };
      filteredMenu.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child) =>
            isChildActive(child.path, pathname, item.children),
          );
          if (hasActiveChild) {
            nextState[item.title] = true;
          }
        }
      });
      return nextState;
    });
  }, [pathname, filteredMenu]);

  const toggleSubMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleParentClick = (title) => {
    if (collapsed) {
      if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
      setActiveFlyout((current) => (current === title ? null : title));
    } else {
      toggleSubMenu(title);
    }
  };

  const handleMouseEnterItem = (title) => {
    if (!collapsed) return;
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    setActiveFlyout(title);
  };

  const handleMouseLeaveItem = () => {
    if (!collapsed) return;
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    flyoutTimerRef.current = setTimeout(() => {
      setActiveFlyout(null);
    }, 250); // 250ms safe buffer zone for mouse movement
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200/80 transition-all duration-300 z-40 shadow-xs flex flex-col ${
        collapsed ? "w-20 overflow-visible" : "w-72"
      }`}
    >
      {/* Logo Header */}
      <div className="h-20 px-5 border-b border-slate-200/80 flex items-center justify-between shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077b6] to-[#1e6091] flex items-center justify-center shadow-xs">
              <Code2 className="w-5 h-5 text-white" />
            </div>

            <span className="font-bold text-xl text-[#0f172a]">
              DevPrep <span className="text-[#0077b6]">AI</span>
            </span>
          </div>
        )}

        <button
          onClick={() => {
            if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
            setCollapsed(!collapsed);
            setActiveFlyout(null);
          }}
          title={collapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
          className="p-2 rounded-lg text-slate-500 hover:bg-[#f0f7ff] hover:text-[#0077b6] transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className={`p-4 space-y-2 flex-1 custom-scrollbar ${collapsed ? "overflow-visible" : "overflow-y-auto"}`}>
        {filteredMenu.map((item) => {
          const hasChildren = !!item.children;

          if (!hasChildren) {
            return (
              <NavLink
                key={item.title}
                to={item.path}
                onClick={() => {
                  if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
                  setActiveFlyout(null);
                }}
                title={collapsed ? item.title : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    collapsed ? "justify-center" : "gap-3"
                  } px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-[#f0f7ff] text-[#0077b6] font-semibold border-l-4 border-[#0077b6] shadow-2xs"
                      : "text-slate-600 hover:bg-[#f0f7ff] hover:text-[#0077b6]"
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          }

          const isMenuActive = item.children.some((child) =>
            isChildActive(child.path, pathname, item.children),
          );

          const isFlyoutOpen = collapsed && activeFlyout === item.title;

          return (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => handleMouseEnterItem(item.title)}
              onMouseLeave={handleMouseLeaveItem}
            >
              <button
                type="button"
                onClick={() => handleParentClick(item.title)}
                title={collapsed ? item.title : undefined}
                className={`w-full flex items-center ${
                  collapsed ? "justify-center" : "justify-between"
                } px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isMenuActive
                    ? "bg-[#f0f7ff] text-[#0077b6] font-semibold"
                    : "text-slate-600 hover:bg-[#f0f7ff] hover:text-[#0077b6]"
                }`}
              >
                <div
                  className={`flex items-center ${collapsed ? "" : "gap-3"}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </div>

                {!collapsed && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMenus[item.title] ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Expanded mode sub-menu */}
              {!collapsed && openMenus[item.title] && (
                <div className="mt-1 ml-6 space-y-1 border-l-2 border-[#e2e8f0] pl-2 animate-in fade-in duration-150">
                  {item.children.map((child) => {
                    const active = isChildActive(
                      child.path,
                      pathname,
                      item.children,
                    );
                    return (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          active
                            ? "bg-[#f0f7ff] text-[#0077b6] font-semibold"
                            : "text-slate-500 hover:bg-[#f0f7ff] hover:text-[#0077b6]"
                        }`}
                      >
                        <child.icon className="w-4 h-4 shrink-0 text-[#0077b6]" />
                        <span>{child.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}

              {/* Collapsed mode floating flyout dropdown with zero-gap mouse bridge & buffer zone */}
              {isFlyoutOpen && (
                <div
                  className="absolute left-full top-0 pl-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={() => handleMouseEnterItem(item.title)}
                  onMouseLeave={handleMouseLeaveItem}
                >
                  <div className="w-56 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-2.5 space-y-1">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1 flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-[#0077b6]" />
                      <p className="text-xs font-bold text-[#0f172a]">{item.title}</p>
                    </div>
                    {item.children.map((child) => {
                      const active = isChildActive(
                        child.path,
                        pathname,
                        item.children,
                      );
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => {
                            if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
                            setActiveFlyout(null);
                          }}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            active
                              ? "bg-[#f0f7ff] text-[#0077b6] font-bold"
                              : "text-slate-600 hover:bg-[#f0f7ff] hover:text-[#0077b6]"
                          }`}
                        >
                          <child.icon className="w-4 h-4 text-[#0077b6] shrink-0" />
                          <span>{child.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section at Bottom */}
      {user && (
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/60 shrink-0">
          {!collapsed ? (
            <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-100/80 transition-colors">
              <Link
                to="/profile"
                className="flex items-center gap-3 min-w-0 flex-1 group"
              >
                <img
                  src={user?.avatarUrl || "https://via.placeholder.com/40"}
                  alt={user?.username || "Avatar"}
                  className="w-10 h-10 rounded-full object-cover border border-[#e2e8f0] shrink-0 group-hover:border-[#0077b6] transition-colors"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-[#0f172a] truncate group-hover:text-[#0077b6] transition-colors">
                    {user?.username}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                title="Đăng xuất"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <Link to="/profile" title={`${user?.username} (${user?.email})`}>
                <img
                  src={user?.avatarUrl || "https://via.placeholder.com/40"}
                  alt={user?.username || "Avatar"}
                  className="w-10 h-10 rounded-full object-cover border border-[#e2e8f0] hover:border-[#0077b6] transition-colors"
                />
              </Link>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                title="Đăng xuất"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
