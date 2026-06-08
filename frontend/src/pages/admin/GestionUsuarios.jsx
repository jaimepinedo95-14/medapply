// Gestión de usuarios — el superadmin puede cambiar roles; admin solo activa/desactiva
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ROLES_DISPONIBLES = [
  { valor: "candidato",  etiqueta: "Candidato",   color: "bg-blue-100 text-blue-700"   },
  { valor: "empresa",    etiqueta: "Empresa",      color: "bg-teal-100 text-teal-700"   },
  { valor: "moderador",  etiqueta: "Moderador",    color: "bg-purple-100 text-purple-700" },
  { valor: "admin",      etiqueta: "Admin",        color: "bg-orange-100 text-orange-700" },
  { valor: "superadmin", etiqueta: "Super Admin",  color: "bg-yellow-100 text-yellow-700" },
];

const USUARIOS_DEMO = [
  { id: 1, nombre: "Juan Pérez López",    email: "juan@email.com",    categoria: "Médico general",    ciudad: "Bogotá",       plan: "Gratuito",  rol: "candidato",  activo: true,  registro: "2026-05-10" },
  { id: 2, nombre: "María Sofía Ruiz",   email: "maria@email.com",   categoria: "Enfermero/a",       ciudad: "Medellín",     plan: "Destacado", rol: "candidato",  activo: true,  registro: "2026-05-15" },
  { id: 3, nombre: "Carlos Rodríguez",   email: "carlos@email.com",  categoria: "Aux. enfermería",   ciudad: "Cali",         plan: "Gratuito",  rol: "candidato",  activo: false, registro: "2026-05-20" },
  { id: 4, nombre: "Clínica San Rafael", email: "admin@clinica.co",  categoria: "Empresa",           ciudad: "Bogotá",       plan: "Premium",   rol: "empresa",    activo: true,  registro: "2026-05-22" },
  { id: 5, nombre: "Andrés Vargas",      email: "andres@email.com",  categoria: "Bacteriólogo/a",    ciudad: "Bogotá",       plan: "Gratuito",  rol: "candidato",  activo: true,  registro: "2026-05-25" },
  { id: 6, nombre: "Laura Torres",       email: "laura@admin.co",    categoria: "Administración",    ciudad: "Bogotá",       plan: "—",         rol: "moderador",  activo: true,  registro: "2026-05-28" },
  { id: 7, nombre: "Ricardo Torres",     email: "rtorres@admin.co",  categoria: "Administración",    ciudad: "Bogotá",       plan: "—",         rol: "admin",      activo: true,  registro: "2026-06-01" },
  { id: 8, nombre: "Sandra López",       email: "sandra@email.com",  categoria: "Personal admin.",   ciudad: "Medellín",     plan: "Gratuito",  rol: "candidato",  activo: false, registro: "2026-06-03" },
  { id: 9, nombre: "EPS Coomeva",        email: "rrhh@coomeva.co",   categoria: "Empresa",           ciudad: "Cali",         plan: "Básico",    rol: "empresa",    activo: true,  registro: "2026-06-05" },
];

function BadgeRol({ rol }) {
  const def = ROLES_DISPONIBLES.find((r) => r.valor === rol) || ROLES_DISPONIBLES[0];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${def.color}`}>
      {def.etiqueta}
    </span>
  );
}

export default function GestionUsuarios() {
  const { tienePermiso } = useAuth();
  const puedeGestionarRoles = tienePermiso("gestionar_roles");

  const [usuarios, setUsuarios] = useState(USUARIOS_DEMO);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [modalRol, setModalRol] = useState(null); // usuario al que se cambia el rol
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const toggleActivo = (id) =>
    setUsuarios((p) => p.map((u) => u.id === id ? { ...u, activo: !u.activo } : u));

  const abrirModalRol = (usuario) => {
    setModalRol(usuario);
    setRolSeleccionado(usuario.rol);
    setConfirmado(false);
  };

  const aplicarCambioRol = () => {
    setUsuarios((p) => p.map((u) => u.id === modalRol.id ? { ...u, rol: rolSeleccionado } : u));
    setModalRol(null);
    setConfirmado(true);
  };

  const lista = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    const matchBus = !busqueda || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRol = filtroRol === "todos" || u.rol === filtroRol;
    const matchEst = filtroEstado === "todos" || (filtroEstado === "activos" && u.activo) || (filtroEstado === "inactivos" && !u.activo);
    return matchBus && matchRol && matchEst;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Gestión de usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">{usuarios.length} usuarios registrados en la plataforma.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            {usuarios.filter(u => u.activo).length} activos
          </span>
          <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
            {usuarios.filter(u => !u.activo).length} inactivos
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-esmeralda"
        />
        <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-esmeralda bg-white">
          <option value="todos">Todos los roles</option>
          {ROLES_DISPONIBLES.map((r) => (
            <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {["todos", "activos", "inactivos"].map((f) => (
            <button key={f} onClick={() => setFiltroEstado(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filtroEstado === f ? "bg-azul-marino text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold text-azul-marino">Usuario</th>
                <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden lg:table-cell">Ciudad</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Rol</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Plan</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lista.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-azul-marino">{u.nombre}</p>
                    <p className="text-gray-400 text-xs">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{u.ciudad}</td>
                  <td className="px-5 py-3 text-center">
                    <BadgeRol rol={u.rol} />
                  </td>
                  <td className="px-5 py-3 text-center hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      u.plan === "Destacado" || u.plan === "Premium" ? "bg-yellow-100 text-yellow-700"
                      : u.plan === "Básico" ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                    }`}>{u.plan}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>{u.activo ? "Activo" : "Inactivo"}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => toggleActivo(u.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          u.activo ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}>
                        {u.activo ? "Bloquear" : "Activar"}
                      </button>
                      {puedeGestionarRoles && (
                        <button onClick={() => abrirModalRol(u)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                          Rol
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lista.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-sm">No se encontraron usuarios con esos filtros.</p>
          </div>
        )}
      </div>

      {/* Modal cambio de rol */}
      {modalRol && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-azul-marino text-lg">Cambiar rol del usuario</h3>
              <p className="text-gray-500 text-sm mt-1">
                <strong>{modalRol.nombre}</strong> — {modalRol.email}
              </p>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">Selecciona el nuevo rol:</p>
              {ROLES_DISPONIBLES.map((r) => (
                <label key={r.valor}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    rolSeleccionado === r.valor ? "border-azul-marino bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <input type="radio" name="rol" value={r.valor} checked={rolSeleccionado === r.valor}
                    onChange={() => setRolSeleccionado(r.valor)} className="accent-azul-marino" />
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.color}`}>{r.etiqueta}</span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.valor === "candidato"  && "Acceso al panel de candidato"}
                      {r.valor === "empresa"    && "Acceso al panel de empresa"}
                      {r.valor === "moderador"  && "Solo modera ofertas pendientes"}
                      {r.valor === "admin"      && "Panel admin sin pagos ni configuración"}
                      {r.valor === "superadmin" && "Acceso total a la plataforma"}
                    </p>
                  </div>
                </label>
              ))}
              <div className="flex gap-3 mt-5">
                <button onClick={aplicarCambioRol}
                  disabled={rolSeleccionado === modalRol.rol}
                  className="flex-1 bg-azul-marino text-white font-semibold py-3 rounded-xl hover:bg-azul-claro transition-colors disabled:opacity-40">
                  Aplicar cambio
                </button>
                <button onClick={() => setModalRol(null)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast de éxito */}
      {confirmado && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50"
          onAnimationEnd={() => setConfirmado(false)}>
          ✅ Rol actualizado correctamente
        </div>
      )}
    </div>
  );
}
