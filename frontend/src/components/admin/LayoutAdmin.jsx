// Layout del panel administrativo — adapta navegación según rol del usuario
import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoIcono from "../common/LogoIcono";

// Definición de links por permiso requerido
const LINKS_ADMIN = [
  { ruta: "/admin/dashboard",       etiqueta: "Dashboard",            icono: "📊", permiso: "ver_dashboard" },
  { ruta: "/admin/usuarios",        etiqueta: "Usuarios",             icono: "👤", permiso: "gestionar_usuarios" },
  { ruta: "/admin/empresas",        etiqueta: "Empresas",             icono: "🏥", permiso: "gestionar_empresas" },
  { ruta: "/admin/ofertas",         etiqueta: "Ofertas",              icono: "📋", permiso: "gestionar_ofertas" },
  { ruta: "/admin/suscripciones",   etiqueta: "Suscripciones",        icono: "💳", permiso: "ver_pagos" },
  { ruta: "/admin/configuracion",   etiqueta: "Configuración",        icono: "⚙️", permiso: "configuracion_plataforma" },
];

const ETIQUETA_ROL = {
  admin:      { texto: "Admin",       color: "text-blue-400"   },
  superadmin: { texto: "Super Admin", color: "text-yellow-400" },
};

function SidebarAdmin({ menuAbierto, cerrarMenu }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { usuario, tienePermiso, logout } = useAuth();

  const etiqueta = ETIQUETA_ROL[usuario?.rol] || ETIQUETA_ROL.admin;
  const linksVisibles = LINKS_ADMIN.filter((l) => tienePermiso(l.permiso));

  return (
    <>
      {menuAbierto && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={cerrarMenu} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-40 flex flex-col transition-transform duration-300
        ${menuAbierto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-screen`}>

        {/* Logo + rol */}
        <div className="px-5 py-5 border-b border-gray-700 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <LogoIcono size={36} variant="dark" />
            <div>
              <span className="font-bold text-base">
                <span className="text-white">Med</span><span className="text-esmeralda-claro font-light">Apply</span>
              </span>
              <span className={`block text-xs leading-none font-semibold ${etiqueta.color}`}>
                {etiqueta.texto}
              </span>
            </div>
          </Link>
          <button onClick={cerrarMenu} className="md:hidden text-gray-500 hover:text-white">✕</button>
        </div>

        {/* Info del usuario logueado */}
        {usuario && (
          <div className="px-5 py-3 border-b border-gray-800">
            <p className="text-white text-sm font-semibold truncate">{usuario.nombre}</p>
            <p className="text-gray-400 text-xs truncate">{usuario.email}</p>
          </div>
        )}

        {/* Navegación filtrada por permisos */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {linksVisibles.map((link) => {
            const activo = pathname === link.ruta || pathname.startsWith(link.ruta + "/");
            return (
              <Link key={link.ruta} to={link.ruta} onClick={cerrarMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-colors
                  ${activo ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                <span>{link.icono}</span>
                {link.etiqueta}
              </Link>
            );
          })}
        </nav>

        {/* Salir */}
        <div className="px-3 py-4 border-t border-gray-700 space-y-1">
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400">
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default function LayoutAdmin() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { usuario } = useAuth();
  const etiqueta = ETIQUETA_ROL[usuario?.rol] || ETIQUETA_ROL.admin;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarAdmin menuAbierto={menuAbierto} cerrarMenu={() => setMenuAbierto(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar móvil */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMenuAbierto(true)} className="text-gray-700">☰</button>
          <span className="font-bold text-gray-800 text-sm">
            <span className="text-esmeralda">Med</span><span className="text-azul-marino">Apply</span>
            {" "}·{" "}
            <span className={`text-xs ${etiqueta.color}`}>{etiqueta.texto}</span>
          </span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
