import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      <Sidebar />

      <div className="flex-1 flex flex-col rounded-tl-2xl shadow-inner bg-gray-50">
        <Navbar
          onToggleSidebar={() => setCollapsed(!collapsed)}
          user={user}
          onLogout={handleLogout}
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
