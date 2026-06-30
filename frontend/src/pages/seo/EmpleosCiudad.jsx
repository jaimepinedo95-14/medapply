import { useState, useEffect, useCallback } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { CIUDADES_SEO, PROFESIONES_TOP_6, CIUDADES_TOP_8, TEXTOS_SEO_CIUDAD } from "../../config/seo";
import SEOHead from "../../components/seo/SEOHead";
import VacanteCard from "../../components/seo/VacanteCard";
import { SkeletonGrid } from "../../components/seo/SkeletonCard";
import EmptyState from "../../components/seo/EmptyState";
import SEOTextBlock from "../../components/seo/SEOTextBlock";
import CiudadLinks from "../../components/seo/CiudadLinks";
import ProfesionLinks from "../../components/seo/ProfesionLinks";

const PAGE_SIZE = 20;
const TIMEOUT_MS = 5000;

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error("La consulta tardó demasiado. Intenta de nuevo.")), TIMEOUT_MS)),
  ]);
}

export default function EmpleosCiudad() {
  const { id: ciudadSlug } = useParams();
  const cityConfig = CIUDADES_SEO.find(c => c.slug === ciudadSlug);

  const [pagina, setPagina]       = useState(0);
  const [ofertas, setOfertas]     = useState([]);
  const [total, setTotal]         = useState(0);
  const [totalIps, setTotalIps]   = useState(0);
  const [ultimaFecha, setUltimaFecha] = useState(null);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState(null);

  const cargar = useCallback(async () => {
    if (!cityConfig) return;
    setCargando(true);
    setError(null);
    try {
      const offset = pagina * PAGE_SIZE;
      const [resOfertas, resIps] = await Promise.all([
        withTimeout(
          supabase.from("ofertas_con_empresa")
            .select("*", { count: "exact" })
            .eq("ciudad", cityConfig.db)
            .eq("estado", "activa")
            .order("fecha_publicacion", { ascending: false })
            .range(offset, offset + PAGE_SIZE - 1)
        ),
        withTimeout(
          supabase.from("ofertas_con_empresa")
            .select("empresa_id")
            .eq("ciudad", cityConfig.db)
            .eq("estado", "activa")
        ),
      ]);

      if (resOfertas.error) throw resOfertas.error;
      setOfertas(resOfertas.data ?? []);
      setTotal(resOfertas.count ?? 0);
      if (resOfertas.data?.[0]) setUltimaFecha(resOfertas.data[0].fecha_publicacion);

      const ipsUnicas = new Set(resIps.data?.map(x => x.empresa_id) ?? []);
      setTotalIps(ipsUnicas.size);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [cityConfig, pagina]);

  useEffect(() => { cargar(); }, [cargar]);

  // Ciudad no encontrada: no renderizar (EmpleosDispatch ya filtró, pero por si acaso)
  if (!cityConfig) return <Navigate to="/empleos" replace />;

  const totalPaginas = Math.ceil(total / PAGE_SIZE);

  const fechaLabel = ultimaFecha
    ? new Date(ultimaFecha).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOHead
        title={`Empleos en Salud en ${cityConfig.nombre} — ${total} vacantes activas | MedApply`}
        description={`Encuentra empleos en salud en ${cityConfig.nombre}. Médicos, enfermeras, psicólogos y más. Vacantes actualizadas hoy en clínicas e IPS de ${cityConfig.nombre}, Colombia.`}
        canonical={`https://medapply.co/empleos/${ciudadSlug}`}
      />

      {/* Hero */}
      <div className="bg-azul-marino py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-blue-300 mb-4 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white">Inicio</Link>
            <span>›</span>
            <Link to="/empleos" className="hover:text-white">Empleos</Link>
            <span>›</span>
            <span className="text-white font-medium">{cityConfig.nombre}</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Empleos en Salud en {cityConfig.nombre}
          </h1>

          {/* Estadísticas */}
          {!cargando && !error && (
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="bg-white/10 text-white px-3 py-1.5 rounded-xl">
                🏥 <strong>{total}</strong> vacantes activas
              </span>
              {totalIps > 0 && (
                <span className="bg-white/10 text-white px-3 py-1.5 rounded-xl">
                  🏢 <strong>{totalIps}</strong> instituciones publicando
                </span>
              )}
              {fechaLabel && (
                <span className="bg-white/10 text-white px-3 py-1.5 rounded-xl">
                  📅 Última oferta: {fechaLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtros por profesión */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Filtrar por profesión</p>
          <div className="flex flex-wrap gap-2">
            {PROFESIONES_TOP_6.map(p => (
              <Link
                key={p.slug}
                to={`/empleos/profesion/${p.slug}`}
                className="text-sm border border-gray-200 hover:border-azul-marino hover:text-azul-marino text-gray-600 px-3 py-1.5 rounded-xl transition-colors bg-white"
              >
                {p.nombre}
              </Link>
            ))}
          </div>
        </div>

        {/* Lista de vacantes */}
        {cargando ? (
          <SkeletonGrid cantidad={6} />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
            <p className="text-red-500 font-semibold mb-2">Error al cargar vacantes</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button onClick={cargar} className="btn-primario text-sm py-2 px-6">
              Reintentar
            </button>
          </div>
        ) : ofertas.length === 0 ? (
          <EmptyState ciudad={cityConfig.nombre} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {ofertas.map(o => <VacanteCard key={o.id} oferta={o} />)}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPagina(p => Math.max(0, p - 1))}
                  disabled={pagina === 0}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:border-azul-marino transition-colors"
                >
                  ← Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-500">
                  Página {pagina + 1} de {totalPaginas}
                </span>
                <button
                  onClick={() => setPagina(p => Math.min(totalPaginas - 1, p + 1))}
                  disabled={pagina >= totalPaginas - 1}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:border-azul-marino transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bloque SEO */}
      <SEOTextBlock
        texto={TEXTOS_SEO_CIUDAD[ciudadSlug]}
        titulo={`Empleos en salud en ${cityConfig.nombre}, Colombia`}
      />

      {/* Profesiones en esta ciudad */}
      <ProfesionLinks ciudadNombre={cityConfig.nombre} ciudadSlug={ciudadSlug} />

      {/* Otras ciudades */}
      <CiudadLinks excluirSlug={ciudadSlug} />

      {/* CTA */}
      <section className="py-10 px-4 bg-azul-marino text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-2">¿Eres una clínica o IPS en {cityConfig.nombre}?</h2>
          <p className="text-blue-200 text-sm mb-5">Publica vacantes gratis y llega a los mejores profesionales de salud.</p>
          <Link to="/registro/empresa" className="bg-esmeralda hover:bg-esmeralda-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Publicar vacante gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
