import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const COLORES_ESTADO = {
  pendiente:       "bg-yellow-100 text-yellow-700",
  en_revision:     "bg-yellow-100 text-yellow-700",
  vista:           "bg-blue-100 text-blue-700",
  preseleccionada: "bg-green-100 text-green-700",
  aceptada:        "bg-green-100 text-green-700",
  rechazada:       "bg-red-100 text-red-700",
};

const LABEL_ESTADO = {
  pendiente:       "En revisión",
  en_revision:     "En revisión",
  vista:           "Visto",
  preseleccionada: "Preseleccionado",
  aceptada:        "Aceptado",
  rechazada:       "Descartado",
};

export default function DashboardCandidato() {
  const { usuario } = useAuth();
  const nombre = usuario?.nombre?.split(" ")[0] || "Profesional";

  const [postulaciones, setPostulaciones] = useState([]);
  const [stats, setStats] = useState({ activas: 0, ofertasHoy: 0, porcentajePerfil: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario?.id) return;
    cargar();
  }, [usuario?.id]);

  async function cargar() {
    try {
      const hoyMenos24h = new Date(Date.now() - 86400000).toISOString();

      const [{ data: posts }, { count: ofertasHoy }, { data: perfil }] = await Promise.all([
        supabase
          .from("postulaciones")
          .select("id, estado, fecha_postulacion, oferta_id")
          .eq("candidato_id", usuario.id)
          .order("fecha_postulacion", { ascending: false })
          .limit(3),
        supabase
          .from("ofertas")
          .select("id", { count: "exact", head: true })
          .eq("estado", "activa")
          .gte("fecha_publicacion", hoyMenos24h),
        supabase
          .from("perfiles_candidato")
          .select("porcentaje_perfil")
          .eq("usuario_id", usuario.id)
          .maybeSingle(),
      ]);

      if (posts?.length > 0) {
        const ofertaIds = posts.map((p) => p.oferta_id);
        const { data: ofertas } = await supabase
          .from("ofertas_con_empresa")
          .select("id, titulo, ciudad, nombre_empresa")
          .in("id", ofertaIds);

        const ofertasMap = Object.fromEntries((ofertas || []).map((o) => [o.id, o]));
        setPostulaciones(posts.map((p) => ({ ...p, oferta: ofertasMap[p.oferta_id] })));
      } else {
        setPostulaciones([]);
      }

      const activas = (posts || []).filter((p) => p.estado !== "rechazada").length;
      setStats({
        activas,
        ofertasHoy: ofertasHoy || 0,
        porcentajePerfil: perfil?.porcentaje_perfil || 0,
      });
    } catch (_) {
      // silencioso
    } finally {
      setCargando(false);
    }
  }

  const perfilCompleto = stats.porcentajePerfil >= 80;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">¡Hola, {nombre}!</h1>
        <p className="text-gray-500 mt-1">Aquí tienes un resumen de tu actividad en MedApply.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Postulaciones activas", valor: cargando ? "..." : String(stats.activas),          icono: "📤", color: "bg-blue-50 border-blue-100" },
          { label: "Ofertas nuevas hoy",    valor: cargando ? "..." : String(stats.ofertasHoy),       icono: "🔔", color: "bg-green-50 border-green-100" },
          { label: "Perfil completado",     valor: cargando ? "..." : `${stats.porcentajePerfil}%`,  icono: "👤", color: "bg-yellow-50 border-yellow-100" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icono}</div>
            <p className="text-3xl font-bold text-azul-marino">{stat.valor}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {!perfilCompleto && !cargando && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-yellow-800 font-semibold text-sm">Tu perfil está incompleto</p>
            <p className="text-yellow-700 text-xs mt-0.5">
              Completa tu experiencia laboral y educación para aumentar tus posibilidades.{" "}
              <Link to="/candidato/perfil" className="font-bold underline">Completar ahora →</Link>
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-azul-marino">Mis últimas postulaciones</h2>
          <Link to="/candidato/postulaciones" className="text-esmeralda text-sm font-semibold hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {cargando ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : postulaciones.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              Aún no te has postulado a ninguna oferta.{" "}
              <Link to="/empleos" className="text-esmeralda font-semibold underline">Buscar ofertas →</Link>
            </div>
          ) : (
            postulaciones.map((p) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-azul-marino text-sm truncate">{p.oferta?.titulo || "Oferta"}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {p.oferta?.nombre_empresa} · {p.oferta?.ciudad}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${COLORES_ESTADO[p.estado] || "bg-gray-100 text-gray-500"}`}>
                    {LABEL_ESTADO[p.estado] || p.estado}
                  </span>
                  <span className="text-gray-400 text-xs hidden sm:block">
                    {new Date(p.fecha_postulacion).toLocaleDateString("es-CO")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link to="/empleos" className="bg-gradient-to-br from-[#0ba870] to-esmeralda-hover hover:brightness-105 text-white rounded-2xl p-5 flex items-center gap-4 transition-all shadow-btn active:scale-[0.99]">
          <span className="text-3xl">🔍</span>
          <div>
            <p className="font-bold">Buscar nuevas ofertas</p>
            <p className="text-green-100 text-sm">{stats.ofertasHoy} ofertas nuevas hoy</p>
          </div>
        </Link>
        <Link to="/candidato/perfil" className="bg-gradient-to-br from-azul-claro to-azul-marino hover:brightness-105 text-white rounded-2xl p-5 flex items-center gap-4 transition-all shadow-btn active:scale-[0.99]">
          <span className="text-3xl">📝</span>
          <div>
            <p className="font-bold">Completar mi perfil</p>
            <p className="text-blue-200 text-sm">Sube tu hoja de vida</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
