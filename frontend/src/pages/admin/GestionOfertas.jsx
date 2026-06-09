import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const ESTADOS = ["activa", "pausada", "eliminada"];
const COLORES = {
  activa:    "bg-green-100 text-green-700",
  pausada:   "bg-yellow-100 text-yellow-700",
  eliminada: "bg-red-100 text-red-600",
};

export default function GestionOfertas() {
  const [ofertas, setOfertas]     = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState(null);
  const [busqueda, setBusqueda]   = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [toast, setToast]         = useState("");

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("ofertas_con_empresa")
        .select("*")
        .order("fecha_publicacion", { ascending: false });
      if (err) throw err;
      setOfertas(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  async function cambiarEstado(id, nuevoEstado) {
    setOfertas((p) => p.map((o) => o.id === id ? { ...o, estado: nuevoEstado } : o));
    const { error: err } = await supabase.from("ofertas").update({ estado: nuevoEstado }).eq("id", id);
    if (err) {
      await cargar();
      mostrarToast("❌ Error al actualizar oferta");
    } else {
      mostrarToast("✅ Oferta actualizada");
    }
  }

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const lista = ofertas.filter((o) => {
    const matchBus = !busqueda
      || o.titulo?.toLowerCase().includes(busqueda.toLowerCase())
      || o.nombre_empresa?.toLowerCase().includes(busqueda.toLowerCase());
    const matchEst = filtroEstado === "todos" || o.estado === filtroEstado;
    return matchBus && matchEst;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Gestión de ofertas</h1>
          <p className="text-gray-500 text-sm mt-1">{ofertas.length} ofertas en la plataforma.</p>
        </div>
        <div className="flex gap-2">
          {ESTADOS.map((e) => (
            <span key={e} className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${COLORES[e]}`}>
              {ofertas.filter(o => o.estado === e).length} {e}s
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por cargo o empresa..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-esmeralda" />
        <div className="flex gap-2">
          {["todos", ...ESTADOS].map((f) => (
            <button key={f} onClick={() => setFiltroEstado(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize ${
                filtroEstado === f ? "bg-azul-marino text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"
              }`}>{f}
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
            <p className="text-red-500 font-semibold mb-2">Error al cargar ofertas</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button onClick={cargar} className="btn-primario text-sm py-2 px-5">Reintentar</button>
          </div>
        ) : lista.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm font-semibold text-gray-500">
              {ofertas.length === 0 ? "Aún no hay ofertas publicadas." : "No se encontraron ofertas con esos filtros."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">Oferta</th>
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden md:table-cell">Ciudad</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lista.map((o) => (
                  <tr key={o.id} className={`hover:bg-gray-50 transition-colors ${o.estado === "eliminada" ? "opacity-50" : ""}`}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-azul-marino">{o.titulo}</p>
                      <p className="text-gray-400 text-xs">{o.nombre_empresa || "Empresa"} · {o.tipo_contrato}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{o.ciudad}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLORES[o.estado] || "bg-gray-100 text-gray-500"}`}>
                        {o.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex gap-1.5 justify-center">
                        {o.estado !== "activa" && (
                          <button onClick={() => cambiarEstado(o.id, "activa")}
                            className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2.5 py-1.5 rounded-lg font-semibold">
                            Aprobar
                          </button>
                        )}
                        {o.estado === "activa" && (
                          <button onClick={() => cambiarEstado(o.id, "pausada")}
                            className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-2.5 py-1.5 rounded-lg font-semibold">
                            Pausar
                          </button>
                        )}
                        {o.estado !== "eliminada" && (
                          <button onClick={() => cambiarEstado(o.id, "eliminada")}
                            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-lg font-semibold">
                            Eliminar
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

      {toast && (
        <div className="fixed bottom-6 right-6 bg-azul-marino text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
