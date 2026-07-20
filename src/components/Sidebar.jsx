import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
} from "lucide-react";

const SIDEBAR_MENU = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["USER", "INTERVIEWER", "ADMIN"],
  },
  {
    title: "Quizzes",
    icon: GraduationCap,
    roles: ["USER"],
    children: [
      { title: "Browse", icon: FileQuestion, path: "/quiz" },
      { title: "Liked Quizzes", icon: Heart, path: "/quiz/liked" },
      { title: "Progress", icon: BarChart3, path: "/my-progress" },
      { title: "Saved Questions", icon: Bookmark, path: "/quiz/saved" },
    ],
  },
  {
    title: "Interview",
    icon: MessageSquareText,
    roles: ["USER"],
    children: [
      { title: "Find Interview", icon: UserRoundCog, path: "/interview" },
      { title: "My Schedule", icon: CalendarDays, path: "/interview/schedule" },
    ],
  },
  {
    title: "Interviewer",
    icon: ClipboardList,
    roles: ["INTERVIEWER"],
    children: [
      { title: "My Profile", icon: Settings, path: "/interviewer/profile" },
      {
        title: "List Requests",
        icon: ClipboardList,
        path: "/interviewer/requests",
      },
      { title: "Schedule", icon: CalendarDays, path: "/interviewer/schedule" },
    ],
  },
  {
    title: "Quiz",
    icon: GraduationCap,
    path: "/interviewer/quiz",
    roles: ["INTERVIEWER"],
  },
];

export default function Sidebar({ user, collapsed, setCollapsed }) {
  const { pathname } = useLocation();

  const [openMenus, setOpenMenus] = useState({
    Quizzes: false,
    Interview: false,
    Interviewer: false,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenMenus((prev) => ({
      ...prev,
      Quizzes: pathname.startsWith("/quiz"),
      Interview: pathname.startsWith("/interview"),
      Interviewer: pathname.startsWith("/interviewer") && !pathname.startsWith("/interviewer/quiz"),
    }));
  }, [pathname]);

  const toggleSubMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const filteredMenu = SIDEBAR_MENU.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r transition-all duration-300 z-40 ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Logo */}
      <div className="h-20 px-5 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-brand-600" />
            </div>

            <span className="font-bold text-xl">
              DevPrep <span className="text-brand-600">AI</span>
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {filteredMenu.map((item) => {
          const hasChildren = !!item.children;

          if (!hasChildren) {
            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          }

          const isMenuActive = item.children.some((child) =>
            pathname.startsWith(child.path),
          );

          return (
            <div key={item.title}>
              <button
                onClick={() => toggleSubMenu(item.title)}
                className={`w-full flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4 py-3 rounded-xl transition-all ${isMenuActive ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:bg-slate-100"}`}
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
                    className={`w-4 h-4 transition-transform ${openMenus[item.title] ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {!collapsed && openMenus[item.title] && (
                <div className="mt-1 ml-6 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? "bg-brand-50 text-brand-600 font-semibold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`
                      }
                    >
                      <child.icon className="w-4 h-4" />
                      <span>{child.title}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
