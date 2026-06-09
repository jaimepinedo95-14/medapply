import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const COLORES_PLAN = {
  premium:  "bg-esmeralda text-white",
  basico:   "bg-blue-100 text-blue-700",
  gratuito: "bg-gray-100 text-gray-600",
};

const COLORES_ESTADO_OFERTA = {
  activa:    "bg-green-100 text-green-700",
  pausada:   "bg-yellow-100 text-yellow-700",
  eliminada: "bg-red-100 text-red-600",
  pendiente: "bg-orange-100 text-orange-700",
};

// ── Modal de perfil completo de empresa ───────────────────────────────────────
function ModalEmpresa({ empresa, onCerrar }) {
  const [ofertas, setOfertas]     = useState([]);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    supabase
      .from("ofertas")
      .select("id, titulo, ciudad, tipo_contrato, estado, fecha_publicacion")
      .eq("empresa_id", empresa.usuario_id)
      .order("fecha_publicacion", { ascending: false })
      .limit(20)
      .then(({ data }) => { setOfertas(data || []); setCargando(false); })
      .catch(() => setCargando(false));
  }, [empresa.usuario_id]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCerrar}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {empresa.logo ? (
              <img src={empresa.logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">🏥</div>
            )}
            <div>
              <h3 className="font-bold text-azul-marino text-lg">{empresa.nombre_empresa}</h3>
              <p className="text-gray-400 text-sm">{empresa.usuarios?.email}</p>
            </div>
          </div>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-2xl ml-4">×</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Datos de la empresa */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "NIT",          valor: empresa.nit },
              { label: "Tipo empresa", valor: empresa.tipo_empresa },
              { label: "Ciudad",       valor: empresa.ciudad },
              { label: "Teléfono",     valor: empresa.telefono },
              { label: "Sitio web",    valor: empresa.sitio_web },
              { label: "Plan",         valor: empresa.plan },
            ].filter((f) => f.valor).map((f) => (
              <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">{f.label}</p>
                <p className="font-semibold text-azul-marino text-sm mt-0.5 capitalize">{f.valor}</p>
              </div>
            ))}
            {empresa.descripcion && (
              <div className="col-span-2 bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Descripción</p>
                <p className="text-sm text-gray-600 leading-relaxed">{empresa.descripcion}</p>
              </div>
            )}
          </div>

          {/* Ofertas publicadas */}
          <div>
            <p className="text-xs font-bold text-azul-marino uppercase tracking-wide mb-2">
              Ofertas publicadas
            </p>
            {cargando ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : ofertas.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm">
                Esta empresa aún no ha publicado ofertas.
              </div>
            ) : (
              <div className="space-y-2">
                {ofertas.map((o) => (
                  <div key={o.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-azul-marino text-sm truncate">{o.titulo}</p>
                      <p className="text-gray-400 text-xs">{o.ciudad} · {o.tipo_contrato}</p>
                    </div>
                    <span className={`ml-3 flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${COLORES_ESTADO_OFERTA[o.estado] || "bg-gray-100 text-gray-500"}`}>
                      {o.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function GestionEmpresas() {
  const [empresas, setEmpresas]     = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState(null);
  const [busqueda, setBusqueda]     = useState("");
  const [filtroPlan, setFiltroPlan] = useState("todos");
  const [toast, setToast]           = useState("");
  const [modalEmpresa, setModalEmpresa] = useState(null);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("perfiles_empresa")
        .select("*, usuarios!inner(id, email, activo, created_at)")
        .order("created_at", { ascending: false, foreignTable: "usuarios" });
      if (err) throw err;
      setEmpresas(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  async function toggleActivo(empresa) {
    const nuevoActivo = !empresa.usuarios?.activo;
    setEmpresas((p) => p.map((e) =>
      e.usuario_id === empresa.usuario_id
        ? { ...e, usuarios: { ...e.usuarios, activo: nuevoActivo } }
        : e
    ));
    const { error: err } = await supabase
      .from("usuarios")
      .update({ activo: nuevoActivo })
      .eq("id", empresa.usuario_id);
    if (err) {
      setEmpresas((p) => p.map((e) =>
        e.usuario_id === empresa.usuario_id
          ? { ...e, usuarios: { ...e.usuarios, activo: empresa.usuarios?.activo } }
          : e
      ));
      mostrarToast("❌ Error al actualizar estado");
    } else {
      mostrarToast(nuevoActivo ? "✅ Empresa activada" : "✅ Empresa desactivada");
    }
  }

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const lista = empresas.filter((e) => {
    const matchBus = !busqueda
      || e.nombre_empresa?.toLowerCase().includes(busqueda.toLowerCase())
      || e.nit?.includes(busqueda);
    const matchPlan = filtroPlan === "todos" || e.plan?.toLowerCase() === filtroPlan;
    return matchBus && matchPlan;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Gestión de empresas</h1>
          <p className="text-gray-500 text-sm mt-1">{empresas.length} empresas registradas en la plataforma.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["premium", "basico", "gratuito"].map((p) => (
            <span key={p} className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${COLORES_PLAN[p]}`}>
              {empresas.filter((e) => e.plan === p).length} {p}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o NIT..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-esmeralda"
        />
        <div className="flex gap-2">
          {["todos", "premium", "basico", "gratuito"].map((f) => (
            <button
              key={f} onClick={() => setFiltroPlan(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize ${
                filtroPlan === f
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
            <p className="text-red-500 font-semibold mb-2">Error al cargar empresas</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button onClick={cargar} className="btn-primario text-sm py-2 px-5">Reintentar</button>
          </div>
        ) : lista.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">🏥</p>
            <p className="text-sm font-semibold text-gray-500">
              {empresas.length === 0 ? "Aún no hay empresas registradas." : "No se encontraron empresas con esos filtros."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">Empresa</th>
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden md:table-cell">Tipo</th>
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden lg:table-cell">Ciudad</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lista.map((e) => (
                  <tr key={e.usuario_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setModalEmpresa(e)}
                        className="text-left hover:underline"
                      >
                        <p className="font-semibold text-azul-marino">{e.nombre_empresa}</p>
                        <p className="text-gray-400 text-xs">{e.usuarios?.email || "—"}</p>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{e.tipo_empresa || "—"}</td>
                    <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{e.ciudad || "—"}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${COLORES_PLAN[e.plan] || "bg-gray-100 text-gray-500"}`}>
                        {e.plan || "gratuito"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        e.usuarios?.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {e.usuarios?.activo ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setModalEmpresa(e)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Ver perfil
                        </button>
                        <button
                          onClick={() => toggleActivo(e)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            e.usuarios?.activo
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {e.usuarios?.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalEmpresa && (
        <ModalEmpresa empresa={modalEmpresa} onCerrar={() => setModalEmpresa(null)} />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-azul-marino text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
