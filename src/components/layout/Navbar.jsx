import { CircleUserRound, LogOut } from "lucide-react";
import Logo from "../../assets/Logo.png";

export default function Navbar({
  nombreNegocio = "CristMedical",
  user = ('Angel'),
  onLogout = () => {},
}) {
  return (
    <header className="bg-gradient-to-r from-gray-50 to-white shadow-xl py-4 px-6 sm:px-8 flex items-center justify-between border-b border-gray-200 sticky top-0 z-50 rounded-b-xl">
      <div className="flex-1 min-w-[50px]"></div>

      <div className="flex items-center gap-3 flex-grow justify-center">
        <img src={Logo} alt="CristMedical Logo" className="h-14" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700">
          {nombreNegocio}
        </h1>
      </div>

      {user ? (
        <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
          <div className="flex items-center gap-2 bg-green-50 p-3 rounded-full shadow-inner">
            <CircleUserRound className="text-green-600 text-xl sm:text-2xl" />
            <span className="text-gray-800 font-semibold text-sm sm:text-base">
              {user.name || user.email || user}
            </span>
          </div>

          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-105 flex items-center gap-2 font-bold text-sm shadow-md whitespace-nowrap"
            aria-label="Cerrar sesión"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <span className="text-gray-400 italic text-sm flex-1 text-right">
          No autenticado
        </span>
      )}
    </header>
  );
}
