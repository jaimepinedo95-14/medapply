import { useState, useEffect, useCallback } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { CIUDADES_SEO, TEXTOS_SEO_CIUDAD } from "../../config/seo";
import SEOHead from "../../components/seo/SEOHead";
import { SkeletonGrid } from "../../components/seo/SkeletonCard";
import SEOTextBlock from "../../components/seo/SEOTextBlock";

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

export default function DirectorioIpsCiudad() {
  const { ciudad: ciudadSlug } = useParams();
  const cityConfig = CIUDADES_SEO.find(c => c.slug === ciudadSlug);

  const [ips, setIps]           = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  const cargar = useCallback(async () => {
    if (!cityConfig) return;
    setCargando(true);
    setError(null);
    try {
      const res = await withTimeout(
        supabase.from("ofertas_con_empresa")
          .select("empresa_id, nombre_empresa, logo_empresa, tipo_empresa")
          .eq("ciudad", cityConfig.db)
          .eq("estado", "activa")
      );
      if (res.error) throw res.error;

      // Deduplicar por empresa_id y contar vacantes
      const mapa = {};
      (res.data ?? []).forEach(row => {
        if (!row.empresa_id) return;
        if (!mapa[row.empresa_id]) {
          mapa[row.empresa_id] = {
            id:     row.empresa_id,
            nombre: row.nombre_empresa || "Institución confidencial",
            logo:   row.logo_empresa,
            tipo:   row.tipo_empresa,
            vacantes: 0,
            slug:   slugify(row.nombre_empresa || row.empresa_id),
          };
        }
        mapa[row.empresa_id].vacantes += 1;
      });

      setIps(Object.values(mapa).sort((a, b) => b.vacantes - a.vacantes));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [cityConfig]);

  useEffect(() => { cargar(); }, [cargar]);

  if (!cityConfig) return <Navigate to="/empleos" replace />;

  const ipsFiltradas = ips.filter(i =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOHead
        title={`Directorio de IPS en ${cityConfig.nombre} — ${ips.length} instituciones | MedApply`}
        description={`Directorio completo de clínicas, hospitales y centros médicos en ${cityConfig.nombre}. Datos verificados REPS.`}
        canonical={`https://medapply.co/directorio/ips/${ciudadSlug}`}
      />

      {/* Hero */}
      <div className="bg-azul-marino py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-blue-300 mb-4 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white">Inicio</Link>
            <span>›</span>
            <span className="text-white">Directorio IPS</span>
            <span>›</span>
            <span className="text-white font-medium">{cityConfig.nombre}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            IPS y Clínicas en {cityConfig.nombre}
          </h1>
          {!cargando && (
            <p className="text-blue-200 text-sm">{ips.length} instituciones con vacantes activas</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Buscador local */}
        <div className="mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder={`Buscar institución en ${cityConfig.nombre}...`}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-azul-marino transition-colors bg-white"
          />
        </div>

        {cargando ? (
          <SkeletonGrid cantidad={4} />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
            <p className="text-red-500 font-semibold mb-2">Error al cargar directorio</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button onClick={cargar} className="btn-primario text-sm py-2 px-6">Reintentar</button>
          </div>
        ) : ipsFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-5xl mb-3">🏥</p>
            <h3 className="text-lg font-bold text-azul-marino mb-2">
              {busqueda ? `Sin resultados para "${busqueda}"` : `Aún no hay IPS registradas en ${cityConfig.nombre}`}
            </h3>
            <p className="text-gray-400 text-sm">
              {busqueda ? "Prueba con otro nombre." : "Sé la primera institución en publicar vacantes aquí."}
            </p>
            {!busqueda && (
              <Link to="/registro/empresa" className="btn-primario text-sm py-2.5 px-6 mt-4 inline-block">
                Publicar vacante gratis
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {ipsFiltradas.map(ips => (
              <Link
                key={ips.id}
                to={`/directorio/ips/${ciudadSlug}/${ips.slug}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                  {ips.logo
                    ? <img src={ips.logo} alt="" className="w-full h-full object-cover" />
                    : "🏥"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-azul-marino text-sm">{ips.nombre}</p>
                  {ips.tipo && (
                    <p className="text-xs text-gray-400 mt-0.5">{ips.tipo}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs bg-esmeralda/10 text-esmeralda font-semibold px-2.5 py-1 rounded-full">
                    {ips.vacantes} {ips.vacantes === 1 ? "vacante" : "vacantes"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Ver perfil →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <SEOTextBlock
        titulo={`Instituciones de salud en ${cityConfig.nombre}`}
        texto={TEXTOS_SEO_CIUDAD[ciudadSlug]}
      />

      <section className="py-10 px-4 bg-azul-marino text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-2">¿Tu clínica o IPS no aparece aquí?</h2>
          <p className="text-blue-200 text-sm mb-5">Regístrate y publica vacantes gratis para aparecer en el directorio.</p>
          <Link to="/registro/empresa" className="bg-esmeralda hover:bg-esmeralda-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Registrar institución gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
