import { Table, UserCog } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/ventas", label: "Panel de Visitas", icon: <Table /> },
    { to: "/guardao", label: "Panel Conf Vendedores", icon: <UserCog /> },
  ];

  return (
    <aside className="w-64 min-w-[16rem] max-w-[16rem] bg-gradient-to-b from-[#49af4e] to-[#1a9888] text-white min-h-screen py-6 px-4 shadow-2xl sticky top-0 transition-all duration-300">
      <div className="text-2xl font-bold mb-6 tracking-wide">Menú</div>
      <nav className="flex flex-col gap-4">
        {links.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-green-700 text-white font-semibold ring-2 ring-green-300"
                  : "text-green-100 hover:bg-green-700/50 hover:text-white"
              }`}
              title={label}
            >
              <span
                className={`text-xl ${
                  isActive
                    ? "text-white"
                    : "text-green-300 group-hover:text-white"
                }`}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
