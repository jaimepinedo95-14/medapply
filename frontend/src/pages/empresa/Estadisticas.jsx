import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

// ── Gráfica de barras SVG ─────────────────────────────────────────────────────
function GraficaBarras({ datos }) {
  if (!datos.length) return null;
  const max = Math.max(...datos.map((d) => d.valor), 1);
  const H = 100;
  const barW = Math.floor(500 / datos.length) - 2;

  return (
    <div className="overflow-x-auto">
      <svg width="100%" viewBox={`0 0 ${datos.length * (barW + 2)} ${H + 28}`} preserveAspectRatio="none"
        className="min-w-[480px]">
        {datos.map((d, i) => {
          const bh = Math.max(Math.round((d.valor / max) * H), d.valor > 0 ? 3 : 1);
          const x  = i * (barW + 2);
          const y  = H - bh;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={bh}
                fill={d.valor > 0 ? "#059669" : "#e5e7eb"} rx="2"
                className="transition-all duration-300"
              />
              {d.valor > 0 && (
                <text x={x + barW / 2} y={y - 3} textAnchor="middle"
                  fontSize="7" fill="#374151" fontFamily="sans-serif">
                  {d.valor}
                </text>
              )}
              <text x={x + barW / 2} y={H + 16} textAnchor="middle"
                fontSize="7" fill="#9ca3af" fontFamily="sans-serif">
                {d.etiqueta}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Tarjeta de stat ────────────────────────────────────────────────────────────
function TarjetaStat({ icono, label, valor, sub, color = "bg-gray-50 border-gray-100" }) {
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="text-2xl mb-2">{icono}</div>
      <p className="text-3xl font-bold text-azul-marino">{valor}</p>
      <p className="text-gray-500 text-sm mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── Gate de plan (no premium) ─────────────────────────────────────────────────
function GatePremium({ plan }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-azul-marino to-azul-claro text-white rounded-3xl p-8 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">Estadísticas avanzadas</h2>
        <p className="text-blue-200 text-sm mb-6 leading-relaxed">
          Accede a métricas detalladas por oferta: visitas, postulaciones, tasa de conversión,
          ciudades de origen y gráficas de actividad. Disponible en el plan <strong className="text-white">Premium</strong>.
        </p>
        <div className="bg-white/10 rounded-2xl p-5 mb-6 text-left space-y-3">
          {[
            "📈 Visitas por oferta en tiempo real",
            "✅ Tasa de conversión visita → postulación",
            "📅 Gráfica de actividad por día",
            "🌍 Ciudades de donde llegan tus candidatos",
            "💬 Estadísticas de mensajes enviados",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-blue-100">
              <span>{f}</span>
            </div>
          ))}
        </div>
        {plan === "basico" ? (
          <p className="text-blue-200 text-xs mb-4">
            Estás en el plan <strong className="text-white">Básico</strong>. Actualiza a Premium para desbloquear estas métricas.
          </p>
        ) : (
          <p className="text-blue-200 text-xs mb-4">
            Estás en el plan <strong className="text-white">Gratuito</strong>. Actualiza para acceder a estadísticas.
          </p>
        )}
        <Link to="/empresa/suscripcion"
          className="inline-block bg-white text-azul-marino font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-btn">
          Ver planes y precios →
        </Link>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Estadisticas() {
  const { usuario } = useAuth();

  const [plan, setPlan]               = useState(null);
  const [cargandoPlan, setCargandoPlan] = useState(true);
  const [cargandoStats, setCargandoStats] = useState(false);

  const [resumen, setResumen]         = useState({ visitas: 0, postulaciones: 0, mensajes: 0 });
  const [porOferta, setPorOferta]     = useState([]);
  const [graficaDias, setGraficaDias] = useState([]);
  const [topCiudades, setTopCiudades] = useState([]);

  // 1. Cargar plan de la empresa
  useEffect(() => {
    if (!usuario?.id) return;
    supabase
      .from("perfiles_empresa")
      .select("plan")
      .eq("usuario_id", usuario.id)
      .maybeSingle()
      .then(({ data }) => {
        setPlan(data?.plan || "gratuito");
        setCargandoPlan(false);
      })
      .catch(() => { setPlan("gratuito"); setCargandoPlan(false); });
  }, [usuario?.id]);

  // 2. Si es premium, cargar stats
  useEffect(() => {
    if (plan !== "premium" || !usuario?.id) return;
    cargarStats();
  }, [plan, usuario?.id]);

  async function cargarStats() {
    setCargandoStats(true);
    try {
      // a. Ofertas de la empresa con conteo de postulaciones
      const { data: ofertas } = await supabase
        .from("ofertas")
        .select("id, titulo, estado, postulaciones(count)")
        .eq("empresa_id", usuario.id)
        .order("fecha_publicacion", { ascending: false });

      const lista      = ofertas || [];
      const ofertaIds  = lista.map((o) => o.id);

      if (!ofertaIds.length) {
        setCargandoStats(false);
        return;
      }

      // b. Visitas por oferta
      const { data: visitasData } = await supabase
        .from("visitas_ofertas")
        .select("oferta_id, created_at")
        .in("oferta_id", ofertaIds);

      const visitasRaw = visitasData || [];

      // c. Postulaciones últimos 30 días (para gráfica)
      const hace30 = new Date(Date.now() - 30 * 86400000).toISOString();
      const { data: postsRecientes } = await supabase
        .from("postulaciones")
        .select("fecha_postulacion")
        .in("oferta_id", ofertaIds)
        .gte("fecha_postulacion", hace30);

      // d. Ciudades de candidatos postulados
      const { data: postsAll } = await supabase
        .from("postulaciones")
        .select("candidato_id")
        .in("oferta_id", ofertaIds);

      const candidatoIds = [...new Set((postsAll || []).map((p) => p.candidato_id))];
      let ciudadesRaw = [];
      if (candidatoIds.length > 0) {
        const { data: perfiles } = await supabase
          .from("perfiles_candidato")
          .select("ciudad")
          .in("usuario_id", candidatoIds);
        ciudadesRaw = (perfiles || []).map((p) => p.ciudad).filter(Boolean);
      }

      // e. Mensajes enviados por la empresa
      const { count: mensajesCount } = await supabase
        .from("mensajes")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", usuario.id);

      // ── Procesar datos ──────────────────────────────────────────────────────

      // Visitas por oferta_id
      const visitasPorOferta = {};
      visitasRaw.forEach((v) => {
        visitasPorOferta[v.oferta_id] = (visitasPorOferta[v.oferta_id] || 0) + 1;
      });

      // Tabla por oferta
      const tablaOfertas = lista.map((o) => {
        const vistas = visitasPorOferta[o.id] || 0;
        const posts  = o.postulaciones?.[0]?.count || 0;
        const conv   = vistas > 0 ? Math.round((posts / vistas) * 100) : 0;
        return { id: o.id, titulo: o.titulo, estado: o.estado, vistas, posts, conv };
      });

      // Totales
      const totalVisitas = visitasRaw.length;
      const totalPosts   = lista.reduce((s, o) => s + (o.postulaciones?.[0]?.count || 0), 0);

      // Gráfica: postulaciones por día (últimos 14 días)
      const dias = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(Date.now() - (13 - i) * 86400000);
        return {
          fecha:   d.toISOString().slice(0, 10),
          etiqueta: `${d.getDate()}/${d.getMonth() + 1}`,
          valor:   0,
        };
      });
      (postsRecientes || []).forEach((p) => {
        const dia = p.fecha_postulacion?.slice(0, 10);
        const idx = dias.findIndex((d) => d.fecha === dia);
        if (idx !== -1) dias[idx].valor++;
      });

      // Top ciudades
      const contCiudades = {};
      ciudadesRaw.forEach((c) => { contCiudades[c] = (contCiudades[c] || 0) + 1; });
      const top = Object.entries(contCiudades)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([ciudad, count]) => ({ ciudad, count }));

      setResumen({ visitas: totalVisitas, postulaciones: totalPosts, mensajes: mensajesCount || 0 });
      setPorOferta(tablaOfertas);
      setGraficaDias(dias);
      setTopCiudades(top);
    } catch (_) {
      // silencioso
    } finally {
      setCargandoStats(false);
    }
  }

  // ── Renders ───────────────────────────────────────────────────────────────

  if (cargandoPlan) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (plan !== "premium") {
    return <GatePremium plan={plan} />;
  }

  const convGlobal = resumen.visitas > 0
    ? Math.round((resumen.postulaciones / resumen.visitas) * 100)
    : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-azul-marino">Estadísticas</h1>
        <p className="text-gray-500 text-sm mt-1">Analítica de tus ofertas y candidatos.</p>
      </div>

      {cargandoStats ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Resumen global ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <TarjetaStat icono="👁" label="Total visitas" valor={resumen.visitas}
              color="bg-blue-50 border-blue-100" />
            <TarjetaStat icono="✅" label="Postulaciones" valor={resumen.postulaciones}
              color="bg-green-50 border-green-100" />
            <TarjetaStat icono="📈" label="Conversión" valor={`${convGlobal}%`}
              sub="Visitas → Postulación" color="bg-purple-50 border-purple-100" />
            <TarjetaStat icono="💬" label="Mensajes enviados" valor={resumen.mensajes}
              color="bg-yellow-50 border-yellow-100" />
          </div>

          {/* ── Tabla por oferta ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-azul-marino">Rendimiento por oferta</h2>
            </div>
            {porOferta.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">Aún no tienes ofertas publicadas.</p>
                <Link to="/empresa/publicar-oferta" className="mt-3 inline-block text-esmeralda text-sm font-semibold hover:underline">
                  Publicar primera oferta →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3 text-left font-semibold text-azul-marino">Oferta</th>
                      <th className="px-4 py-3 text-center font-semibold text-azul-marino">Estado</th>
                      <th className="px-4 py-3 text-center font-semibold text-azul-marino">Visitas</th>
                      <th className="px-4 py-3 text-center font-semibold text-azul-marino">Postulaciones</th>
                      <th className="px-4 py-3 text-center font-semibold text-azul-marino">Conversión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {porOferta.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-azul-marino truncate max-w-xs">{o.titulo}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            o.estado === "activa" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}>
                            {o.estado === "activa" ? "Activa" : "Cerrada"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-azul-marino">{o.vistas}</td>
                        <td className="px-4 py-3 text-center font-bold text-esmeralda">{o.posts}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            o.conv >= 10 ? "bg-green-100 text-green-700"
                            : o.conv > 0 ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-400"
                          }`}>
                            {o.conv}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Gráfica postulaciones por día ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-azul-marino mb-4">
              Postulaciones por día — últimos 14 días
            </h2>
            {graficaDias.every((d) => d.valor === 0) ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                Aún no hay postulaciones en este período.
              </div>
            ) : (
              <GraficaBarras datos={graficaDias} />
            )}
          </div>

          {/* ── Ciudades de candidatos ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-azul-marino mb-4">
              Ciudades de los candidatos postulados
            </h2>
            {topCiudades.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Sin datos aún — las ciudades aparecen cuando los candidatos se postulan.
              </p>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const maxCiudad = topCiudades[0]?.count || 1;
                  return topCiudades.map((item) => (
                    <div key={item.ciudad} className="flex items-center gap-3">
                      <span className="text-sm text-azul-marino font-medium w-36 flex-shrink-0 truncate">
                        {item.ciudad}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-esmeralda h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((item.count / maxCiudad) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500 w-6 text-right flex-shrink-0">
                        {item.count}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
