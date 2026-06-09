import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const COLOR_ESTADO = {
  pendiente: "bg-yellow-100 text-yellow-700",
  activa:    "bg-green-100 text-green-700",
  pausada:   "bg-blue-100 text-blue-700",
  eliminada: "bg-red-100 text-red-600",
};

// Cómo se llama la acción en historial según el estado resultante
const LABEL_ACCION = { activa: "aprobada", pausada: "pausada", eliminada: "rechazada" };
const ICONO_ACCION = { activa: "✅", pausada: "⏸", eliminada: "❌" };

function ModalDetalle({ oferta, onAccion, onCerrar }) {
  const [motivo, setMotivo]             = useState("");
  const [accionPendiente, setAccionPendiente] = useState(null);

  const confirmar = () => {
    onAccion(oferta.id, accionPendiente);
    onCerrar();
  };

  const salario = oferta.salario_min
    ? `$${oferta.salario_min.toLocaleString("es-CO")}${oferta.salario_max ? ` – $${oferta.salario_max.toLocaleString("es-CO")}` : ""}`
    : "A convenir";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-azul-marino text-lg">{oferta.titulo}</h3>
            <p className="text-gray-500 text-sm">{oferta.nombre_empresa} · {oferta.ciudad} · {oferta.categoria_profesional}</p>
          </div>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-2xl ml-4">×</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Contrato</p>
              <p className="font-semibold text-azul-marino">{oferta.tipo_contrato || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Salario</p>
              <p className="font-semibold text-esmeralda">{salario} COP</p>
            </div>
          </div>

          {oferta.descripcion && (
            <div>
              <p className="text-xs font-semibold text-azul-marino mb-1.5">Descripción</p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">{oferta.descripcion}</p>
            </div>
          )}
          {oferta.requisitos && (
            <div>
              <p className="text-xs font-semibold text-azul-marino mb-1.5">Requisitos</p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">{oferta.requisitos}</p>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Publicada: {new Date(oferta.fecha_publicacion).toLocaleString("es-CO")}
          </p>

          {accionPendiente === "eliminada" && (
            <div>
              <label className="block text-xs font-semibold text-azul-marino mb-1.5">
                Motivo del rechazo (opcional)
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={2}
                placeholder="Describe brevemente por qué se rechaza esta oferta..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro resize-none"
              />
            </div>
          )}

          {accionPendiente ? (
            <div className="flex gap-3">
              <button
                onClick={confirmar}
                className={`flex-1 font-bold py-3 rounded-xl text-white transition-colors ${
                  accionPendiente === "activa"    ? "bg-esmeralda hover:bg-esmeralda-hover"
                  : accionPendiente === "pausada" ? "bg-blue-600 hover:bg-blue-700"
                  :                                 "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirmar {LABEL_ACCION[accionPendiente]}
              </button>
              <button
                onClick={() => setAccionPendiente(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50"
              >
                Atrás
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setAccionPendiente("activa")}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-bold py-3 rounded-xl transition-colors text-sm">
                ✅ Aprobar
              </button>
              <button onClick={() => setAccionPendiente("pausada")}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-3 rounded-xl transition-colors text-sm">
                ⏸ Pausar
              </button>
              <button onClick={() => setAccionPendiente("eliminada")}
                className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3 rounded-xl transition-colors text-sm">
                ❌ Rechazar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ModerarOfertas() {
  const [pendientes, setPendientes] = useState([]);
  const [historial, setHistorial]   = useState([]);
  const [detalle, setDetalle]       = useState(null);
  const [busqueda, setBusqueda]     = useState("");
  const [toast, setToast]           = useState(null);
  const [vista, setVista]           = useState("pendientes");
  const [cargando, setCargando]     = useState(true);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setCargando(true);
    try {
      const [{ data: pend }, { data: hist }] = await Promise.all([
        supabase
          .from("ofertas_con_empresa")
          .select("*")
          .eq("estado", "pendiente")
          .order("fecha_publicacion", { ascending: true }),
        supabase
          .from("ofertas_con_empresa")
          .select("*")
          .neq("estado", "pendiente")
          .order("fecha_publicacion", { ascending: false })
          .limit(100),
      ]);
      setPendientes(pend || []);
      setHistorial(hist || []);
    } catch (_) {
      // silencioso — se muestra vacío
    } finally {
      setCargando(false);
    }
  }

  async function ejecutarAccion(id, nuevoEstado) {
    const oferta = pendientes.find((o) => o.id === id);
    const { error } = await supabase.from("ofertas").update({ estado: nuevoEstado }).eq("id", id);
    if (!error && oferta) {
      setPendientes((p) => p.filter((o) => o.id !== id));
      setHistorial((p) => [{ ...oferta, estado: nuevoEstado }, ...p]);
      setToast({ estado: nuevoEstado, titulo: oferta.titulo });
      setTimeout(() => setToast(null), 3000);
    }
  }

  const pendientesFiltradas = pendientes.filter((o) => {
    const q = busqueda.toLowerCase();
    return (
      !busqueda ||
      o.titulo?.toLowerCase().includes(q) ||
      o.nombre_empresa?.toLowerCase().includes(q) ||
      o.ciudad?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Panel de moderación</h1>
          <p className="text-gray-500 text-sm mt-1">Revisa y gestiona las ofertas pendientes de publicación.</p>
        </div>
        <span className="bg-yellow-100 text-yellow-700 text-sm font-bold px-3 py-1.5 rounded-full">
          {pendientes.length} pendientes
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {[
          { key: "pendientes", label: `📋 Pendientes (${pendientes.length})` },
          { key: "historial",  label: `🗂 Historial (${historial.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setVista(t.key)}
            className={`px-5 py-3 text-sm font-semibold transition-colors ${
              vista === t.key
                ? "text-azul-marino border-b-2 border-azul-marino"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Vista: Pendientes ── */}
      {vista === "pendientes" && (
        <>
          <div className="mb-5">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por cargo, empresa o ciudad..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-esmeralda"
            />
          </div>

          {cargando ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : pendientesFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <div className="text-5xl mb-4">{busqueda ? "🔍" : "✅"}</div>
              <h3 className="font-bold text-azul-marino text-lg mb-2">
                {busqueda ? "Sin resultados" : "¡Todo al día!"}
              </h3>
              <p className="text-gray-400 text-sm">
                {busqueda
                  ? "No hay ofertas que coincidan con tu búsqueda."
                  : "No hay ofertas pendientes de moderación."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendientesFiltradas.map((oferta) => (
                <div key={oferta.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-azul-marino">{oferta.titulo}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          pendiente
                        </span>
                        {oferta.urgente && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                            urgente
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {oferta.nombre_empresa} · {oferta.ciudad} · {oferta.categoria_profesional}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                        {oferta.tipo_contrato && <span>📄 {oferta.tipo_contrato}</span>}
                        {oferta.salario_min && (
                          <span>💰 ${oferta.salario_min.toLocaleString("es-CO")}</span>
                        )}
                        <span>🕐 {new Date(oferta.fecha_publicacion).toLocaleDateString("es-CO")}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDetalle(oferta)}
                      className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex-shrink-0"
                    >
                      Ver detalle
                    </button>
                  </div>

                  {/* Acciones rápidas */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => ejecutarAccion(oferta.id, "activa")}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      onClick={() => ejecutarAccion(oferta.id, "pausada")}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      ⏸ Pausar
                    </button>
                    <button
                      onClick={() => ejecutarAccion(oferta.id, "eliminada")}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Vista: Historial ── */}
      {vista === "historial" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {historial.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🗂</p>
              <p className="text-sm font-semibold text-gray-500">No hay historial de moderaciones aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-5 py-3 text-left font-semibold text-azul-marino">Oferta</th>
                    <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                    <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {historial.map((h) => (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-azul-marino">{h.titulo}</p>
                        <p className="text-gray-400 text-xs">{h.nombre_empresa}</p>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_ESTADO[h.estado] || "bg-gray-100 text-gray-500"}`}>
                          {ICONO_ACCION[h.estado] || ""} {LABEL_ACCION[h.estado] || h.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500 text-xs hidden sm:table-cell">
                        {new Date(h.fecha_publicacion).toLocaleDateString("es-CO")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal detalle */}
      {detalle && (
        <ModalDetalle
          oferta={detalle}
          onAccion={ejecutarAccion}
          onCerrar={() => setDetalle(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50 text-white ${
          toast.estado === "activa"    ? "bg-green-600"
          : toast.estado === "pausada" ? "bg-blue-600"
          :                              "bg-red-500"
        }`}>
          {ICONO_ACCION[toast.estado]} "{toast.titulo}" fue {LABEL_ACCION[toast.estado]}
        </div>
      )}
    </div>
  );
}
