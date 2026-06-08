import { useState } from "react";
import { Link } from "react-router-dom";

const OFERTAS_DEMO = [
  { id: 1, cargo: "Médico General", ciudad: "Bogotá", tipo: "Tiempo completo", postulados: 8,  estado: "Activa",  fechaLimite: "2026-06-30", categoria: "Médico general" },
  { id: 2, cargo: "Jefe de Enfermería", ciudad: "Medellín", tipo: "Tiempo completo", postulados: 14, estado: "Activa", fechaLimite: "2026-06-25", categoria: "Enfermero/a" },
  { id: 3, cargo: "Auxiliar Administrativo", ciudad: "Bogotá", tipo: "Medio tiempo", postulados: 22, estado: "Cerrada", fechaLimite: "2026-05-15", categoria: "Personal administrativo" },
];

export default function MisOfertas() {
  const [ofertas, setOfertas] = useState(OFERTAS_DEMO);

  const cerrarOferta = (id) =>
    setOfertas(p => p.map(o => o.id === id ? { ...o, estado: "Cerrada" } : o));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Mis ofertas</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona las ofertas de empleo publicadas.</p>
        </div>
        <Link to="/empresa/publicar-oferta" className="btn-primario text-sm py-2 px-4 whitespace-nowrap">
          + Publicar oferta
        </Link>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Activas",          valor: ofertas.filter(o => o.estado === "Activa").length,  color: "text-green-600" },
          { label: "Total postulados", valor: ofertas.reduce((s, o) => s + o.postulados, 0),       color: "text-azul-marino" },
          { label: "Cerradas",         valor: ofertas.filter(o => o.estado === "Cerrada").length,  color: "text-gray-400" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de ofertas */}
      <div className="space-y-3">
        {ofertas.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-azul-marino">{o.cargo}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    o.estado === "Activa" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>{o.estado}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{o.ciudad} · {o.tipo} · {o.categoria}</p>
                <p className="text-gray-400 text-xs mt-1">Fecha límite: {o.fechaLimite}</p>
              </div>
              <div className="flex-shrink-0 text-center">
                <p className="text-2xl font-bold text-azul-marino">{o.postulados}</p>
                <p className="text-xs text-gray-400">postulados</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
              <Link to={`/empresa/oferta/${o.id}/candidatos`} className="text-sm text-esmeralda font-semibold hover:underline">
                Ver candidatos ({o.postulados})
              </Link>
              {o.estado === "Activa" && (
                <button onClick={() => cerrarOferta(o.id)} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                  Cerrar oferta
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
