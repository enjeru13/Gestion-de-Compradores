import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col rounded-tl-2xl shadow-inner bg-gray-50">
        <Navbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
        <main className="flex-1 p-4 overflow-auto min-w-0">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 overflow-x-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
