import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotificaciones } from "../../context/NotificacionesContext";

const LINKS_NAV = [
  { href: "/empleos",      label: "Buscar empleos" },
  { href: "/salarios",     label: "Salarios" },
  { href: "/para-empresas", label: "Para empresas" },
];

const PANEL_POR_ROL = {
  candidato:  "/candidato/dashboard",
  empresa:    "/empresa/dashboard",
  moderador:  "/moderador/ofertas",
  admin:      "/admin/dashboard",
  superadmin: "/admin/dashboard",
};

const PERFIL_POR_ROL = {
  candidato:  "/candidato/perfil",
  empresa:    "/empresa/configuracion",
  moderador:  "/moderador/ofertas",
  admin:      "/admin/usuarios",
  superadmin: "/admin/usuarios",
};

const SUSCRIPCION_POR_ROL = {
  candidato: "/candidato/suscripcion",
  empresa:   "/empresa/suscripcion",
};

function obtenerIniciales(nombre = "") {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

// ── Ícono campana ────────────────────────────────────────────────────────────
function IconoCampana() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function IconoMenu() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconoCerrar() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── Dropdown usuario autenticado ─────────────────────────────────────────────
function AvatarDropdown({ usuario, logout }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const panel      = PANEL_POR_ROL[usuario.rol] || "/";
  const perfil     = PERFIL_POR_ROL[usuario.rol] || "/";
  const suscripcion = SUSCRIPCION_POR_ROL[usuario.rol];
  const iniciales  = obtenerIniciales(usuario.nombre);

  const cerrar = () => setAbierto(false);
  const salir  = () => { cerrar(); logout(); navigate("/"); };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAbierto((p) => !p)}
        className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        {usuario.foto ? (
          <img src={usuario.foto} alt={usuario.nombre}
            className="w-8 h-8 rounded-full object-cover border-2 border-esmeralda" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-azul-marino flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{iniciales}</span>
          </div>
        )}
        <span className="text-sm font-semibold text-azul-marino max-w-[100px] truncate hidden sm:block">
          {usuario.nombre.split(" ")[0]}
        </span>
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${abierto ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {abierto && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          {/* Info usuario */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-azul-marino truncate">{usuario.nombre}</p>
            <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-esmeralda/10 text-esmeralda capitalize">
              {usuario.rol}
            </span>
          </div>

          {/* Opciones */}
          <Link to={perfil} onClick={cerrar}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-azul-marino transition-colors">
            <span className="text-base">👤</span> Mi perfil
          </Link>
          <Link to={panel} onClick={cerrar}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-azul-marino transition-colors">
            <span className="text-base">🏠</span> Mi panel
          </Link>
          {suscripcion && (
            <Link to={suscripcion} onClick={cerrar}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-azul-marino transition-colors">
              <span className="text-base">⭐</span> Mi suscripción
            </Link>
          )}
          <Link to="/notificaciones" onClick={cerrar}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-azul-marino transition-colors">
            <span className="text-base">🔔</span> Notificaciones
          </Link>
          {(usuario.rol === "candidato" || usuario.rol === "empresa") && (
            <Link to="/mensajes" onClick={cerrar}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-azul-marino transition-colors">
              <span className="text-base">💬</span> Mensajes
            </Link>
          )}

          <hr className="my-1 border-gray-100" />
          <button onClick={salir}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
            <span className="text-base">🚪</span> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

// ── Campana con badge ────────────────────────────────────────────────────────
function BotoneroCampana() {
  const { noLeidas } = useNotificaciones();
  return (
    <Link to="/notificaciones"
      className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-azul-marino transition-colors">
      <IconoCampana />
      {noLeidas > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
          {noLeidas > 9 ? "9+" : noLeidas}
        </span>
      )}
    </Link>
  );
}

// ── Navbar principal ─────────────────────────────────────────────────────────
export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { noLeidas } = useNotificaciones();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="bg-white shadow-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-esmeralda rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-baseline">
                <span className="text-azul-marino font-bold text-xl">Med</span>
                <span className="text-esmeralda-claro font-light text-xl">Apply</span>
              </div>
              <span className="text-gray-900 text-xs tracking-widest">CONECTAMOS TALENTO EN SALUD</span>
            </div>
          </Link>

          {/* Links centrales — escritorio */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {LINKS_NAV.map((l) => (
              <Link key={l.href} to={l.href}
                className="relative text-gray-600 hover:text-azul-marino font-medium transition-colors text-sm px-3 py-2 rounded-lg hover:bg-gray-50 group">
                {l.label}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-esmeralda scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Acciones derecha — escritorio */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {usuario ? (
              <>
                <BotoneroCampana />
                <AvatarDropdown usuario={usuario} logout={logout} />
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-azul-marino font-semibold hover:text-azul-claro transition-colors text-sm px-3 py-2">
                  Iniciar sesión
                </Link>
                <Link to="/registro/candidato" className="btn-outline text-sm py-2 px-4">
                  Soy candidato
                </Link>
                <Link to="/registro/empresa" className="btn-primario text-sm py-2 px-4">
                  Soy empresa
                </Link>
              </>
            )}
          </div>

          {/* Botones móvil: campana (si logueado) + hamburguesa */}
          <div className="md:hidden flex items-center gap-1 ml-auto">
            {usuario && (
              <Link to="/notificaciones"
                className="relative p-2 rounded-full text-gray-600">
                <IconoCampana />
                {noLeidas > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {noLeidas > 9 ? "9+" : noLeidas}
                  </span>
                )}
              </Link>
            )}
            {!usuario && (
              <>
                <Link to="/login"
                  className="border border-esmeralda text-esmeralda text-sm px-3 py-1 rounded-lg whitespace-nowrap transition-colors hover:bg-esmeralda/5">
                  Iniciar sesión
                </Link>
                <Link to="/registro/candidato"
                  className="bg-esmeralda hover:bg-esmeralda-hover text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap transition-colors">
                  Registrarse
                </Link>
              </>
            )}
            <button onClick={() => setMenuAbierto((p) => !p)}
              className="text-azul-marino p-2" aria-label="Abrir menú">
              {menuAbierto ? <IconoCerrar /> : <IconoMenu />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-1">
            {LINKS_NAV.map((l) => (
              <Link key={l.href} to={l.href} onClick={cerrarMenu}
                className="text-gray-700 hover:text-azul-marino font-medium py-2.5 px-2 rounded-lg hover:bg-gray-50">
                {l.label}
              </Link>
            ))}

            <hr className="border-gray-200 my-2" />

            {usuario ? (
              <>
                {/* Info usuario móvil */}
                <div className="flex items-center gap-3 px-2 py-2 mb-1">
                  {usuario.foto ? (
                    <img src={usuario.foto} alt={usuario.nombre}
                      className="w-9 h-9 rounded-full object-cover border-2 border-esmeralda" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-azul-marino flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{obtenerIniciales(usuario.nombre)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-azul-marino text-sm truncate">{usuario.nombre}</p>
                    <p className="text-xs text-gray-500 capitalize">{usuario.rol}</p>
                  </div>
                </div>
                <Link to={PERFIL_POR_ROL[usuario.rol] || "/"} onClick={cerrarMenu}
                  className="text-gray-700 hover:text-azul-marino py-2.5 px-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <span>👤</span> Mi perfil
                </Link>
                <Link to={PANEL_POR_ROL[usuario.rol] || "/"} onClick={cerrarMenu}
                  className="text-gray-700 hover:text-azul-marino py-2.5 px-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <span>🏠</span> Mi panel
                </Link>
                {SUSCRIPCION_POR_ROL[usuario.rol] && (
                  <Link to={SUSCRIPCION_POR_ROL[usuario.rol]} onClick={cerrarMenu}
                    className="text-gray-700 hover:text-azul-marino py-2.5 px-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <span>⭐</span> Mi suscripción
                  </Link>
                )}
                {(usuario.rol === "candidato" || usuario.rol === "empresa") && (
                  <Link to="/mensajes" onClick={cerrarMenu}
                    className="text-gray-700 hover:text-azul-marino py-2.5 px-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <span>💬</span> Mensajes
                  </Link>
                )}
                <button onClick={() => { cerrarMenu(); logout(); }}
                  className="w-full text-left text-red-500 hover:text-red-600 py-2.5 px-2 rounded-lg hover:bg-red-50 flex items-center gap-2 mt-1">
                  <span>🚪</span> Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={cerrarMenu}
                  className="text-azul-marino font-semibold py-2.5 px-2 rounded-lg hover:bg-gray-50">
                  Iniciar sesión
                </Link>
                <Link to="/registro/candidato" onClick={cerrarMenu} className="btn-outline text-center py-2.5 mt-1">
                  Soy candidato
                </Link>
                <Link to="/registro/empresa" onClick={cerrarMenu} className="btn-primario text-center py-2.5 mt-1">
                  Soy empresa
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
