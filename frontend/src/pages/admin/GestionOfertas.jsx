import { useState } from "react";
import { OFERTAS_DEMO } from "../../data/ofertasDemo";

const ESTADOS = ["Activa", "Pausada", "Eliminada"];

export default function GestionOfertas() {
  const [ofertas, setOfertas] = useState(
    OFERTAS_DEMO.map((o) => ({ ...o, estadoAdmin: "Activa" }))
  );
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const cambiarEstado = (id, nuevoEstado) =>
    setOfertas((p) => p.map((o) => o.id === id ? { ...o, estadoAdmin: nuevoEstado } : o));

  const lista = ofertas.filter((o) => {
    const matchBus = !busqueda || o.cargo.toLowerCase().includes(busqueda.toLowerCase()) || o.empresa.toLowerCase().includes(busqueda.toLowerCase());
    const matchEst = filtroEstado === "todos" || o.estadoAdmin.toLowerCase() === filtroEstado;
    return matchBus && matchEst;
  });

  const COLORES = { Activa: "bg-green-100 text-green-700", Pausada: "bg-yellow-100 text-yellow-700", Eliminada: "bg-red-100 text-red-600" };

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
              {ofertas.filter(o => o.estadoAdmin === e).length} {e}s
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por cargo o empresa..." className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-esmeralda" />
        <div className="flex gap-2">
          {["todos", "activa", "pausada", "eliminada"].map((f) => (
            <button key={f} onClick={() => setFiltroEstado(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize ${filtroEstado === f ? "bg-azul-marino text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"}`}>
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
                <th className="px-5 py-3 text-left font-semibold text-azul-marino">Oferta</th>
                <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden md:table-cell">Ciudad</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Postulados</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lista.map((o) => (
                <tr key={o.id} className={`hover:bg-gray-50 transition-colors ${o.estadoAdmin === "Eliminada" ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-azul-marino">{o.cargo}</p>
                    <p className="text-gray-400 text-xs">{o.empresa} · {o.tipoContrato}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{o.ciudad}</td>
                  <td className="px-5 py-3 text-center hidden sm:table-cell">
                    <span className="font-bold text-azul-marino">{o.postulados}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLORES[o.estadoAdmin]}`}>{o.estadoAdmin}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex gap-1.5 justify-center">
                      {o.estadoAdmin !== "Activa" && (
                        <button onClick={() => cambiarEstado(o.id, "Activa")} className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2.5 py-1.5 rounded-lg font-semibold">
                          Aprobar
                        </button>
                      )}
                      {o.estadoAdmin === "Activa" && (
                        <button onClick={() => cambiarEstado(o.id, "Pausada")} className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-2.5 py-1.5 rounded-lg font-semibold">
                          Pausar
                        </button>
                      )}
                      {o.estadoAdmin !== "Eliminada" && (
                        <button onClick={() => cambiarEstado(o.id, "Eliminada")} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-lg font-semibold">
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
        {lista.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">📋</p><p>No se encontraron ofertas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
