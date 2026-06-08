import { useState, useMemo, useEffect } from "react";
import { CANDIDATOS_DEMO } from "../../data/candidatosDemo";
import { CATEGORIAS_FILTRO, CIUDADES_FILTRO } from "../../data/ofertasDemo";
import { SkeletonListaCandidatos } from "../../components/common/SkeletonLoader";

// Modal para contactar candidato
function ModalContacto({ candidato, onCerrar }) {
  const [mensaje, setMensaje] = useState(
    `Hola ${candidato.nombre},\n\nHemos visto tu perfil en MedApply y nos interesa conocerte. Tenemos una oportunidad que podría ser de tu interés.\n\n¿Estarías disponible para una llamada esta semana?`
  );
  const [enviado, setEnviado] = useState(false);

  const enviar = () => {
    setEnviado(true);
    setTimeout(onCerrar, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-azul-marino">Contactar a {candidato.nombre}</h3>
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
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-esmeralda resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={enviar} className="flex-1 btn-primario py-3 text-sm">Enviar mensaje</button>
              <button onClick={onCerrar} className="flex-1 btn-outline py-3 text-sm">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tarjeta de candidato
function TarjetaCandidato({ candidato, onContactar }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar con iniciales */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0
          ${candidato.destacado ? "bg-esmeralda" : "bg-azul-claro"}`}>
          {candidato.nombre.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-azul-marino">{candidato.nombre}</h3>
            {candidato.destacado && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">⭐ Destacado</span>
            )}
            {!candidato.disponible && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">No disponible</span>
            )}
          </div>
          <p className="text-esmeralda font-semibold text-sm mt-0.5">{candidato.categoria}</p>
          <p className="text-gray-400 text-xs mt-1">📍 {candidato.ciudad} · 💼 {candidato.experiencia} años de exp.</p>
          <p className="text-gray-500 text-xs mt-0.5">🎓 {candidato.educacion}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
        <button
          className="flex-1 text-sm border border-azul-marino text-azul-marino rounded-xl py-2 hover:bg-azul-marino hover:text-white transition-colors font-semibold"
        >
          Ver perfil
        </button>
        <button
          onClick={() => onContactar(candidato)}
          disabled={!candidato.disponible}
          className="flex-1 btn-primario text-sm py-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Contactar
        </button>
      </div>
    </div>
  );
}

export default function BancoCandidatos() {
  const [categoriasFiltro, setCategoriasFiltro] = useState([]);
  const [ciudadesFiltro, setCiudadesFiltro] = useState([]);
  const [soloDis, setSoloDis] = useState(false);
  const [candidatoContacto, setCandidatoContacto] = useState(null);
  const [filtrosMobileAbiertos, setFiltrosMobileAbiertos] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 800);
    return () => clearTimeout(t);
  }, []);

  const toggleFiltro = (setter) => (v) =>
    setter((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const candidatosFiltrados = useMemo(() => {
    return CANDIDATOS_DEMO.filter((c) => {
      const matchCat  = !categoriasFiltro.length || categoriasFiltro.includes(c.categoria);
      const matchCiu  = !ciudadesFiltro.length   || ciudadesFiltro.includes(c.ciudad);
      const matchDis  = !soloDis || c.disponible;
      return matchCat && matchCiu && matchDis;
    });
  }, [categoriasFiltro, ciudadesFiltro, soloDis]);

  const panelFiltros = (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-azul-marino">Filtros</h2>
        {(categoriasFiltro.length || ciudadesFiltro.length) && (
          <button onClick={() => { setCategoriasFiltro([]); setCiudadesFiltro([]); }} className="text-xs text-red-400 hover:underline">
            Limpiar
          </button>
        )}
      </div>

      {/* Disponibilidad */}
      <div className="mb-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={soloDis} onChange={() => setSoloDis(!soloDis)} className="accent-esmeralda w-4 h-4" />
          <span className="text-sm text-gray-600">Solo disponibles</span>
        </label>
      </div>

      {/* Categoría */}
      <h3 className="font-semibold text-azul-marino text-sm mb-2">Categoría</h3>
      <div className="space-y-1.5 max-h-52 overflow-y-auto mb-5">
        {CATEGORIAS_FILTRO.map((c) => (
          <label key={c} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={categoriasFiltro.includes(c)} onChange={() => toggleFiltro(setCategoriasFiltro)(c)} className="accent-esmeralda w-4 h-4" />
            <span className="text-sm text-gray-600">{c}</span>
          </label>
        ))}
      </div>

      {/* Ciudad */}
      <h3 className="font-semibold text-azul-marino text-sm mb-2">Ciudad</h3>
      <div className="space-y-1.5 max-h-44 overflow-y-auto">
        {CIUDADES_FILTRO.map((c) => (
          <label key={c} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={ciudadesFiltro.includes(c)} onChange={() => toggleFiltro(setCiudadesFiltro)(c)} className="accent-esmeralda w-4 h-4" />
            <span className="text-sm text-gray-600">{c}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Banco de candidatos</h1>
          <p className="text-gray-500 text-sm mt-1">Busca y contacta profesionales del sector salud directamente.</p>
        </div>
        <span className="bg-esmeralda text-white text-xs font-bold px-3 py-1.5 rounded-full">Plan Premium</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Candidatos activos", valor: CANDIDATOS_DEMO.filter(c => c.disponible).length },
          { label: "Categorías",         valor: new Set(CANDIDATOS_DEMO.map(c => c.categoria)).size },
          { label: "Ciudades",           valor: new Set(CANDIDATOS_DEMO.map(c => c.ciudad)).size },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <p className="font-bold text-xl text-azul-marino">{s.valor}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Botón filtros móvil */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <p className="text-gray-500 text-sm"><strong className="text-azul-marino">{candidatosFiltrados.length}</strong> candidatos</p>
        <button onClick={() => setFiltrosMobileAbiertos(true)} className="border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700">
          ⚙ Filtros
        </button>
      </div>

      {/* Modal filtros móvil */}
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
        {/* Sidebar filtros desktop */}
        <div className="hidden md:block w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
            {panelFiltros}
          </div>
        </div>

        {/* Grid de candidatos */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-sm mb-4 hidden md:block">
            {cargando
              ? <span className="inline-block h-4 w-40 bg-gray-200 animate-pulse rounded" />
              : <><strong className="text-azul-marino">{candidatosFiltrados.length}</strong> candidatos encontrados</>
            }
          </p>

          {cargando ? (
            <SkeletonListaCandidatos cantidad={6} />
          ) : candidatosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="font-bold text-azul-marino text-lg mb-2">Sin candidatos con esos filtros</h3>
              <p className="text-gray-400 text-sm mb-5">Prueba quitando algunos filtros para ver más perfiles.</p>
              <button
                onClick={() => { setCategoriasFiltro([]); setCiudadesFiltro([]); setSoloDis(false); }}
                className="btn-outline text-sm py-2.5 px-6"
              >
                Limpiar filtros
              </button>
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

      {/* Modal de contacto */}
      {candidatoContacto && (
        <ModalContacto candidato={candidatoContacto} onCerrar={() => setCandidatoContacto(null)} />
      )}
    </div>
  );
}
