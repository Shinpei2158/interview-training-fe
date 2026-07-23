import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/auth/useAuth";

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { data: user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 relative overflow-x-hidden">
      {/* Subtle soft ambient background glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#0077b6]/05 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#1e6091]/05 rounded-full blur-[140px] pointer-events-none" />

      <Sidebar user={user} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`relative z-10 transition-all duration-300 ${collapsed ? "ml-20" : "ml-72"}`}>
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
