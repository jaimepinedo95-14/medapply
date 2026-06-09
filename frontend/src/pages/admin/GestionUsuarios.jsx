import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const ROLES_DISPONIBLES = [
  { valor: "candidato",  etiqueta: "Candidato",  color: "bg-blue-100 text-blue-700"    },
  { valor: "empresa",    etiqueta: "Empresa",     color: "bg-teal-100 text-teal-700"    },
  { valor: "moderador",  etiqueta: "Moderador",   color: "bg-purple-100 text-purple-700"},
  { valor: "admin",      etiqueta: "Admin",       color: "bg-orange-100 text-orange-700"},
  { valor: "superadmin", etiqueta: "Super Admin", color: "bg-yellow-100 text-yellow-700"},
];

function BadgeRol({ rol }) {
  const def = ROLES_DISPONIBLES.find((r) => r.valor === rol) || { etiqueta: rol, color: "bg-gray-100 text-gray-500" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${def.color}`}>
      {def.etiqueta}
    </span>
  );
}

// ── Modal de perfil de candidato ─────────────────────────────────────────────
function ModalPerfilCandidato({ usuario, onCerrar }) {
  const [perfil, setPerfil]     = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cvUrl, setCvUrl]       = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from("perfiles_candidato")
        .select("*")
        .eq("usuario_id", usuario.id)
        .maybeSingle();

      setPerfil(data || null);

      if (data?.hoja_de_vida_url) {
        const { data: signed } = await supabase.storage
          .from("cvs")
          .createSignedUrl(data.hoja_de_vida_url, 3600);
        if (signed?.signedUrl) setCvUrl(signed.signedUrl);
      }
      if (data?.video_presentacion_url) {
        const { data: signed } = await supabase.storage
          .from("videos")
          .createSignedUrl(data.video_presentacion_url, 3600);
        if (signed?.signedUrl) setVideoUrl(signed.signedUrl);
      }
      setCargando(false);
    }
    cargar().catch(() => setCargando(false));
  }, [usuario.id]);

  const exps = Array.isArray(perfil?.experiencias) ? perfil.experiencias : [];
  const edus = Array.isArray(perfil?.educaciones)  ? perfil.educaciones  : [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">

        {/* Header con foto prominente */}
        <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {perfil?.foto ? (
              <img
                src={perfil.foto}
                alt="Foto de perfil"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl flex-shrink-0">
                👤
              </div>
            )}
            <div>
              <h3 className="font-bold text-azul-marino text-lg leading-tight">{usuario.nombre}</h3>
              <p className="text-gray-400 text-sm">{usuario.email}</p>
              {perfil?.categoria_profesional && (
                <p className="text-esmeralda text-xs font-semibold mt-1">{perfil.categoria_profesional}</p>
              )}
            </div>
          </div>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-2xl flex-shrink-0">×</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {cargando ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !perfil ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-sm font-semibold text-gray-500">Este candidato aún no ha completado su perfil.</p>
            </div>
          ) : (
            <>
              {/* Datos de contacto y profesionales */}
              <div>
                <p className="text-xs font-bold text-azul-marino uppercase tracking-wide mb-2">Información</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Ciudad",               valor: perfil.ciudad },
                    { label: "Teléfono",             valor: perfil.telefono },
                    { label: "Categoría profesional",valor: perfil.categoria_profesional },
                    { label: "N.° Tarjeta / ReTHUS", valor: perfil.numero_tarjeta_profesional },
                    { label: "Perfil completado",    valor: perfil.porcentaje_perfil != null ? `${perfil.porcentaje_perfil}%` : null },
                  ].filter((f) => f.valor).map((f) => (
                    <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400">{f.label}</p>
                      <p className="font-semibold text-azul-marino text-sm mt-0.5">{f.valor}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experiencia laboral */}
              <div>
                <p className="text-xs font-bold text-azul-marino uppercase tracking-wide mb-2">Experiencia laboral</p>
                {exps.length === 0 ? (
                  <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                    No ha registrado experiencia laboral.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {exps.map((exp, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3">
                        <p className="font-semibold text-azul-marino text-sm">{exp.cargo}</p>
                        <p className="text-gray-500 text-xs">
                          {exp.empresa}{exp.ciudadExp ? ` · ${exp.ciudadExp}` : ""}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {exp.inicio} — {exp.esActual ? "Presente" : (exp.fin || "—")}
                        </p>
                        {exp.descripcion && (
                          <p className="text-gray-500 text-xs mt-1 leading-relaxed">{exp.descripcion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Educación */}
              <div>
                <p className="text-xs font-bold text-azul-marino uppercase tracking-wide mb-2">Educación</p>
                {edus.length === 0 ? (
                  <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                    No ha registrado información educativa.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {edus.map((edu, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3">
                        <p className="font-semibold text-azul-marino text-sm">{edu.titulo}</p>
                        <p className="text-gray-500 text-xs">
                          {edu.institucion}{edu.año ? ` · ${edu.año}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Documentos */}
              <div>
                <p className="text-xs font-bold text-azul-marino uppercase tracking-wide mb-2">Documentos</p>
                <div className="flex flex-wrap gap-3">
                  {cvUrl ? (
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-esmeralda text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      📄 Descargar hoja de vida
                    </a>
                  ) : perfil.hoja_de_vida_url ? (
                    <span className="flex items-center gap-2 bg-yellow-50 text-yellow-700 text-sm px-4 py-2.5 rounded-xl border border-yellow-200">
                      📄 HV subida — sin permisos de acceso
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 bg-gray-50 text-gray-400 text-sm px-4 py-2.5 rounded-xl">
                      📄 Sin hoja de vida subida
                    </span>
                  )}

                  {videoUrl ? (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-azul-marino text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      🎥 Ver video de presentación
                    </a>
                  ) : perfil.video_presentacion_url ? (
                    <span className="flex items-center gap-2 bg-yellow-50 text-yellow-700 text-sm px-4 py-2.5 rounded-xl border border-yellow-200">
                      🎥 Video subido — sin permisos de acceso
                    </span>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal de perfil de empresa ────────────────────────────────────────────────
function ModalPerfilEmpresa({ usuario, onCerrar }) {
  const [perfil, setPerfil]   = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase
      .from("perfiles_empresa")
      .select("*")
      .eq("usuario_id", usuario.id)
      .single()
      .then(({ data }) => { setPerfil(data || null); setCargando(false); })
      .catch(() => setCargando(false));
  }, [usuario.id]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {perfil?.logo ? (
              <img src={perfil.logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">🏥</div>
            )}
            <div>
              <h3 className="font-bold text-azul-marino text-lg">{usuario.nombre}</h3>
              <p className="text-gray-400 text-sm">{usuario.email}</p>
            </div>
          </div>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-2xl ml-4">×</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cargando ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : !perfil ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">🏥</p>
              <p className="text-sm">Esta empresa aún no ha completado su perfil.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Nombre empresa", valor: perfil.nombre_empresa },
                { label: "NIT",            valor: perfil.nit },
                { label: "Tipo",           valor: perfil.tipo_empresa },
                { label: "Ciudad",         valor: perfil.ciudad },
                { label: "Teléfono",       valor: perfil.telefono },
                { label: "Sitio web",      valor: perfil.sitio_web },
                { label: "Plan",           valor: perfil.plan },
              ].filter((f) => f.valor).map((f) => (
                <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{f.label}</p>
                  <p className="font-semibold text-azul-marino text-sm mt-0.5 capitalize">{f.valor}</p>
                </div>
              ))}
              {perfil.descripcion && (
                <div className="col-span-2 bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Descripción</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{perfil.descripcion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function GestionUsuarios() {
  const { tienePermiso, cambiarRolUsuario } = useAuth();
  const puedeGestionarRoles = tienePermiso("gestionar_roles");

  const [usuarios, setUsuarios]       = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState(null);
  const [busqueda, setBusqueda]       = useState("");
  const [filtroRol, setFiltroRol]     = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [modalRol, setModalRol]       = useState(null);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [toast, setToast]             = useState("");
  const [guardando, setGuardando]     = useState(false);
  const [modalPerfil, setModalPerfil] = useState(null);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setUsuarios(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  async function toggleActivo(usuario) {
    const nuevoActivo = !usuario.activo;
    setUsuarios((p) => p.map((u) => u.id === usuario.id ? { ...u, activo: nuevoActivo } : u));
    const { error: err } = await supabase.from("usuarios").update({ activo: nuevoActivo }).eq("id", usuario.id);
    if (err) {
      setUsuarios((p) => p.map((u) => u.id === usuario.id ? { ...u, activo: usuario.activo } : u));
      mostrarToast("❌ Error al actualizar estado");
    } else {
      mostrarToast(nuevoActivo ? "✅ Usuario activado" : "✅ Usuario bloqueado");
    }
  }

  async function aplicarCambioRol() {
    if (!modalRol || rolSeleccionado === modalRol.rol) return;
    setGuardando(true);
    try {
      await cambiarRolUsuario(modalRol.id, rolSeleccionado);
      setUsuarios((p) => p.map((u) => u.id === modalRol.id ? { ...u, rol: rolSeleccionado } : u));
      mostrarToast("✅ Rol actualizado correctamente");
    } catch (_) {
      mostrarToast("❌ Error al cambiar rol");
    } finally {
      setGuardando(false);
      setModalRol(null);
    }
  }

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const lista = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    const matchBus = !busqueda || u.nombre?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRol = filtroRol === "todos" || u.rol === filtroRol;
    const matchEst = filtroEstado === "todos"
      || (filtroEstado === "activos"   && u.activo)
      || (filtroEstado === "inactivos" && !u.activo);
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
            {usuarios.filter((u) => u.activo).length} activos
          </span>
          <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
            {usuarios.filter((u) => !u.activo).length} inactivos
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-esmeralda"
        />
        <select
          value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-esmeralda bg-white"
        >
          <option value="todos">Todos los roles</option>
          {ROLES_DISPONIBLES.map((r) => (
            <option key={r.valor} value={r.valor}>{r.etiqueta}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {["todos", "activos", "inactivos"].map((f) => (
            <button
              key={f} onClick={() => setFiltroEstado(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filtroEstado === f
                  ? "bg-azul-marino text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-500 font-semibold mb-2">Error al cargar usuarios</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button onClick={cargar} className="btn-primario text-sm py-2 px-5">Reintentar</button>
          </div>
        ) : lista.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-sm font-semibold text-gray-500">
              {usuarios.length === 0 ? "Aún no hay usuarios registrados." : "No se encontraron usuarios con esos filtros."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">Usuario</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Rol</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                  <th className="px-5 py-3 text-right font-semibold text-azul-marino hidden md:table-cell">Registro</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lista.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => ["candidato", "empresa"].includes(u.rol) ? setModalPerfil(u) : null}
                        className={`text-left ${["candidato", "empresa"].includes(u.rol) ? "hover:underline cursor-pointer" : "cursor-default"}`}
                      >
                        <p className="font-semibold text-azul-marino">{u.nombre}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-center"><BadgeRol rol={u.rol} /></td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400 text-xs hidden md:table-cell">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("es-CO") : "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {["candidato", "empresa"].includes(u.rol) && (
                          <button
                            onClick={() => setModalPerfil(u)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            Ver perfil
                          </button>
                        )}
                        <button
                          onClick={() => toggleActivo(u)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            u.activo
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {u.activo ? "Bloquear" : "Activar"}
                        </button>
                        {puedeGestionarRoles && (
                          <button
                            onClick={() => { setModalRol(u); setRolSeleccionado(u.rol); }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                          >
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
        )}
      </div>

      {/* Modal cambio de rol */}
      {modalRol && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-azul-marino text-lg">Cambiar rol del usuario</h3>
              <p className="text-gray-500 text-sm mt-1"><strong>{modalRol.nombre}</strong> — {modalRol.email}</p>
            </div>
            <div className="p-6 space-y-3">
              {ROLES_DISPONIBLES.map((r) => (
                <label
                  key={r.valor}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    rolSeleccionado === r.valor ? "border-azul-marino bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio" name="rol" value={r.valor}
                    checked={rolSeleccionado === r.valor}
                    onChange={() => setRolSeleccionado(r.valor)}
                    className="accent-azul-marino"
                  />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.color}`}>{r.etiqueta}</span>
                </label>
              ))}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={aplicarCambioRol}
                  disabled={rolSeleccionado === modalRol.rol || guardando}
                  className="flex-1 bg-azul-marino text-white font-semibold py-3 rounded-xl hover:bg-azul-claro transition-colors disabled:opacity-40"
                >
                  {guardando ? "Guardando..." : "Aplicar cambio"}
                </button>
                <button
                  onClick={() => setModalRol(null)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de perfil */}
      {modalPerfil && modalPerfil.rol === "candidato" && (
        <ModalPerfilCandidato usuario={modalPerfil} onCerrar={() => setModalPerfil(null)} />
      )}
      {modalPerfil && modalPerfil.rol === "empresa" && (
        <ModalPerfilEmpresa usuario={modalPerfil} onCerrar={() => setModalPerfil(null)} />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-azul-marino text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
