import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const COLORES_PLAN = {
  premium:   "bg-esmeralda text-white",
  basico:    "bg-blue-100 text-blue-700",
  destacado: "bg-yellow-100 text-yellow-700",
};

const LABEL_PLAN = {
  premium:   "Premium",
  basico:    "Básico",
  destacado: "Destacado",
};

export default function GestionSuscripciones() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [cargando, setCargando]           = useState(true);
  const [error, setError]                 = useState(null);
  const [filtroTipo, setFiltroTipo]       = useState("todos");

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("suscripciones")
        .select("*, usuarios!inner(nombre, email, rol)")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setSuscripciones(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  const activas        = suscripciones.filter((s) => s.activo);
  const totalRecaudado = activas.reduce((sum, s) => sum + (s.precio || 0), 0);

  const lista = suscripciones.filter((s) => {
    if (filtroTipo === "todos") return true;
    return s.usuarios?.rol === filtroTipo;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Gestión de suscripciones</h1>
        <p className="text-gray-500 text-sm mt-1">Todos los planes activos en la plataforma.</p>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {cargando
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-4 bg-gray-50 animate-pulse h-24" />
            ))
          : [
              { label: "Total recaudado",     valor: `$${totalRecaudado.toLocaleString("es-CO")}`, icono: "💰", color: "bg-green-50 border-green-100" },
              { label: "Planes Premium",      valor: activas.filter((s) => s.plan === "premium").length,   icono: "⭐", color: "bg-esmeralda/10 border-esmeralda/20" },
              { label: "Planes Básico",       valor: activas.filter((s) => s.plan === "basico").length,    icono: "📦", color: "bg-blue-50 border-blue-100" },
              { label: "Perfiles Destacados", valor: activas.filter((s) => s.plan === "destacado").length, icono: "🏆", color: "bg-yellow-50 border-yellow-100" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
                <div className="text-xl mb-1">{s.icono}</div>
                <p className="text-xl font-bold text-azul-marino">{s.valor}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))
        }
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-5">
        {[
          { key: "todos",     label: "Todos" },
          { key: "empresa",   label: "Empresas" },
          { key: "candidato", label: "Candidatos" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltroTipo(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              filtroTipo === f.key
                ? "bg-azul-marino text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-500 font-semibold mb-2">Error al cargar suscripciones</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button onClick={cargar} className="btn-primario text-sm py-2 px-5">Reintentar</button>
          </div>
        ) : lista.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-4xl mb-3">💳</p>
            <p className="text-sm font-semibold text-gray-500">
              {suscripciones.length === 0
                ? "Aún no hay suscripciones registradas."
                : "No hay suscripciones con ese filtro."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">Usuario</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Tipo</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
                  <th className="px-5 py-3 text-right font-semibold text-azul-marino">Monto</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden md:table-cell">Fecha</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lista.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-azul-marino">{s.usuarios?.nombre || "—"}</p>
                      <p className="text-gray-400 text-xs">{s.usuarios?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-center hidden sm:table-cell">
                      <span className="text-xs text-gray-500 capitalize">{s.usuarios?.rol}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLORES_PLAN[s.plan] || "bg-gray-100 text-gray-500"}`}>
                        {LABEL_PLAN[s.plan] || s.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-azul-marino">
                      ${(s.precio || 0).toLocaleString("es-CO")}
                    </td>
                    <td className="px-5 py-3 text-center text-gray-400 text-xs hidden md:table-cell">
                      {new Date(s.created_at).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        s.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {s.activo ? "Activo" : "Vencido"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
