import { Moon, Sun, Table, UserCog } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const modoOscuro = localStorage.getItem("modoOscuro") === "true";
    setIsDark(modoOscuro);
    document.documentElement.classList.toggle("dark", modoOscuro);
  }, []);

  const toggleDarkMode = () => {
    const nuevoEstado = !isDark;
    setIsDark(nuevoEstado);
    document.documentElement.classList.toggle("dark", nuevoEstado);
    localStorage.setItem("modoOscuro", nuevoEstado ? "true" : "false");
  };

  const links = [
    { to: "/ventas", label: "Panel de Visitas", icon: <Table /> },
    { to: "/guardao", label: "Panel Conf Vendedores", icon: <UserCog /> },
  ];

  return (
    <aside className="w-64 min-w-[14rem] max-w-[14rem] bg-gradient-to-b from-[#49af4e] to-[#1a9888] text-white min-h-screen py-6 px-4 shadow-2xl sticky top-0 transition-all duration-300 flex flex-col">
      <div className="text-2xl font-bold mb-6 tracking-wide">Menú</div>
      <nav className="flex flex-col gap-4">
        {links.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex space-x-2 items-center py-3 px-4 rounded-lg transition-all duration-200 group ${
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

      {/* Botón modo oscuro */}
      <div className="mt-auto pt-6">
        <div className="border-t border-green-300/40 dark:border-green-100/20 pt-4">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-2 bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-md transition-colors"
          >
            <span className="text-sm font-medium">
              {isDark ? "Modo Claro" : "Modo Oscuro"}
            </span>
            <span className="text-lg">{isDark ? <Sun /> : <Moon />}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
