import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const CONFIG_ESTADO = {
  pendiente:       { color: "bg-yellow-100 text-yellow-700", icono: "⏳", label: "En revisión" },
  en_revision:     { color: "bg-yellow-100 text-yellow-700", icono: "⏳", label: "En revisión" },
  vista:           { color: "bg-blue-100 text-blue-700",     icono: "👁",  label: "Visto" },
  preseleccionada: { color: "bg-green-100 text-green-700",   icono: "✅", label: "Preseleccionado" },
  aceptada:        { color: "bg-green-100 text-green-700",   icono: "🎉", label: "Aceptado" },
  rechazada:       { color: "bg-red-100 text-red-700",       icono: "❌", label: "Descartado" },
};

const FILTROS = [
  { key: "todas",          label: "todas" },
  { key: "activas",        label: "en revisión" },
  { key: "vista",          label: "visto" },
  { key: "preseleccionada",label: "preseleccionado" },
  { key: "rechazada",      label: "descartado" },
];

export default function MisPostulaciones() {
  const { usuario } = useAuth();
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    if (!usuario?.id) return;
    cargar();
  }, [usuario?.id]);

  async function cargar() {
    try {
      const { data: posts } = await supabase
        .from("postulaciones")
        .select("id, estado, fecha_postulacion, oferta_id")
        .eq("candidato_id", usuario.id)
        .order("fecha_postulacion", { ascending: false });

      if (posts?.length > 0) {
        const ofertaIds = posts.map((p) => p.oferta_id);
        const { data: ofertas } = await supabase
          .from("ofertas_con_empresa")
          .select("id, titulo, ciudad, tipo_contrato, nombre_empresa, logo_empresa")
          .in("id", ofertaIds);

        const ofertasMap = Object.fromEntries((ofertas || []).map((o) => [o.id, o]));
        setPostulaciones(posts.map((p) => ({ ...p, oferta: ofertasMap[p.oferta_id] })));
      } else {
        setPostulaciones([]);
      }
    } catch (_) {
      // silencioso
    } finally {
      setCargando(false);
    }
  }

  const lista = filtro === "todas"
    ? postulaciones
    : filtro === "activas"
    ? postulaciones.filter((p) => ["pendiente", "en_revision"].includes(p.estado))
    : postulaciones.filter((p) => p.estado === filtro);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Mis postulaciones</h1>
        <p className="text-gray-500 text-sm mt-1">Sigue el estado de tus aplicaciones a ofertas de empleo.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filtro === f.key
                ? "bg-azul-marino text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-azul-marino"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : lista.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">{postulaciones.length === 0 ? "📭" : "🔍"}</p>
          <p className="text-sm font-semibold text-gray-500">
            {postulaciones.length === 0
              ? "Aún no te has postulado a ninguna oferta."
              : "No hay postulaciones con este filtro."}
          </p>
          {postulaciones.length === 0 && (
            <Link to="/empleos" className="mt-4 inline-block text-esmeralda font-semibold underline text-sm">
              Buscar ofertas →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((p) => {
            const cfg = CONFIG_ESTADO[p.estado] || { color: "bg-gray-100 text-gray-500", icono: "•", label: p.estado };
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                  {p.oferta?.logo_empresa
                    ? <img src={p.oferta.logo_empresa} alt="" className="w-full h-full object-cover rounded-xl" />
                    : "🏥"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-azul-marino">{p.oferta?.titulo || "Oferta"}</p>
                  <p className="text-gray-500 text-sm">{p.oferta?.nombre_empresa || "—"} · {p.oferta?.ciudad || "—"}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {p.oferta?.tipo_contrato} · Aplicado el {new Date(p.fecha_postulacion).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                    {cfg.icono} {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link to="/empleos" className="btn-primario inline-block">Buscar más ofertas</Link>
      </div>
    </div>
  );
}
