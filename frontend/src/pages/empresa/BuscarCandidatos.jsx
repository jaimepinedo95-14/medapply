import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { CATEGORIAS_FILTRO, CIUDADES_FILTRO } from "../../data/ofertasDemo";
import { PUEDE_VER_PERFIL_BUSQUEDA, LABEL_PLAN } from "../../config/planesEmpresa";

// El cálculo de afinidad con IA corre en la Edge Function "buscar-candidatos-ia"
// (supabase/functions/buscar-candidatos-ia). La clave de Anthropic vive como
// secret de Supabase del lado del servidor — nunca llega al navegador.
async function calcularAfinidadConIA(textoLibre, candidatos) {
  const { data, error } = await supabase.functions.invoke("buscar-candidatos-ia", {
    body: { textoLibre, candidatos },
  });
  if (error) throw new Error(error.message || "No se pudo calcular la afinidad con IA.");
  if (data?.error) throw new Error(data.error);
  return data?.afinidad || {};
}

export default function BuscarCandidatos() {
  const { usuario } = useAuth();

  const [textoLibre, setTextoLibre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [experienciaMin, setExperienciaMin] = useState("");

  const [plan, setPlan] = useState("gratuito");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [yaBusco, setYaBusco] = useState(false);
  const [error, setError] = useState("");
  const [avisoIA, setAvisoIA] = useState("");

  const puedeVerPerfil = PUEDE_VER_PERFIL_BUSQUEDA[plan] ?? false;

  useEffect(() => {
    if (!usuario?.id) return;
    supabase
      .from("perfiles_empresa")
      .select("plan")
      .eq("usuario_id", usuario.id)
      .maybeSingle()
      .then(({ data }) => setPlan(data?.plan || "gratuito"));
  }, [usuario?.id]);

  async function buscar(e) {
    e.preventDefault();
    setBuscando(true);
    setYaBusco(true);
    setError("");
    setAvisoIA("");

    try {
      let query = supabase
        .from("perfiles_candidato")
        .select("usuario_id, categoria_profesional, ciudad, experiencia_anios, resumen")
        .order("porcentaje_perfil", { ascending: false })
        .limit(60);

      if (especialidad)    query = query.eq("categoria_profesional", especialidad);
      if (ciudad)           query = query.eq("ciudad", ciudad);
      if (experienciaMin)  query = query.gte("experiencia_anios", Number(experienciaMin));

      const { data, error: errQuery } = await query;
      if (errQuery) throw errQuery;

      const lista = data || [];
      const candidatoIds = lista.map((c) => c.usuario_id);

      // Nombre vía vista candidatos_busqueda_publica: nunca expone email,
      // sin importar el plan de la empresa (ver migración 009).
      let nombresMap = {};
      if (candidatoIds.length > 0) {
        const { data: nombres } = await supabase
          .from("candidatos_busqueda_publica")
          .select("id, nombre")
          .in("id", candidatoIds);
        nombresMap = Object.fromEntries((nombres || []).map((n) => [n.id, n.nombre]));
      }

      let candidatos = lista.map((c) => ({
        id: c.usuario_id,
        nombre: nombresMap[c.usuario_id] || "Candidato",
        categoria: c.categoria_profesional || "Sin especialidad",
        ciudad: c.ciudad || "",
        experiencia: c.experiencia_anios || 0,
        resumen: c.resumen || "",
        afinidad: null,
      }));

      if (textoLibre.trim() && candidatos.length > 0) {
        try {
          const afinidadMap = await calcularAfinidadConIA(textoLibre.trim(), candidatos);
          candidatos = candidatos
            .map((c) => ({ ...c, afinidad: afinidadMap[c.id] ?? 0 }))
            .sort((a, b) => b.afinidad - a.afinidad);
        } catch (errIA) {
          setAvisoIA(
            `No se pudo calcular la afinidad con IA (${errIA.message}). Mostrando candidatos solo con los filtros aplicados.`
          );
        }
      }

      setResultados(candidatos);
    } catch (e) {
      setError(e.message || "No se pudo completar la búsqueda.");
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Buscar candidatos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Describe lo que necesitas y combina filtros para encontrar el mejor talento.
        </p>
      </div>

      <form onSubmit={buscar} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-azul-marino mb-1.5">
            ¿Qué tipo de profesional necesitas?
          </label>
          <textarea
            value={textoLibre}
            onChange={(e) => setTextoLibre(e.target.value)}
            rows={3}
            placeholder='Ej: "Necesito un médico general con experiencia en urgencias, disponible en Barranquilla, contrato por prestación de servicios"'
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-esmeralda resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Especialidad
            </label>
            <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-azul-claro bg-white">
              <option value="">Cualquiera</option>
              {CATEGORIAS_FILTRO.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Ciudad
            </label>
            <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-azul-claro bg-white">
              <option value="">Cualquiera</option>
              {CIUDADES_FILTRO.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Experiencia mínima (años)
            </label>
            <input type="number" min="0" value={experienciaMin}
              onChange={(e) => setExperienciaMin(e.target.value)}
              placeholder="Ej: 2"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-azul-claro" />
          </div>
        </div>

        <button type="submit" disabled={buscando}
          className="w-full bg-esmeralda hover:bg-esmeralda-hover text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm">
          {buscando ? "Buscando..." : "🔍 Buscar candidatos"}
        </button>
      </form>

      {avisoIA && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-5 text-sm text-yellow-800">
          ⚠️ {avisoIA}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      {buscando ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : !yaBusco ? null : resultados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-bold text-azul-marino text-lg mb-2">Sin resultados</h3>
          <p className="text-gray-400 text-sm">Prueba ajustando los filtros o la descripción.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resultados.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 bg-azul-claro">
                  {c.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-azul-marino">{c.nombre}</h3>
                    {c.afinidad !== null && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-esmeralda/10 text-esmeralda">
                        {c.afinidad}% afinidad
                      </span>
                    )}
                  </div>
                  <p className="text-esmeralda font-semibold text-sm mt-0.5">{c.categoria}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {c.ciudad && `📍 ${c.ciudad} · `}
                    {c.experiencia} {c.experiencia === 1 ? "año" : "años"} de experiencia
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50">
                {puedeVerPerfil ? (
                  <Link to={`/candidatos/${c.id}`}
                    className="inline-block text-sm border border-azul-marino text-azul-marino rounded-xl px-4 py-2 hover:bg-azul-marino hover:text-white transition-colors font-semibold">
                    Ver perfil completo
                  </Link>
                ) : (
                  <button disabled title="Disponible desde el plan Estándar"
                    className="text-sm border border-gray-200 text-gray-400 rounded-xl px-4 py-2 font-semibold cursor-not-allowed bg-gray-50">
                    🔒 Ver perfil completo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {yaBusco && !puedeVerPerfil && resultados.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-center">
          <p className="text-azul-marino text-sm font-semibold">
            Estás en el plan {LABEL_PLAN[plan]}.{" "}
            <Link to="/empresa/plan" className="underline">Mejora a Estándar o Premium</Link> para ver perfiles completos.
          </p>
        </div>
      )}
    </div>
  );
}
