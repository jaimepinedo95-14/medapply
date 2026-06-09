import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { SkeletonListaOfertas } from "../components/common/SkeletonLoader";
import { CATEGORIAS_FILTRO, CIUDADES_FILTRO, TIPOS_CONTRATO_FILTRO } from "../data/ofertasDemo";

function diasDesde(fechaStr) {
  if (!fechaStr) return "";
  const diff = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return `Hace ${diff} días`;
}

function formatSalario(min, max) {
  if (!min && !max) return null;
  const fmt = (v) => new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 0 }).format(v);
  if (min && max) return `$${fmt(min)} – $${fmt(max)} COP`;
  if (min) return `Desde $${fmt(min)} COP`;
  return `Hasta $${fmt(max)} COP`;
}

function SeccionFiltro({ titulo, opciones, seleccionadas, onToggle }) {
  return (
    <div className="mb-5">
      <h3 className="font-semibold text-azul-marino text-sm mb-2">{titulo}</h3>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {opciones.map((op) => (
          <label key={op} className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={seleccionadas.includes(op)}
              onChange={() => onToggle(op)} className="accent-esmeralda w-4 h-4 flex-shrink-0" />
            <span className="text-sm text-gray-600 group-hover:text-azul-marino transition-colors">{op}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function TarjetaOferta({ oferta }) {
  const salario = formatSalario(oferta.salario_min, oferta.salario_max);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
          {oferta.logo_empresa
            ? <img src={oferta.logo_empresa} alt="" className="w-full h-full object-cover" />
            : "🏥"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="font-bold text-azul-marino text-base leading-snug flex-1">{oferta.titulo}</h3>
            {oferta.urgente && (
              <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full flex-shrink-0">Urgente</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-0.5">{oferta.nombre_empresa || "Empresa confidencial"}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
              📍 {oferta.ciudad}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
              📄 {oferta.tipo_contrato}
            </span>
            {oferta.categoria_profesional && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                🩺 {oferta.categoria_profesional}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div>
          {salario
            ? <p className="text-esmeralda font-bold text-sm">{salario} / mes</p>
            : <p className="text-gray-400 text-sm italic">Salario a convenir</p>
          }
          <p className="text-gray-400 text-xs mt-0.5">{diasDesde(oferta.fecha_publicacion)}</p>
        </div>
        <Link to={`/empleos/${oferta.id}`} className="btn-primario text-sm py-2 px-4 whitespace-nowrap">
          Ver oferta
        </Link>
      </div>
    </div>
  );
}

export default function Empleos() {
  const [searchParams] = useSearchParams();

  const [categorias, setCategorias]     = useState(searchParams.get("categoria") ? [searchParams.get("categoria")] : []);
  const [ciudades, setCiudades]         = useState(searchParams.get("ciudad") ? [searchParams.get("ciudad")] : []);
  const [tiposContrato, setTiposContrato] = useState([]);
  const [busqueda, setBusqueda]         = useState(searchParams.get("q") || "");
  const [busquedaInput, setBusquedaInput] = useState(searchParams.get("q") || "");
  const [filtrosMobile, setFiltrosMobile] = useState(false);
  const [ofertas, setOfertas]           = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [error, setError]               = useState(null);

  const cargarOfertas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      let query = supabase
        .from("ofertas_con_empresa")
        .select("*")
        .eq("estado", "activa")
        .order("fecha_publicacion", { ascending: false });

      if (categorias.length > 0)   query = query.in("categoria_profesional", categorias);
      if (ciudades.length > 0)     query = query.in("ciudad", ciudades);
      if (tiposContrato.length > 0) query = query.in("tipo_contrato", tiposContrato);
      if (busqueda.trim())         query = query.or(`titulo.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`);

      const { data, error: err } = await query;
      if (err) throw err;
      setOfertas(data ?? []);
    } catch (e) {
      setError(e.message);
      setOfertas([]);
    } finally {
      setCargando(false);
    }
  }, [categorias, ciudades, tiposContrato, busqueda]);

  useEffect(() => { cargarOfertas(); }, [cargarOfertas]);

  const toggleFiltro = (setter) => (valor) =>
    setter((prev) => prev.includes(valor) ? prev.filter((v) => v !== valor) : [...prev, valor]);

  const limpiarFiltros = () => {
    setCategorias([]); setCiudades([]); setTiposContrato([]);
    setBusqueda(""); setBusquedaInput("");
  };

  const hayFiltros = categorias.length || ciudades.length || tiposContrato.length || busqueda;

  const panelFiltros = (
    <aside className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-azul-marino">Filtros</h2>
        {hayFiltros && (
          <button onClick={limpiarFiltros} className="text-xs text-red-400 hover:underline">
            Limpiar todo
          </button>
        )}
      </div>
      <SeccionFiltro titulo="Categoría profesional" opciones={CATEGORIAS_FILTRO}
        seleccionadas={categorias} onToggle={toggleFiltro(setCategorias)} />
      <hr className="border-gray-100 my-3" />
      <SeccionFiltro titulo="Ciudad" opciones={CIUDADES_FILTRO}
        seleccionadas={ciudades} onToggle={toggleFiltro(setCiudades)} />
      <hr className="border-gray-100 my-3" />
      <SeccionFiltro titulo="Tipo de contrato" opciones={TIPOS_CONTRATO_FILTRO}
        seleccionadas={tiposContrato} onToggle={toggleFiltro(setTiposContrato)} />
    </aside>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero de búsqueda */}
      <div className="bg-azul-marino py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-5">
            Empleos en el sector salud de Colombia
          </h1>
          <div className="bg-white rounded-2xl flex gap-2 p-2 shadow-lg">
            <input
              type="text"
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setBusqueda(busquedaInput)}
              placeholder="Cargo, especialidad, empresa..."
              className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none rounded-xl"
            />
            <button onClick={() => setBusqueda(busquedaInput)} className="btn-primario text-sm py-2.5 px-5 whitespace-nowrap">
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra móvil */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <p className="text-gray-500 text-sm">
            <strong className="text-azul-marino">{ofertas.length}</strong> ofertas
          </p>
          <button onClick={() => setFiltrosMobile(true)}
            className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700">
            ⚙ Filtros {hayFiltros ? `(${categorias.length + ciudades.length + tiposContrato.length})` : ""}
          </button>
        </div>

        {/* Modal filtros móvil */}
        {filtrosMobile && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:hidden">
            <div className="bg-white w-full rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-azul-marino text-lg">Filtrar ofertas</h2>
                <button onClick={() => setFiltrosMobile(false)} className="text-gray-400 text-2xl">×</button>
              </div>
              {panelFiltros}
              <button onClick={() => setFiltrosMobile(false)} className="w-full btn-primario mt-4">
                Ver {ofertas.length} resultados
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar filtros desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
              {panelFiltros}
            </div>
          </div>

          {/* Listado */}
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-sm mb-4 hidden md:block">
              {cargando ? (
                <span className="inline-block h-4 w-36 bg-gray-200 animate-pulse rounded" />
              ) : (
                <><strong className="text-azul-marino">{ofertas.length}</strong> ofertas encontradas</>
              )}
            </p>

            {cargando ? (
              <SkeletonListaOfertas cantidad={6} />
            ) : error ? (
              <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
                <p className="text-red-500 font-semibold mb-2">No se pudieron cargar las ofertas</p>
                <p className="text-gray-400 text-sm mb-4">{error}</p>
                <button onClick={cargarOfertas} className="btn-primario text-sm py-2 px-6">
                  Reintentar
                </button>
              </div>
            ) : ofertas.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-azul-marino mb-2">
                  {busqueda ? `Sin resultados para "${busqueda}"` : "Sin ofertas disponibles"}
                </h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                  {hayFiltros
                    ? "Prueba quitando algunos filtros para ver más resultados."
                    : "Aún no hay ofertas publicadas. Sé el primero en publicar una vacante."}
                </p>
                {hayFiltros ? (
                  <button onClick={limpiarFiltros} className="btn-outline text-sm py-2.5 px-6">
                    Limpiar filtros
                  </button>
                ) : (
                  <a href="/registro/empresa" className="btn-primario text-sm py-2.5 px-6">
                    Publicar una vacante
                  </a>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ofertas.map((oferta) => (
                  <TarjetaOferta key={oferta.id} oferta={oferta} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
