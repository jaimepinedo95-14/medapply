import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { LABEL_PLAN, LIMITE_VACANTES } from "../../config/planesEmpresa";

function formatearDia(diaStr) {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(diaStr + "T00:00:00");
  const dias = Math.round((hoy.getTime() - fecha.getTime()) / 86400000);
  if (dias === 0) return "hoy";
  if (dias === 1) return "ayer";
  return `hace ${dias} días`;
}

export default function DashboardEmpresa() {
  const { usuario } = useAuth();
  const nombre = usuario?.nombre || "Empresa";

  const [stats, setStats] = useState({
    vacantesActivas: 0, totalPostulantes: 0, postulantesHoy: 0, plan: "gratuito",
  });
  const [actividad, setActividad] = useState([]);
  const [rendimiento, setRendimiento] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario?.id) return;
    cargar();
  }, [usuario?.id]);

  async function cargar() {
    try {
      const [{ data: ofertas }, { data: perfilEmpresa }] = await Promise.all([
        supabase
          .from("ofertas")
          .select("id, titulo, estado, postulaciones(count)")
          .eq("empresa_id", usuario.id),
        supabase
          .from("perfiles_empresa")
          .select("plan")
          .eq("usuario_id", usuario.id)
          .maybeSingle(),
      ]);

      const lista              = ofertas || [];
      const ofertaIds           = lista.map((o) => o.id);
      const ofertasMap          = Object.fromEntries(lista.map((o) => [o.id, o.titulo]));
      const vacantesActivas     = lista.filter((o) => o.estado === "activa").length;
      const totalPostulantes    = lista.reduce((s, o) => s + (o.postulaciones?.[0]?.count || 0), 0);
      const plan                = perfilEmpresa?.plan || "gratuito";

      let postulantesHoy = 0;
      let actividadReciente = [];

      if (ofertaIds.length > 0) {
        const inicioHoy = new Date(); inicioHoy.setHours(0, 0, 0, 0);
        const hace7Dias = new Date(Date.now() - 7 * 86400000);

        const [{ data: postsHoy }, { data: postsRecientes }] = await Promise.all([
          supabase
            .from("postulaciones")
            .select("id")
            .in("oferta_id", ofertaIds)
            .gte("fecha_postulacion", inicioHoy.toISOString()),
          supabase
            .from("postulaciones")
            .select("oferta_id, fecha_postulacion")
            .in("oferta_id", ofertaIds)
            .gte("fecha_postulacion", hace7Dias.toISOString())
            .order("fecha_postulacion", { ascending: false }),
        ]);

        postulantesHoy = postsHoy?.length || 0;

        const grupos = {};
        (postsRecientes || []).forEach((p) => {
          const dia = p.fecha_postulacion.slice(0, 10);
          const key = `${p.oferta_id}__${dia}`;
          grupos[key] = (grupos[key] || 0) + 1;
        });

        actividadReciente = Object.entries(grupos)
          .map(([key, count]) => {
            const [ofertaId, dia] = key.split("__");
            return { dia, count, titulo: ofertasMap[ofertaId] || "una vacante" };
          })
          .sort((a, b) => b.dia.localeCompare(a.dia))
          .slice(0, 6);
      }

      // Rendimiento por vacante activa: vistas (tabla visitas_ofertas si existe),
      // postulantes y tasa de conversión.
      const ofertasActivasList = lista.filter((o) => o.estado === "activa");
      let visitasPorOferta = {};
      if (ofertasActivasList.length > 0) {
        try {
          const { data: visitas, error: errVisitas } = await supabase
            .from("visitas_ofertas")
            .select("oferta_id")
            .in("oferta_id", ofertasActivasList.map((o) => o.id));
          if (!errVisitas) {
            (visitas || []).forEach((v) => {
              visitasPorOferta[v.oferta_id] = (visitasPorOferta[v.oferta_id] || 0) + 1;
            });
          }
        } catch (_) {
          // Tabla visitas_ofertas no existe todavía — se queda en 0
        }
      }

      const rendimientoVacantes = ofertasActivasList.map((o) => {
        const vistas = visitasPorOferta[o.id] || 0;
        const postulantesOferta = o.postulaciones?.[0]?.count || 0;
        const conversion = vistas > 0 ? Math.round((postulantesOferta / vistas) * 100) : 0;
        return { id: o.id, titulo: o.titulo, vistas, postulantes: postulantesOferta, conversion };
      });

      setStats({ vacantesActivas, totalPostulantes, postulantesHoy, plan });
      setActividad(actividadReciente);
      setRendimiento(rendimientoVacantes);
    } catch (_) {
      // silencioso
    } finally {
      setCargando(false);
    }
  }

  const limite = LIMITE_VACANTES[stats.plan] ?? 1;
  const enLimite = Number.isFinite(limite) && stats.vacantesActivas >= limite;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">¡Hola, {nombre}! 👋</h1>
        <p className="text-gray-500 mt-1">Gestiona tus vacantes y encuentra el talento que necesitas.</p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Vacantes activas",       valor: cargando ? "..." : String(stats.vacantesActivas),  icono: "📋", color: "bg-blue-50 border-blue-100" },
          { label: "Total postulantes",      valor: cargando ? "..." : String(stats.totalPostulantes), icono: "👥", color: "bg-green-50 border-green-100" },
          { label: "Postulantes nuevos hoy", valor: cargando ? "..." : String(stats.postulantesHoy),   icono: "✨", color: "bg-purple-50 border-purple-100" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200 ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icono}</div>
            <p className="text-3xl font-bold text-azul-marino">{stat.valor}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerta de límite de plan */}
      {!cargando && enLimite && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-yellow-800 font-semibold text-sm">
              Estás en el límite de tu plan {LABEL_PLAN[stats.plan]} ({stats.vacantesActivas}/{limite} vacantes activas)
            </p>
            <p className="text-yellow-700 text-xs mt-0.5">
              Mejora tu plan para publicar más vacantes y desbloquear más beneficios.{" "}
              <Link to="/empresa/plan" className="font-bold underline">Ver planes →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Actividad reciente */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-azul-marino">Actividad reciente</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {cargando ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
              </div>
            ))
          ) : actividad.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              Aún no hay actividad reciente. Cuando alguien se postule a tus vacantes, lo verás aquí.
            </div>
          ) : (
            actividad.map((a, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-3">
                <span className="text-xl flex-shrink-0">👤</span>
                <p className="text-sm text-gray-600">
                  <strong className="text-azul-marino">{a.count}</strong>{" "}
                  {a.count === 1 ? "candidato aplicó" : "candidatos aplicaron"} a{" "}
                  <strong className="text-azul-marino">{a.titulo}</strong> {formatearDia(a.dia)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rendimiento de tus vacantes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-azul-marino">Rendimiento de tus vacantes</h2>
        </div>
        {cargando ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : rendimiento.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">
            Publica tu primera vacante para ver estadísticas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left font-semibold text-azul-marino">Cargo</th>
                  <th className="px-4 py-3 text-center font-semibold text-azul-marino">Vistas</th>
                  <th className="px-4 py-3 text-center font-semibold text-azul-marino">Postulantes</th>
                  <th className="px-4 py-3 text-center font-semibold text-azul-marino">Conversión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rendimiento.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-3 font-medium text-azul-marino truncate max-w-xs">{r.titulo}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{r.vistas}</td>
                    <td className="px-4 py-3 text-center font-bold text-esmeralda">{r.postulantes}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        r.conversion >= 10 ? "bg-green-100 text-green-700"
                        : r.conversion > 0 ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-400"
                      }`}>
                        {r.conversion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/empresa/publicar-oferta" className="bg-gradient-to-br from-[#0ba870] to-esmeralda-hover hover:brightness-105 text-white rounded-2xl p-5 flex items-center gap-4 transition-all shadow-btn active:scale-[0.99]">
          <span className="text-3xl">➕</span>
          <div>
            <p className="font-bold">Publicar nueva vacante</p>
            <p className="text-green-100 text-sm">Llega a miles de profesionales</p>
          </div>
        </Link>
        <Link to="/empresa/candidatos" className="bg-gradient-to-br from-azul-claro to-azul-marino hover:brightness-105 text-white rounded-2xl p-5 flex items-center gap-4 transition-all shadow-btn active:scale-[0.99]">
          <span className="text-3xl">👥</span>
          <div>
            <p className="font-bold">Ver candidatos</p>
            <p className="text-blue-200 text-sm">Revisa quién se ha postulado</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
