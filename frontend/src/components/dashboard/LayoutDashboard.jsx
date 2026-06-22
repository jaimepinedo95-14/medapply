import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Íconos SVG inline para el sidebar
const Iconos = {
  inicio:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  perfil:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  lista:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  buscar:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  estrella:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  config:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  mas:       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  usuarios:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  grafica:   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  alerta:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  salir:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  menu:      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  cerrar:    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
};

// Definición de links del sidebar según el tipo de usuario
const LINKS = {
  candidato: [
    { ruta: "/candidato/dashboard",      etiqueta: "Inicio",            icono: Iconos.inicio },
    { ruta: "/candidato/perfil",         etiqueta: "Mi perfil",         icono: Iconos.perfil },
    { ruta: "/candidato/postulaciones",  etiqueta: "Mis postulaciones", icono: Iconos.lista },
    { ruta: "/candidato/alertas",        etiqueta: "Alertas de empleo", icono: Iconos.alerta },
    { ruta: "/empleos",                  etiqueta: "Buscar empleos",    icono: Iconos.buscar },
    { ruta: "/candidato/suscripcion",    etiqueta: "Mi suscripción",    icono: Iconos.estrella },
    { ruta: "/candidato/configuracion",  etiqueta: "Configuración",     icono: Iconos.config },
  ],
  empresa: [
    { ruta: "/empresa/dashboard",        etiqueta: "Inicio",        icono: Iconos.inicio },
    { ruta: "/empresa/ofertas",          etiqueta: "Mis vacantes",  icono: Iconos.lista },
    { ruta: "/empresa/candidatos",       etiqueta: "Candidatos",    icono: Iconos.usuarios },
    { ruta: "/empresa/plan",             etiqueta: "Mi plan",       icono: Iconos.estrella },
  ],
};

function Sidebar({ tipo, menuAbierto, cerrarMenu }) {
  const { pathname } = useLocation();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const links = LINKS[tipo] || [];

  const manejarLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Overlay oscuro en móvil cuando el menú está abierto */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={cerrarMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-azul-marino z-40 flex flex-col transition-transform duration-300
          ${menuAbierto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-screen`}
      >
        {/* Logo en el sidebar */}
        <div className="px-5 py-5 border-b border-blue-800 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="w-7 h-7 bg-esmeralda rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold">+</span>
            </div>
            <span className="font-bold text-lg">
              <span className="text-esmeralda-claro">Med</span><span className="text-white">Apply</span>
            </span>
          </Link>
          {/* Botón cerrar en móvil */}
          <button onClick={cerrarMenu} className="md:hidden text-gray-400 hover:text-white">
            {Iconos.cerrar}
          </button>
        </div>

        {/* Datos del usuario */}
        <div className="px-5 py-4 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0
              ${tipo === "candidato" ? "bg-esmeralda" : "bg-blue-500"}`}>
              {usuario?.nombre?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{usuario?.nombre || "Usuario"}</p>
              <p className="text-blue-300 text-xs truncate">{usuario?.email || ""}</p>
            </div>
          </div>
        </div>

        {/* Links de navegación */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {links.map((link) => {
            const activo = pathname === link.ruta || pathname.startsWith(link.ruta + "/");
            return (
              <Link
                key={link.ruta}
                to={link.ruta}
                onClick={cerrarMenu}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-150
                  ${activo
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {activo && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-esmeralda-claro rounded-r-full" />
                )}
                {link.icono}
                {link.etiqueta}
              </Link>
            );
          })}
        </nav>

        {/* Botón cerrar sesión */}
        <div className="px-3 py-4 border-t border-blue-800">
          <button
            onClick={manejarLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            {Iconos.salir}
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

// Layout principal del dashboard — envuelve todas las páginas internas
export default function LayoutDashboard({ tipo }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar tipo={tipo} menuAbierto={menuAbierto} cerrarMenu={() => setMenuAbierto(false)} />

      {/* Área principal de contenido */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar móvil */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMenuAbierto(true)}
            className="text-azul-marino"
            aria-label="Abrir menú"
          >
            {Iconos.menu}
          </button>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-esmeralda rounded-md flex items-center justify-center mr-1.5">
              <span className="text-white font-bold text-xs">+</span>
            </div>
            <span className="font-bold text-base">
              <span className="text-esmeralda">Med</span><span className="text-azul-marino">Apply</span>
            </span>
          </div>
        </header>

        {/* Contenido de la página actual */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
