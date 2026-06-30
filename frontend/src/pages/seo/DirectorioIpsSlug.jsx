import { useState, useEffect, useCallback } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { CIUDADES_SEO } from "../../config/seo";
import SEOHead from "../../components/seo/SEOHead";
import VacanteCard from "../../components/seo/VacanteCard";
import { SkeletonGrid } from "../../components/seo/SkeletonCard";

const TIMEOUT_MS = 5000;

function withTimeout(p) {
  return Promise.race([
    p,
    new Promise((_, r) => setTimeout(() => r(new Error("La consulta tardó demasiado.")), TIMEOUT_MS)),
  ]);
}

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function DirectorioIpsSlug() {
  const { ciudad: ciudadSlug, slugIps } = useParams();
  const cityConfig = CIUDADES_SEO.find(c => c.slug === ciudadSlug);

  const [ipsData, setIpsData]   = useState(null);
  const [ofertas, setOfertas]   = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  const cargar = useCallback(async () => {
    if (!cityConfig) return;
    setCargando(true);
    setError(null);
    try {
      // 1. Obtener todas las IPS de la ciudad para encontrar la que coincide con el slug
      const resIps = await withTimeout(
        supabase.from("ofertas_con_empresa")
          .select("empresa_id, nombre_empresa, logo_empresa, tipo_empresa")
          .eq("ciudad", cityConfig.db)
          .eq("estado", "activa")
      );
      if (resIps.error) throw resIps.error;

      // Deduplicar
      const mapa = {};
      (resIps.data ?? []).forEach(row => {
        if (row.empresa_id && !mapa[row.empresa_id]) {
          mapa[row.empresa_id] = {
            id:     row.empresa_id,
            nombre: row.nombre_empresa || "Institución",
            logo:   row.logo_empresa,
            tipo:   row.tipo_empresa,
            slug:   slugify(row.nombre_empresa || row.empresa_id),
          };
        }
      });

      const ipsEncontrada = Object.values(mapa).find(i => i.slug === slugIps);
      if (!ipsEncontrada) {
        setIpsData(null);
        setCargando(false);
        return;
      }
      setIpsData(ipsEncontrada);

      // 2. Vacantes activas de esa IPS
      const resOfertas = await withTimeout(
        supabase.from("ofertas_con_empresa")
          .select("*")
          .eq("empresa_id", ipsEncontrada.id)
          .eq("estado", "activa")
          .order("fecha_publicacion", { ascending: false })
      );
      if (resOfertas.error) throw resOfertas.error;
      setOfertas(resOfertas.data ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [cityConfig, slugIps]);

  useEffect(() => { cargar(); }, [cargar]);

  if (!cityConfig) return <Navigate to="/empleos" replace />;

  if (!cargando && !ipsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-3">🏥</p>
          <h2 className="text-xl font-bold text-azul-marino mb-2">Institución no encontrada</h2>
          <p className="text-gray-400 text-sm mb-4">Es posible que ya no tenga vacantes activas en {cityConfig.nombre}.</p>
          <Link to={`/directorio/ips/${ciudadSlug}`} className="btn-primario text-sm py-2.5 px-6">
            Ver directorio de {cityConfig.nombre}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {ipsData && (
        <SEOHead
          title={`${ipsData.nombre} en ${cityConfig.nombre} — Empleos y datos | MedApply`}
          description={`Vacantes activas en ${ipsData.nombre}, ${cityConfig.nombre}. Datos verificados REPS. Aplica hoy.`}
          canonical={`https://medapply.co/directorio/ips/${ciudadSlug}/${slugIps}`}
        />
      )}

      {/* Hero */}
      <div className="bg-azul-marino py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-blue-300 mb-4 flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-white">Inicio</Link>
            <span>›</span>
            <Link to={`/directorio/ips/${ciudadSlug}`} className="hover:text-white">
              IPS en {cityConfig.nombre}
            </Link>
            <span>›</span>
            <span className="text-white font-medium truncate">{ipsData?.nombre ?? "..."}</span>
          </nav>

          {cargando ? (
            <div className="h-8 bg-white/10 rounded-xl w-64 animate-pulse" />
          ) : (
            <>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {ipsData?.logo
                    ? <img src={ipsData.logo} alt="" className="w-full h-full object-cover" />
                    : <span className="text-2xl">🏥</span>}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{ipsData?.nombre}</h1>
                  {ipsData?.tipo && <p className="text-blue-200 text-sm mt-0.5">{ipsData.tipo}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-white/10 text-white px-3 py-1.5 rounded-xl">
                  📍 {cityConfig.nombre}
                </span>
                <span className="bg-white/10 text-white px-3 py-1.5 rounded-xl">
                  🏥 <strong>{ofertas.length}</strong> vacantes activas
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Vacantes */}
        <h2 className="text-lg font-bold text-azul-marino mb-4">Vacantes activas</h2>
        {cargando ? (
          <SkeletonGrid cantidad={4} />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
            <p className="text-red-500 font-semibold mb-2">Error al cargar</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button onClick={cargar} className="btn-primario text-sm py-2 px-6">Reintentar</button>
          </div>
        ) : ofertas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-5xl mb-3">📋</p>
            <h3 className="text-lg font-bold text-azul-marino mb-2">Sin vacantes activas en este momento</h3>
            <p className="text-gray-400 text-sm">Esta institución no tiene ofertas activas actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ofertas.map(o => <VacanteCard key={o.id} oferta={o} />)}
          </div>
        )}

        {/* CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="font-bold text-azul-marino mb-2">¿Trabajas aquí?</h3>
            <p className="text-sm text-gray-500 mb-3">
              Conéctate con tu empleador en MedApply y gestiona tu perfil profesional.
            </p>
            <Link to="/registro/candidato" className="btn-primario text-sm py-2 px-4 inline-block">
              Crear mi perfil gratis
            </Link>
          </div>
          <div className="bg-esmeralda/5 border border-esmeralda/20 rounded-2xl p-5">
            <h3 className="font-bold text-azul-marino mb-2">¿Eres esta institución?</h3>
            <p className="text-sm text-gray-500 mb-3">
              Publica vacantes gratis y llega a los mejores profesionales del sector salud.
            </p>
            <Link to="/registro/empresa" className="bg-esmeralda hover:bg-esmeralda-hover text-white font-semibold text-sm py-2 px-4 rounded-xl transition-colors inline-block">
              Publicar vacantes gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
