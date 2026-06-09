// Perfil público de candidato — solo visible para empresas con plan Premium
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function PerfilPublicoCandidato() {
  const { id } = useParams();
  const { usuario } = useAuth();

  const [candidato, setCandidato] = useState(null);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("perfiles_candidato")
      .select("*, usuarios!inner(nombre, email)")
      .eq("id", id)
      .single()
      .then(({ data }) => { setCandidato(data || null); setCargando(false); })
      .catch(() => setCargando(false));
  }, [id]);

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-azul-marino mb-2">Acceso restringido</h1>
          <p className="text-gray-500 text-sm mb-6">Debes iniciar sesión como empresa para ver los perfiles de candidatos.</p>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="btn-primario">Iniciar sesión</Link>
            <Link to="/registro/empresa" className="btn-outline">Registrar mi empresa</Link>
          </div>
        </div>
      </div>
    );
  }

  if (usuario.rol !== "empresa" && usuario.rol !== "admin" && usuario.rol !== "superadmin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-bold text-azul-marino mb-2">Solo para empresas</h1>
          <p className="text-gray-500 text-sm mb-6">Los perfiles de candidatos solo pueden ser consultados por empresas registradas.</p>
          <Link to="/empleos" className="btn-primario">Buscar empleos</Link>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-esmeralda border-t-transparent rounded-full animate-spin" />
          Cargando perfil...
        </div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-azul-marino mb-2">Candidato no encontrado</h1>
          <p className="text-gray-500 mb-6">No existe ningún candidato con ese identificador.</p>
          <Link to="/empresa/candidatos" className="btn-primario">Volver al banco de candidatos</Link>
        </div>
      </div>
    );
  }

  const nombre   = candidato.usuarios?.nombre || "Candidato";
  const iniciales = nombre.split(" ").slice(0, 2).map(n => n[0]).join("");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-azul-marino text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-20 h-20 bg-esmeralda rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg">
              {candidato.foto
                ? <img src={candidato.foto} alt="" className="w-full h-full rounded-full object-cover" />
                : iniciales}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{nombre}</h1>
              <p className="text-blue-200">{candidato.categoria_profesional || "Sin categoría"}</p>
              <div className="flex flex-wrap gap-4 text-blue-300 text-sm mt-2">
                {candidato.ciudad && <span>📍 {candidato.ciudad}</span>}
                {candidato.telefono && <span>📞 {candidato.telefono}</span>}
                {candidato.porcentaje_perfil > 0 && (
                  <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-xs">
                    Perfil {candidato.porcentaje_perfil}% completo
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-esmeralda hover:bg-esmeralda-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                ✉️ Contactar
              </button>
              {candidato.hoja_de_vida_url && (
                <a href={candidato.hoja_de_vida_url} target="_blank" rel="noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors text-center">
                  📄 Descargar HV
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-azul-marino mb-4 text-lg">Perfil profesional</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Categoría",     valor: candidato.categoria_profesional || "—",  icono: "🏥" },
              { label: "Ciudad",        valor: candidato.ciudad || "—",                  icono: "📍" },
              { label: "Teléfono",      valor: candidato.telefono || "No indicado",       icono: "📞" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{item.icono}</div>
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-azul-marino">{item.valor}</p>
              </div>
            ))}
          </div>
          {candidato.resumen && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-sm font-semibold text-azul-marino mb-2">Resumen profesional</p>
              <p className="text-gray-600 text-sm leading-relaxed">{candidato.resumen}</p>
            </div>
          )}
        </div>

        {candidato.numero_tarjeta_profesional && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-azul-marino mb-3 text-lg">Datos profesionales</h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🪪</span>
              <div>
                <p className="text-xs text-gray-400">Tarjeta profesional</p>
                <p className="font-semibold text-azul-marino">{candidato.numero_tarjeta_profesional}</p>
                {candidato.verificado_rethus && (
                  <span className="text-xs text-green-600 font-semibold">✅ Verificado RETHUS</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-center pb-4">
          <Link to="/empresa/candidatos"
            className="inline-flex items-center gap-2 text-azul-marino hover:text-esmeralda text-sm font-semibold transition-colors">
            ← Volver al banco de candidatos
          </Link>
        </div>
      </div>
    </div>
  );
}
