import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import { CATEGORIAS_FILTRO, CIUDADES_FILTRO } from "../../data/ofertasDemo";
import { SkeletonListaCandidatos } from "../../components/common/SkeletonLoader";

function ModalContacto({ candidato, onCerrar }) {
  const nombre = candidato.usuarios?.nombre || "candidato";
  const [mensaje, setMensaje] = useState(
    `Hola ${nombre},\n\nHemos visto tu perfil en MedApply y nos interesa conocerte. Tenemos una oportunidad que podría ser de tu interés.\n\n¿Estarías disponible para una llamada esta semana?`
  );
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-azul-marino">Contactar a {nombre}</h3>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        {enviado ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-bold text-green-700">¡Mensaje enviado!</p>
            <p className="text-gray-500 text-sm mt-1">El candidato recibirá tu mensaje por correo.</p>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-3">El mensaje se enviará al correo del candidato:</p>
            <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={6}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-esmeralda resize-none" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEnviado(true)} className="flex-1 btn-primario py-3 text-sm">
                Enviar mensaje
              </button>
              <button onClick={onCerrar} className="flex-1 btn-outline py-3 text-sm">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TarjetaCandidato({ candidato, onContactar }) {
  const nombre = candidato.usuarios?.nombre || "Candidato";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 bg-azul-claro">
          {nombre.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-azul-marino">{nombre}</h3>
          <p className="text-esmeralda font-semibold text-sm mt-0.5">
            {candidato.categoria_profesional || "Sin categoría"}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {candidato.ciudad && `📍 ${candidato.ciudad}`}
            {candidato.porcentaje_perfil > 0 && ` · Perfil ${candidato.porcentaje_perfil}% completo`}
          </p>
          {candidato.resumen && (
            <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{candidato.resumen}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
        <button className="flex-1 text-sm border border-azul-marino text-azul-marino rounded-xl py-2 hover:bg-azul-marino hover:text-white transition-colors font-semibold">
          Ver perfil
        </button>
        <button onClick={() => onContactar(candidato)}
          className="flex-1 btn-primario text-sm py-2">
          Contactar
        </button>
      </div>
    </div>
  );
}

export default function BancoCandidatos() {
  const [candidatos, setCandidatos]           = useState([]);
  const [cargando, setCargando]               = useState(true);
  const [error, setError]                     = useState(null);
  const [categoriasFiltro, setCategoriasFiltro] = useState([]);
  const [ciudadesFiltro, setCiudadesFiltro]   = useState([]);
  const [filtrosMobileAbiertos, setFiltrosMobileAbiertos] = useState(false);
  const [candidatoContacto, setCandidatoContacto] = useState(null);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("perfiles_candidato")
          .select("*, usuarios!inner(nombre, email)")
          .order("porcentaje_perfil", { ascending: false });
        if (err) throw err;
        setCandidatos(data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const toggleFiltro = (setter) => (v) =>
    setter((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const candidatosFiltrados = useMemo(() => {
    return candidatos.filter((c) => {
      const matchCat = !categoriasFiltro.length || categoriasFiltro.includes(c.categoria_profesional);
      const matchCiu = !ciudadesFiltro.length   || ciudadesFiltro.includes(c.ciudad);
      return matchCat && matchCiu;
    });
  }, [candidatos, categoriasFiltro, ciudadesFiltro]);

  const panelFiltros = (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-azul-marino">Filtros</h2>
        {(categoriasFiltro.length || ciudadesFiltro.length) ? (
          <button onClick={() => { setCategoriasFiltro([]); setCiudadesFiltro([]); }}
            className="text-xs text-red-400 hover:underline">Limpiar</button>
        ) : null}
      </div>
      <h3 className="font-semibold text-azul-marino text-sm mb-2">Categoría</h3>
      <div className="space-y-1.5 max-h-52 overflow-y-auto mb-5">
        {CATEGORIAS_FILTRO.map((c) => (
          <label key={c} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={categoriasFiltro.includes(c)}
              onChange={() => toggleFiltro(setCategoriasFiltro)(c)} className="accent-esmeralda w-4 h-4" />
            <span className="text-sm text-gray-600">{c}</span>
          </label>
        ))}
      </div>
      <h3 className="font-semibold text-azul-marino text-sm mb-2">Ciudad</h3>
      <div className="space-y-1.5 max-h-44 overflow-y-auto">
        {CIUDADES_FILTRO.map((c) => (
          <label key={c} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={ciudadesFiltro.includes(c)}
              onChange={() => toggleFiltro(setCiudadesFiltro)(c)} className="accent-esmeralda w-4 h-4" />
            <span className="text-sm text-gray-600">{c}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Banco de candidatos</h1>
          <p className="text-gray-500 text-sm mt-1">Busca y contacta profesionales del sector salud directamente.</p>
        </div>
        <span className="bg-esmeralda text-white text-xs font-bold px-3 py-1.5 rounded-full">Plan Premium</span>
      </div>

      {/* Stats */}
      {!cargando && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Candidatos registrados", valor: candidatos.length },
            { label: "Categorías disponibles", valor: new Set(candidatos.map(c => c.categoria_profesional).filter(Boolean)).size },
            { label: "Ciudades",               valor: new Set(candidatos.map(c => c.ciudad).filter(Boolean)).size },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="font-bold text-xl text-azul-marino">{s.valor}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 md:hidden">
        <p className="text-gray-500 text-sm"><strong className="text-azul-marino">{candidatosFiltrados.length}</strong> candidatos</p>
        <button onClick={() => setFiltrosMobileAbiertos(true)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700">
          ⚙ Filtros
        </button>
      </div>

      {filtrosMobileAbiertos && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:hidden">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-azul-marino text-lg">Filtrar candidatos</h2>
              <button onClick={() => setFiltrosMobileAbiertos(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            {panelFiltros}
            <button onClick={() => setFiltrosMobileAbiertos(false)} className="w-full btn-primario mt-4">
              Ver {candidatosFiltrados.length} candidatos
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <div className="hidden md:block w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
            {panelFiltros}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-sm mb-4 hidden md:block">
            {cargando
              ? <span className="inline-block h-4 w-40 bg-gray-200 animate-pulse rounded" />
              : <><strong className="text-azul-marino">{candidatosFiltrados.length}</strong> candidatos encontrados</>
            }
          </p>

          {cargando ? (
            <SkeletonListaCandidatos cantidad={6} />
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
              <p className="text-red-500 font-semibold mb-2">Error al cargar candidatos</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : candidatos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="font-bold text-azul-marino text-lg mb-2">Aún no hay candidatos registrados</h3>
              <p className="text-gray-400 text-sm">Los candidatos aparecerán aquí cuando creen su perfil en MedApply.</p>
            </div>
          ) : candidatosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-azul-marino text-lg mb-2">Sin candidatos con esos filtros</h3>
              <p className="text-gray-400 text-sm mb-5">Prueba quitando algunos filtros para ver más perfiles.</p>
              <button onClick={() => { setCategoriasFiltro([]); setCiudadesFiltro([]); }}
                className="btn-outline text-sm py-2.5 px-6">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {candidatosFiltrados.map((c) => (
                <TarjetaCandidato key={c.id} candidato={c} onContactar={setCandidatoContacto} />
              ))}
            </div>
          )}
        </div>
      </div>

      {candidatoContacto && (
        <ModalContacto candidato={candidatoContacto} onCerrar={() => setCandidatoContacto(null)} />
      )}
    </div>
  );
}
