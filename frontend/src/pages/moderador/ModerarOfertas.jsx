// Panel de moderación de ofertas — aprobar, pausar o rechazar ofertas pendientes
import { useState } from "react";

const OFERTAS_PENDIENTES_DEMO = [
  {
    id: 101, cargo: "Médico General Urgencias", empresa: "Clínica Nuevo Horizonte",
    ciudad: "Pereira", categoria: "Médico general", tipoContrato: "Tiempo completo",
    salario: "4.800.000", fechaEnvio: "2026-06-07 09:14",
    descripcion: "Buscamos Médico General para sala de urgencias 24 horas...",
    estado: "pendiente",
  },
  {
    id: 102, cargo: "Enfermero/a UCI Neonatal", empresa: "Hospital San Jorge",
    ciudad: "Armenia", categoria: "Enfermero/a", tipoContrato: "Por turnos",
    salario: "3.800.000", fechaEnvio: "2026-06-07 10:30",
    descripcion: "Requerimos Enfermero/a para UCI Neonatal con experiencia mínima...",
    estado: "pendiente",
  },
  {
    id: 103, cargo: "Auxiliar Laboratorio Clínico", empresa: "Lab. Diagnóstico Plus",
    ciudad: "Manizales", categoria: "Bacteriólogo/a", tipoContrato: "Medio tiempo",
    salario: "1.900.000", fechaEnvio: "2026-06-06 16:45",
    descripcion: "Laboratorio clínico de alta complejidad requiere Auxiliar...",
    estado: "pendiente",
  },
  {
    id: 104, cargo: "Psicólogo Organizacional", empresa: "EPS Regional Norte",
    ciudad: "Barranquilla", categoria: "Psicólogo/a", tipoContrato: "Tiempo completo",
    salario: "3.200.000", fechaEnvio: "2026-06-06 14:20",
    descripcion: "Empresa del sector salud requiere Psicólogo Organizacional...",
    estado: "pendiente",
  },
  {
    id: 105, cargo: "Conductor Ambulancia TAB", empresa: "Cruz Verde Ambulancias",
    ciudad: "Bogotá", categoria: "Conductor de ambulancia", tipoContrato: "Por turnos",
    salario: "1.750.000", fechaEnvio: "2026-06-05 11:00",
    descripcion: "Requerimos conductores de ambulancia para turnos rotativos...",
    estado: "pendiente",
  },
];

const HISTORIAL_DEMO = [
  { id: 95, cargo: "Odontólogo General",    empresa: "Colsubsidio",         accion: "aprobada",  fecha: "2026-06-06", moderador: "Laura Torres" },
  { id: 96, cargo: "Fisioterapeuta",        empresa: "Centro Rehab. Sur",   accion: "pausada",   fecha: "2026-06-05", moderador: "Laura Torres" },
  { id: 97, cargo: "Médico Especialista",   empresa: "Clínica Palermo",     accion: "aprobada",  fecha: "2026-06-05", moderador: "Laura Torres" },
  { id: 98, cargo: "Auxiliar de Farmacia",  empresa: "Droguería La Salud",  accion: "rechazada", fecha: "2026-06-04", moderador: "Laura Torres" },
];

const COLOR_ESTADO = {
  pendiente: "bg-yellow-100 text-yellow-700",
  aprobada:  "bg-green-100 text-green-700",
  pausada:   "bg-blue-100 text-blue-700",
  rechazada: "bg-red-100 text-red-600",
};

const ICONO_ACCION = { aprobada: "✅", pausada: "⏸", rechazada: "❌" };

function ModalDetalle({ oferta, onAccion, onCerrar }) {
  const [motivo, setMotivo] = useState("");
  const [accionPendiente, setAccionPendiente] = useState(null);

  const confirmar = () => {
    onAccion(oferta.id, accionPendiente, motivo);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-azul-marino text-lg">{oferta.cargo}</h3>
            <p className="text-gray-500 text-sm">{oferta.empresa} · {oferta.ciudad} · {oferta.categoria}</p>
          </div>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-2xl ml-4">×</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Contrato</p>
              <p className="font-semibold text-azul-marino">{oferta.tipoContrato}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Salario</p>
              <p className="font-semibold text-esmeralda">${oferta.salario} COP/mes</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-azul-marino mb-1.5">Descripción</p>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">{oferta.descripcion}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-azul-marino mb-1.5">Enviada el {oferta.fechaEnvio}</p>
          </div>

          {accionPendiente === "rechazada" && (
            <div>
              <label className="block text-xs font-semibold text-azul-marino mb-1.5">Motivo del rechazo (opcional)</label>
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={2}
                placeholder="Describe brevemente por qué se rechaza esta oferta..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro resize-none" />
            </div>
          )}

          {accionPendiente ? (
            <div className="flex gap-3">
              <button onClick={confirmar}
                className={`flex-1 font-bold py-3 rounded-xl text-white transition-colors ${
                  accionPendiente === "aprobada" ? "bg-esmeralda hover:bg-esmeralda-hover"
                  : accionPendiente === "pausada" ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-500 hover:bg-red-600"
                }`}>
                Confirmar {accionPendiente}
              </button>
              <button onClick={() => setAccionPendiente(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50">
                Atrás
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setAccionPendiente("aprobada")}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-bold py-3 rounded-xl transition-colors text-sm">
                ✅ Aprobar
              </button>
              <button onClick={() => setAccionPendiente("pausada")}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-3 rounded-xl transition-colors text-sm">
                ⏸ Pausar
              </button>
              <button onClick={() => setAccionPendiente("rechazada")}
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
  const [ofertas, setOfertas] = useState(OFERTAS_PENDIENTES_DEMO);
  const [historial, setHistorial] = useState(HISTORIAL_DEMO);
  const [detalle, setDetalle] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState(null);
  const [vista, setVista] = useState("pendientes"); // "pendientes" | "historial"

  const accionRapida = (id, accion) => {
    const oferta = ofertas.find((o) => o.id === id);
    setOfertas((p) => p.filter((o) => o.id !== id));
    setHistorial((p) => [
      { id, cargo: oferta.cargo, empresa: oferta.empresa, accion, fecha: "2026-06-08", moderador: "Tú" },
      ...p,
    ]);
    setToast({ accion, cargo: oferta.cargo });
    setTimeout(() => setToast(null), 3000);
  };

  const pendientesFiltradas = ofertas.filter((o) => {
    const q = busqueda.toLowerCase();
    return !busqueda || o.cargo.toLowerCase().includes(q) || o.empresa.toLowerCase().includes(q) || o.ciudad.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Panel de moderación</h1>
          <p className="text-gray-500 text-sm mt-1">Revisa y gestiona las ofertas pendientes de publicación.</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-yellow-100 text-yellow-700 text-sm font-bold px-3 py-1.5 rounded-full">
            {ofertas.length} pendientes
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {[
          { key: "pendientes", label: `📋 Pendientes (${ofertas.length})` },
          { key: "historial",  label: `🗂 Historial (${historial.length})` },
        ].map((t) => (
          <button key={t.key} onClick={() => setVista(t.key)}
            className={`px-5 py-3 text-sm font-semibold transition-colors ${
              vista === t.key ? "text-azul-marino border-b-2 border-azul-marino" : "text-gray-400 hover:text-gray-600"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {vista === "pendientes" && (
        <>
          {/* Búsqueda */}
          <div className="mb-5">
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar oferta por cargo, empresa o ciudad..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-esmeralda" />
          </div>

          {/* Lista de ofertas pendientes */}
          {pendientesFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <div className="text-5xl mb-4">{busqueda ? "🔍" : "✅"}</div>
              <h3 className="font-bold text-azul-marino text-lg mb-2">
                {busqueda ? "Sin resultados" : "¡Todo al día!"}
              </h3>
              <p className="text-gray-400 text-sm">
                {busqueda ? "No hay ofertas que coincidan con tu búsqueda." : "No hay ofertas pendientes de moderación."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendientesFiltradas.map((oferta) => (
                <div key={oferta.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-azul-marino">{oferta.cargo}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_ESTADO[oferta.estado]}`}>
                          {oferta.estado}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{oferta.empresa} · {oferta.ciudad} · {oferta.categoria}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                        <span>📄 {oferta.tipoContrato}</span>
                        <span>💰 ${oferta.salario}</span>
                        <span>🕐 {oferta.fechaEnvio}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <button onClick={() => setDetalle(oferta)}
                        className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                        Ver detalle
                      </button>
                    </div>
                  </div>
                  {/* Acciones rápidas */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button onClick={() => accionRapida(oferta.id, "aprobada")}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                      ✅ Aprobar
                    </button>
                    <button onClick={() => accionRapida(oferta.id, "pausada")}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                      ⏸ Pausar
                    </button>
                    <button onClick={() => accionRapida(oferta.id, "rechazada")}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {vista === "historial" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">Oferta</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Acción</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Fecha</th>
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden md:table-cell">Moderador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historial.map((h) => (
                  <tr key={`${h.id}-${h.fecha}`} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-azul-marino">{h.cargo}</p>
                      <p className="text-gray-400 text-xs">{h.empresa}</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_ESTADO[h.accion]}`}>
                        {ICONO_ACCION[h.accion]} {h.accion}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-gray-500 hidden sm:table-cell">{h.fecha}</td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{h.moderador}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {detalle && (
        <ModalDetalle oferta={detalle} onAccion={accionRapida} onCerrar={() => setDetalle(null)} />
      )}

      {/* Toast notificación */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50 text-white ${
          toast.accion === "aprobada" ? "bg-green-600" : toast.accion === "pausada" ? "bg-blue-600" : "bg-red-500"
        }`}>
          {ICONO_ACCION[toast.accion]} "{toast.cargo}" fue {toast.accion}
        </div>
      )}
    </div>
  );
}
