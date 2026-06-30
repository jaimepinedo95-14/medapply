// Layout del panel de moderación — solo para usuarios con rol moderador
import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoIcono from "../common/LogoIcono";

export default function LayoutModerador() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <>
        {menuAbierto && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMenuAbierto(false)} />}
        <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-40 flex flex-col transition-transform duration-300
          ${menuAbierto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-screen`}>

          {/* Logo + rol */}
          <div className="px-5 py-5 border-b border-gray-700 flex items-center justify-between">
            <Link to="/moderador/ofertas" className="flex items-center gap-2">
              <LogoIcono size={28} variant="dark" />
              <div>
                <span className="font-bold text-base">
                  <span className="text-white">Med</span><span className="text-esmeralda-claro font-light">Apply</span>
                </span>
                <span className="block text-purple-400 text-xs leading-none font-semibold">Moderador</span>
              </div>
            </Link>
            <button onClick={() => setMenuAbierto(false)} className="md:hidden text-gray-500 hover:text-white">✕</button>
          </div>

          {/* Info usuario */}
          {usuario && (
            <div className="px-5 py-3 border-b border-gray-800">
              <p className="text-white text-sm font-semibold truncate">{usuario.nombre}</p>
              <p className="text-gray-400 text-xs truncate">{usuario.email}</p>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 py-4 px-3">
            <Link to="/moderador/ofertas" onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white">
              <span>📋</span> Ofertas pendientes
            </Link>
            <Link to="/moderador/historial" onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white mt-1">
              <span>🗂</span> Historial
            </Link>
          </nav>

          {/* Salir */}
          <div className="px-3 py-4 border-t border-gray-700">
            <button onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400">
              <span>🚪</span> Cerrar sesión
            </button>
          </div>
        </aside>
      </>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMenuAbierto(true)} className="text-gray-700">☰</button>
          <span className="font-bold text-gray-800 text-sm">
            <span className="text-esmeralda">Med</span><span className="text-azul-marino">Apply</span>
            {" "}<span className="text-purple-600 text-xs">Moderador</span>
          </span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
