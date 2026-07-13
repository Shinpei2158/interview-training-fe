import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/auth/useAuth";

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { data: user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-20" : "ml-72"}`}>
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
