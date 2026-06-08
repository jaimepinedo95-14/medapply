import { useState } from "react";

const EMPRESAS_DEMO = [
  { id: 1, nombre: "Clínica San Rafael",         nit: "800200543-2", tipo: "Clínica",    ciudad: "Bogotá",       plan: "Premium",  ofertas: 8,  activo: true,  registro: "2026-04-10" },
  { id: 2, nombre: "Hospital Universitario",      nit: "900123456-7", tipo: "Hospital",   ciudad: "Medellín",     plan: "Básico",   ofertas: 4,  activo: true,  registro: "2026-04-15" },
  { id: 3, nombre: "EPS Sanitas",                 nit: "800251478-3", tipo: "EPS",        ciudad: "Bogotá",       plan: "Premium",  ofertas: 12, activo: true,  registro: "2026-04-20" },
  { id: 4, nombre: "IPS Médicos Unidos",          nit: "900456789-1", tipo: "IPS",        ciudad: "Cali",         plan: "Gratuito", ofertas: 1,  activo: true,  registro: "2026-05-01" },
  { id: 5, nombre: "Cruz Roja Seccional Bogotá",  nit: "860007551-4", tipo: "Otro",       ciudad: "Bogotá",       plan: "Básico",   ofertas: 3,  activo: true,  registro: "2026-05-10" },
  { id: 6, nombre: "Laboratorio Clínico Baxter",  nit: "900789123-5", tipo: "Laboratorio", ciudad: "Bogotá",      plan: "Gratuito", ofertas: 1,  activo: false, registro: "2026-05-15" },
  { id: 7, nombre: "Clínica Palermo",             nit: "830000003-6", tipo: "Clínica",    ciudad: "Bogotá",       plan: "Premium",  ofertas: 6,  activo: true,  registro: "2026-05-20" },
  { id: 8, nombre: "Colsubsidio Salud",           nit: "860045092-7", tipo: "IPS",        ciudad: "Bogotá",       plan: "Premium",  ofertas: 9,  activo: true,  registro: "2026-05-25" },
];

const COLORES_PLAN = {
  Premium:  "bg-esmeralda text-white",
  Básico:   "bg-blue-100 text-blue-700",
  Gratuito: "bg-gray-100 text-gray-600",
};

export default function GestionEmpresas() {
  const [empresas, setEmpresas] = useState(EMPRESAS_DEMO);
  const [busqueda, setBusqueda] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("todos");

  const toggleActivo = (id) =>
    setEmpresas((p) => p.map((e) => e.id === id ? { ...e, activo: !e.activo } : e));

  const lista = empresas.filter((e) => {
    const matchBus = !busqueda || e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.nit.includes(busqueda);
    const matchPlan = filtroPlan === "todos" || e.plan.toLowerCase() === filtroPlan;
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
          {["Premium", "Básico", "Gratuito"].map((p) => (
            <span key={p} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${COLORES_PLAN[p]}`}>
              {empresas.filter(e => e.plan === p).length} {p}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o NIT..." className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-esmeralda" />
        <div className="flex gap-2">
          {["todos", "premium", "básico", "gratuito"].map((f) => (
            <button key={f} onClick={() => setFiltroPlan(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize ${filtroPlan === f ? "bg-azul-marino text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left font-semibold text-azul-marino">Empresa</th>
                <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden md:table-cell">Tipo</th>
                <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden lg:table-cell">Ciudad</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Ofertas</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lista.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-azul-marino">{e.nombre}</p>
                    <p className="text-gray-400 text-xs">NIT: {e.nit}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{e.tipo}</td>
                  <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{e.ciudad}</td>
                  <td className="px-5 py-3 text-center hidden sm:table-cell">
                    <span className="font-bold text-azul-marino">{e.ofertas}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLORES_PLAN[e.plan]}`}>{e.plan}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${e.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {e.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => toggleActivo(e.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        e.activo ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}>
                      {e.activo ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lista.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">🏥</p><p>No se encontraron empresas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
