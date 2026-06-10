import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function DashboardEmpresa() {
  const { usuario } = useAuth();
  const nombre = usuario?.nombre || "Empresa";

  const [stats, setStats]               = useState({ ofertasActivas: 0, candidatosPostulados: 0, plan: "gratuito" });
  const [ofertasRecientes, setOfertasRecientes] = useState([]);
  const [cargando, setCargando]         = useState(true);

  useEffect(() => {
    if (!usuario?.id) return;
    cargar();
  }, [usuario?.id]);

  async function cargar() {
    try {
      const [{ data: todasOfertas }, { data: perfilEmpresa }] = await Promise.all([
        supabase
          .from("ofertas")
          .select("id, titulo, estado, fecha_publicacion, postulaciones(count)")
          .eq("empresa_id", usuario.id)
          .order("fecha_publicacion", { ascending: false }),
        supabase
          .from("perfiles_empresa")
          .select("plan")
          .eq("usuario_id", usuario.id)
          .maybeSingle(),
      ]);

      const lista             = todasOfertas || [];
      const ofertasActivas    = lista.filter((o) => o.estado === "activa").length;
      const candidatosPostulados = lista.reduce((s, o) => s + (o.postulaciones?.[0]?.count || 0), 0);
      const plan              = perfilEmpresa?.plan || "gratuito";

      setStats({ ofertasActivas, candidatosPostulados, plan });
      setOfertasRecientes(lista.slice(0, 3));
    } catch (_) {
      // silencioso
    } finally {
      setCargando(false);
    }
  }

  function formatearFecha(fecha) {
    if (!fecha) return "";
    const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
    if (dias === 0) return "hoy";
    if (dias === 1) return "hace 1 día";
    if (dias < 7)  return `hace ${dias} días`;
    const semanas = Math.floor(dias / 7);
    if (semanas === 1) return "hace 1 semana";
    if (semanas < 4)  return `hace ${semanas} semanas`;
    return `hace ${Math.floor(dias / 30)} meses`;
  }

  const planLabel = { gratuito: "Gratis", basico: "Básico", premium: "Premium" };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">¡Hola, {nombre}! 👋</h1>
        <p className="text-gray-500 mt-1">Gestiona tus ofertas y encuentra el talento que necesitas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Ofertas activas",       valor: cargando ? "..." : String(stats.ofertasActivas),        icono: "📋", color: "bg-blue-50 border-blue-100" },
          { label: "Candidatos postulados", valor: cargando ? "..." : String(stats.candidatosPostulados),  icono: "👥", color: "bg-green-50 border-green-100" },
          { label: "Plan actual",           valor: cargando ? "..." : (planLabel[stats.plan] || "Gratis"), icono: "⭐", color: "bg-yellow-50 border-yellow-100" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icono}</div>
            <p className="text-3xl font-bold text-azul-marino">{stat.valor}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {stats.plan === "gratuito" && !cargando && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <p className="text-yellow-800 font-semibold text-sm">Estás en el plan gratuito (1 oferta activa al mes)</p>
            <p className="text-yellow-700 text-xs mt-0.5">
              Actualiza tu plan para publicar más ofertas y acceder al banco de hojas de vida.{" "}
              <Link to="/empresa/suscripcion" className="font-bold underline">Ver planes →</Link>
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-azul-marino">Mis últimas ofertas</h2>
          <Link to="/empresa/ofertas" className="text-esmeralda text-sm font-semibold hover:underline">Ver todas →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {cargando ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : ofertasRecientes.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              Aún no has publicado ninguna oferta.{" "}
              <Link to="/empresa/publicar-oferta" className="text-esmeralda font-semibold underline">Publicar ahora →</Link>
            </div>
          ) : (
            ofertasRecientes.map((o) => (
              <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-azul-marino text-sm truncate">{o.titulo}</p>
                  <p className="text-gray-400 text-xs mt-0.5">Publicada {formatearFecha(o.fecha_publicacion)}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center hidden sm:block">
                    <p className="font-bold text-azul-marino">{o.postulaciones?.[0]?.count || 0}</p>
                    <p className="text-gray-400 text-xs">postulados</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    o.estado === "activa" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {o.estado === "activa" ? "Activa" : "Cerrada"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/empresa/publicar-oferta" className="bg-gradient-to-br from-[#0ba870] to-esmeralda-hover hover:brightness-105 text-white rounded-2xl p-5 flex items-center gap-4 transition-all shadow-btn active:scale-[0.99]">
          <span className="text-3xl">➕</span>
          <div>
            <p className="font-bold">Publicar nueva oferta</p>
            <p className="text-green-100 text-sm">Llega a miles de profesionales</p>
          </div>
        </Link>
        <Link to="/empresa/candidatos" className="bg-gradient-to-br from-azul-claro to-azul-marino hover:brightness-105 text-white rounded-2xl p-5 flex items-center gap-4 transition-all shadow-btn active:scale-[0.99]">
          <span className="text-3xl">👥</span>
          <div>
            <p className="font-bold">Banco de candidatos</p>
            <p className="text-blue-200 text-sm">Disponible en plan Premium</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
