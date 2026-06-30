import { useState, useEffect, useCallback } from "react";
import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { PROFESIONES_SEO, CIUDADES_SEO, CIUDADES_TOP_8 } from "../../config/seo";
import SEOHead from "../../components/seo/SEOHead";
import VacanteCard from "../../components/seo/VacanteCard";
import { SkeletonGrid } from "../../components/seo/SkeletonCard";
import EmptyState from "../../components/seo/EmptyState";
import SEOTextBlock from "../../components/seo/SEOTextBlock";
import ProfesionLinks from "../../components/seo/ProfesionLinks";

const PAGE_SIZE = 20;
const TIMEOUT_MS = 5000;

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error("La consulta tardó demasiado. Intenta de nuevo.")), TIMEOUT_MS)),
  ]);
}

export default function EmpleosProfesion() {
  const { slug } = useParams();
  const profConfig = PROFESIONES_SEO.find(p => p.slug === slug);
  const [searchParams, setSearchParams] = useSearchParams();
  const ciudadActiva = searchParams.get("ciudad");

  const [pagina, setPagina]   = useState(0);
  const [ofertas, setOfertas] = useState([]);
  const [total, setTotal]     = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError]     = useState(null);

  const cargar = useCallback(async () => {
    if (!profConfig) return;
    setCargando(true);
    setError(null);
    try {
      const offset = pagina * PAGE_SIZE;
      const cityConfig = ciudadActiva ? CIUDADES_SEO.find(c => c.slug === ciudadActiva) : null;

      let q = supabase.from("ofertas_con_empresa")
        .select("*", { count: "exact" })
        .ilike("categoria_profesional", `%${profConfig.busqueda}%`)
        .eq("estado", "activa")
        .order("fecha_publicacion", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (cityConfig) q = q.eq("ciudad", cityConfig.db);

      const res = await withTimeout(q);
      if (res.error) throw res.error;
      setOfertas(res.data ?? []);
      setTotal(res.count ?? 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [profConfig, pagina, ciudadActiva]);

  useEffect(() => { cargar(); }, [cargar]);

  function toggleCiudad(slug) {
    setPagina(0);
    const params = new URLSearchParams(searchParams);
    if (ciudadActiva === slug) { params.delete("ciudad"); } else { params.set("ciudad", slug); }
    setSearchParams(params, { replace: true });
  }

  if (!profConfig) return <Navigate to="/empleos" replace />;

  const totalPaginas = Math.ceil(total / PAGE_SIZE);

  // Ciudades con demanda para links cruzados
  const ciudadesLinks = CIUDADES_TOP_8;

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOHead
        title={`Trabajos de ${profConfig.nombre} en Colombia — ${total} vacantes | MedApply`}
        description={`Encuentra empleos de ${profConfig.nombre} en Colombia. Vacantes en clínicas, hospitales e IPS. Actualizado hoy.`}
        canonical={`https://medapply.co/empleos/profesion/${slug}`}
      />

      {/* Hero */}
      <div className="bg-azul-marino py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-blue-300 mb-4 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white">Inicio</Link>
            <span>›</span>
            <Link to="/empleos" className="hover:text-white">Empleos</Link>
            <span>›</span>
            <span className="text-white font-medium">{profConfig.nombre}</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Trabajos de {profConfig.nombre} en Colombia
          </h1>

          {!cargando && !error && (
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="bg-white/10 text-white px-3 py-1.5 rounded-xl">
                🏥 <strong>{total}</strong> vacantes activas
              </span>
              <span className="bg-white/10 text-white px-3 py-1.5 rounded-xl">
                📍 En todo Colombia
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtros por ciudad */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
            Filtrar por ciudad{ciudadActiva && <span className="ml-2 text-azul-marino normal-case">— <button onClick={() => toggleCiudad(ciudadActiva)} className="underline">quitar filtro</button></span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {ciudadesLinks.map(c => (
              <button
                key={c.slug}
                onClick={() => toggleCiudad(c.slug)}
                className={`text-sm border px-3 py-1.5 rounded-xl transition-colors ${
                  ciudadActiva === c.slug
                    ? "border-azul-marino bg-azul-marino text-white"
                    : "border-gray-200 hover:border-azul-marino hover:text-azul-marino text-gray-600 bg-white"
                }`}
              >
                {ciudadActiva === c.slug ? "✓ " : "📍 "}{c.nombre}
              </button>
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
            <button onClick={cargar} className="btn-primario text-sm py-2 px-6">Reintentar</button>
          </div>
        ) : ofertas.length === 0 ? (
          <EmptyState profesion={profConfig.nombre} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {ofertas.map(o => <VacanteCard key={o.id} oferta={o} />)}
            </div>
            {totalPaginas > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button onClick={() => setPagina(p => Math.max(0, p - 1))} disabled={pagina === 0}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:border-azul-marino transition-colors">
                  ← Anterior
                </button>
                <span className="px-4 py-2 text-sm text-gray-500">
                  Página {pagina + 1} de {totalPaginas}
                </span>
                <button onClick={() => setPagina(p => Math.min(totalPaginas - 1, p + 1))} disabled={pagina >= totalPaginas - 1}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:border-azul-marino transition-colors">
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Links cruzados por ciudad */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-azul-marino mb-4">
            Empleos de {profConfig.nombre} por ciudad
          </h2>
          <div className="flex flex-wrap gap-2">
            {ciudadesLinks.map(c => (
              <Link key={c.slug} to={`/empleos/${c.slug}`}
                className="text-sm text-azul-marino hover:text-esmeralda border border-gray-200 hover:border-esmeralda px-3 py-1.5 rounded-xl transition-colors bg-white">
                {profConfig.nombre} en {c.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text */}
      <SEOTextBlock
        titulo={`${profConfig.plural} en Colombia`}
        texto={`Encuentra las mejores vacantes de ${profConfig.nombre} en todo Colombia. MedApply conecta a ${profConfig.plural} con clínicas, hospitales, IPS y EPS que necesitan profesionales cualificados. Actualizado diariamente con ofertas reales verificadas.`}
      />

      {/* Otras profesiones */}
      <ProfesionLinks excluirSlug={slug} />

      {/* CTA salarios */}
      <section className="py-10 px-4 bg-azul-marino text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-2">¿Cuánto gana un {profConfig.nombre} en Colombia?</h2>
          <p className="text-blue-200 text-sm mb-5">
            Consulta nuestra guía de salarios con rangos por ciudad y tipo de institución.
          </p>
          <Link to={`/salarios/${slug}`}
            className="bg-esmeralda hover:bg-esmeralda-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Ver guía de salarios →
          </Link>
        </div>
      </section>
    </div>
  );
}
