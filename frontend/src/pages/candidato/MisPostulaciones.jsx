import { useState } from "react";
import { Link } from "react-router-dom";

const POSTULACIONES = [
  { id: 1, cargo: "Médico General", empresa: "Clínica San Rafael", ciudad: "Bogotá", tipo: "Tiempo completo", estado: "En revisión", fecha: "2026-06-06", logo: "🏥" },
  { id: 2, cargo: "Médico de Urgencias", empresa: "Hospital Universitario", ciudad: "Medellín", tipo: "Por turnos", estado: "Preseleccionado", fecha: "2026-06-03", logo: "🏨" },
  { id: 3, cargo: "Médico Rural", empresa: "Ministerio de Salud", ciudad: "Cundinamarca", tipo: "Prestación de servicios", estado: "Visto", fecha: "2026-06-01", logo: "🏛" },
  { id: 4, cargo: "Médico Ocupacional", empresa: "Colsanitas", ciudad: "Bogotá", tipo: "Medio tiempo", estado: "Descartado", fecha: "2026-05-28", logo: "🏢" },
];

const CONFIG_ESTADO = {
  "En revisión":    { color: "bg-yellow-100 text-yellow-700", icono: "⏳" },
  "Preseleccionado":{ color: "bg-green-100 text-green-700",   icono: "✅" },
  "Visto":          { color: "bg-blue-100 text-blue-700",     icono: "👁" },
  "Descartado":     { color: "bg-red-100 text-red-700",       icono: "❌" },
};

export default function MisPostulaciones() {
  const [filtro, setFiltro] = useState("todas");

  const lista = filtro === "todas"
    ? POSTULACIONES
    : POSTULACIONES.filter(p => p.estado.toLowerCase().includes(filtro));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Mis postulaciones</h1>
        <p className="text-gray-500 text-sm mt-1">Sigue el estado de tus aplicaciones a ofertas de empleo.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["todas", "en revisión", "preseleccionado", "visto", "descartado"].map((f) => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filtro === f ? "bg-azul-marino text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista */}
      {lista.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>No hay postulaciones con este filtro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((p) => {
            const cfg = CONFIG_ESTADO[p.estado];
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{p.logo}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-azul-marino">{p.cargo}</p>
                  <p className="text-gray-500 text-sm">{p.empresa} · {p.ciudad}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{p.tipo} · Aplicado el {p.fecha}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                    {cfg.icono} {p.estado}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA buscar más */}
      <div className="mt-8 text-center">
        <Link to="/empleos" className="btn-primario inline-block">Buscar más ofertas</Link>
      </div>
    </div>
  );
}
