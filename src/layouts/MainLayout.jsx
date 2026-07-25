import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/auth/useAuth";

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 relative overflow-x-hidden">
      {/* Subtle soft ambient background glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#0077b6]/05 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#1e6091]/05 rounded-full blur-[140px] pointer-events-none" />

      {/* Backdrop overlay for mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-35 lg:hidden transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`relative z-10 transition-all duration-300 ml-0 ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
