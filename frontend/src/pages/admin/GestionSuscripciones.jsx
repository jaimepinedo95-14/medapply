import { useState } from "react";

const PAGOS_DEMO = [
  { id: "TXN-001", usuario: "Clínica San Rafael",        tipo: "Empresa",    plan: "Premium",   monto: 159900, fecha: "2026-06-01", estado: "Pagado" },
  { id: "TXN-002", usuario: "María Sofía Ruiz",          tipo: "Candidato",  plan: "Destacado", monto:   9900, fecha: "2026-06-01", estado: "Pagado" },
  { id: "TXN-003", usuario: "EPS Sanitas",               tipo: "Empresa",    plan: "Premium",   monto: 159900, fecha: "2026-06-02", estado: "Pagado" },
  { id: "TXN-004", usuario: "Hospital Universitario",    tipo: "Empresa",    plan: "Básico",    monto:  79900, fecha: "2026-06-02", estado: "Pagado" },
  { id: "TXN-005", usuario: "Lucía Martínez",            tipo: "Candidato",  plan: "Destacado", monto:   9900, fecha: "2026-06-03", estado: "Pagado" },
  { id: "TXN-006", usuario: "Cruz Roja Seccional",       tipo: "Empresa",    plan: "Básico",    monto:  79900, fecha: "2026-06-03", estado: "Pagado" },
  { id: "TXN-007", usuario: "Clínica Palermo",           tipo: "Empresa",    plan: "Premium",   monto: 159900, fecha: "2026-06-04", estado: "Pagado" },
  { id: "TXN-008", usuario: "Paola Castro",              tipo: "Candidato",  plan: "Destacado", monto:   9900, fecha: "2026-06-04", estado: "Pendiente" },
  { id: "TXN-009", usuario: "Colsubsidio Salud",         tipo: "Empresa",    plan: "Premium",   monto: 159900, fecha: "2026-06-05", estado: "Pagado" },
  { id: "TXN-010", usuario: "Jorge Bustamante",          tipo: "Candidato",  plan: "Destacado", monto:   9900, fecha: "2026-06-06", estado: "Fallido" },
];

const COLORES_ESTADO = {
  Pagado:    "bg-green-100 text-green-700",
  Pendiente: "bg-yellow-100 text-yellow-700",
  Fallido:   "bg-red-100 text-red-600",
};

const COLORES_PLAN = {
  Premium:   "bg-esmeralda text-white",
  Básico:    "bg-blue-100 text-blue-700",
  Destacado: "bg-yellow-100 text-yellow-700",
};

export default function GestionSuscripciones() {
  const [pagos] = useState(PAGOS_DEMO);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const total = pagos.filter(p => p.estado === "Pagado").reduce((s, p) => s + p.monto, 0);
  const lista = pagos.filter(p => filtroTipo === "todos" || p.tipo.toLowerCase() === filtroTipo);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Gestión de suscripciones</h1>
        <p className="text-gray-500 text-sm mt-1">Todos los pagos y planes activos en la plataforma.</p>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total recaudado",      valor: `$${total.toLocaleString("es-CO")}`, icono: "💰", color: "bg-green-50 border-green-100" },
          { label: "Planes Premium",       valor: pagos.filter(p => p.plan === "Premium"   && p.estado === "Pagado").length, icono: "⭐", color: "bg-esmeralda/10 border-esmeralda/20" },
          { label: "Planes Básico",        valor: pagos.filter(p => p.plan === "Básico"    && p.estado === "Pagado").length, icono: "📦", color: "bg-blue-50 border-blue-100" },
          { label: "Perfiles Destacados",  valor: pagos.filter(p => p.plan === "Destacado" && p.estado === "Pagado").length, icono: "🏆", color: "bg-yellow-50 border-yellow-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <div className="text-xl mb-1">{s.icono}</div>
            <p className="text-xl font-bold text-azul-marino">{s.valor}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5">
        {["todos", "empresa", "candidato"].map((f) => (
          <button key={f} onClick={() => setFiltroTipo(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${filtroTipo === f ? "bg-azul-marino text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Tabla de pagos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold text-azul-marino">ID</th>
                <th className="px-5 py-3 text-left font-semibold text-azul-marino">Usuario</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Tipo</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
                <th className="px-5 py-3 text-right font-semibold text-azul-marino">Monto</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden md:table-cell">Fecha</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lista.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-xs text-gray-400 font-mono">{p.id}</td>
                  <td className="px-5 py-3 font-semibold text-azul-marino text-sm">{p.usuario}</td>
                  <td className="px-5 py-3 text-center hidden sm:table-cell">
                    <span className="text-xs text-gray-500">{p.tipo}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLORES_PLAN[p.plan]}`}>{p.plan}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-azul-marino">
                    ${p.monto.toLocaleString("es-CO")}
                  </td>
                  <td className="px-5 py-3 text-center text-gray-400 text-xs hidden md:table-cell">{p.fecha}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLORES_ESTADO[p.estado]}`}>{p.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
