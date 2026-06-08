// Perfil público de candidato — solo visible para empresas con plan Premium
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CANDIDATOS_DEMO } from "../data/candidatosDemo";

// Datos de experiencia y educación por candidato (demo)
const EXPERIENCIA_DEMO = {
  1: [
    { cargo: "Enfermera Jefe", empresa: "Clínica San Rafael", ciudad: "Bogotá", inicio: "2021", fin: "Presente", descripcion: "Supervisión de turno de UCI, manejo de pacientes críticos." },
    { cargo: "Enfermera General", empresa: "Hospital Santa Clara", ciudad: "Bogotá", inicio: "2019", fin: "2021", descripcion: "Atención en urgencias y hospitalización general." },
  ],
  2: [
    { cargo: "Médico Internista", empresa: "Fundación Santa Fe", ciudad: "Bogotá", inicio: "2020", fin: "Presente", descripcion: "Atención de pacientes adultos con patologías complejas." },
    { cargo: "Médico Residente", empresa: "Hospital San José", ciudad: "Bogotá", inicio: "2017", fin: "2020", descripcion: "Residencia de Medicina Interna." },
  ],
  3: [
    { cargo: "Técnico en Emergencias", empresa: "Cruz Roja Colombiana", ciudad: "Cali", inicio: "2019", fin: "Presente", descripcion: "Atención prehospitalaria y manejo de código TRIAGE." },
  ],
};

const EDUCACION_DEMO = {
  1: [
    { titulo: "Especialización en Cuidado Crítico", institucion: "Universidad Nacional", año: "2021" },
    { titulo: "Enfermería", institucion: "Universidad de La Sabana", año: "2019" },
  ],
  2: [
    { titulo: "Especialización en Medicina Interna", institucion: "Pontificia Universidad Javeriana", año: "2020" },
    { titulo: "Medicina y Cirugía", institucion: "Universidad del Rosario", año: "2016" },
  ],
  3: [
    { titulo: "Técnico en Atención Prehospitalaria", institucion: "SENA", año: "2018" },
  ],
};

export default function PerfilPublicoCandidato() {
  const { id } = useParams();
  const { usuario } = useAuth();

  const candidato = CANDIDATOS_DEMO.find((c) => c.id === Number(id));

  // Bloquear acceso si no hay sesión de empresa
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-azul-marino mb-2">Acceso restringido</h1>
          <p className="text-gray-500 text-sm mb-6">
            Debes iniciar sesión como empresa para ver los perfiles de candidatos.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="btn-primario">Iniciar sesión</Link>
            <Link to="/registro/empresa" className="btn-outline">Registrar mi empresa</Link>
          </div>
        </div>
      </div>
    );
  }

  if (usuario.tipo !== "empresa") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-bold text-azul-marino mb-2">Solo para empresas</h1>
          <p className="text-gray-500 text-sm mb-6">
            Los perfiles de candidatos solo pueden ser consultados por empresas registradas.
          </p>
          <Link to="/empleos" className="btn-primario">Buscar empleos</Link>
        </div>
      </div>
    );
  }

  // Simular que el usuario tiene plan Premium (en producción vendría de la BD)
  const esPremium = true; // TODO: verificar plan real del usuario

  if (!esPremium) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h1 className="text-xl font-bold text-azul-marino mb-2">Plan Premium requerido</h1>
          <p className="text-gray-500 text-sm mb-4">
            El acceso al banco de candidatos y sus perfiles está disponible exclusivamente para empresas con plan Premium.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left">
            <p className="text-sm font-semibold text-azul-marino mb-2">Plan Premium incluye:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Ver perfiles completos de candidatos</li>
              <li>✅ Banco de hojas de vida con filtros avanzados</li>
              <li>✅ Contacto directo con candidatos</li>
              <li>✅ Ofertas ilimitadas</li>
            </ul>
          </div>
          <Link to="/empresa/suscripcion" className="btn-primario">Actualizar a Premium — $159.900/mes</Link>
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

  // Iniciales para el avatar
  const iniciales = candidato.nombre
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  const experiencia = EXPERIENCIA_DEMO[candidato.id] || [];
  const educacion   = EDUCACION_DEMO[candidato.id]   || [];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header del candidato */}
      <div className="bg-azul-marino text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">

            {/* Avatar */}
            <div className="w-20 h-20 bg-esmeralda rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg">
              {iniciales}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{candidato.nombre}</h1>
                {candidato.destacado && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    ⭐ Destacado
                  </span>
                )}
              </div>
              <p className="text-blue-200 mb-2">{candidato.categoria}</p>
              <div className="flex flex-wrap gap-4 text-blue-300 text-sm">
                <span>📍 {candidato.ciudad}</span>
                <span>💼 {candidato.experiencia} año{candidato.experiencia !== 1 ? "s" : ""} de experiencia</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${candidato.disponible ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}>
                  {candidato.disponible ? "✅ Disponible" : "🔴 No disponible"}
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-2">
              <button className="bg-esmeralda hover:bg-esmeralda-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                ✉️ Contactar
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                📄 Descargar HV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">

        {/* Resumen de habilidades */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-azul-marino mb-4 text-lg">Perfil profesional</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Categoría", valor: candidato.categoria, icono: "🏥" },
              { label: "Experiencia", valor: `${candidato.experiencia} año${candidato.experiencia !== 1 ? "s" : ""}`, icono: "💼" },
              { label: "Ciudad", valor: candidato.ciudad, icono: "📍" },
              { label: "Disponibilidad", valor: candidato.disponible ? "Inmediata" : "No disponible", icono: "📅" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{item.icono}</div>
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-azul-marino">{item.valor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experiencia laboral */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-azul-marino mb-4 text-lg">Experiencia laboral</h2>
          {experiencia.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay experiencia registrada.</p>
          ) : (
            <div className="space-y-4">
              {experiencia.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 bg-esmeralda rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 border-b border-gray-50 pb-4 last:border-0">
                    <p className="font-semibold text-azul-marino">{exp.cargo}</p>
                    <p className="text-esmeralda text-sm">{exp.empresa} · {exp.ciudad}</p>
                    <p className="text-gray-400 text-xs mb-1">{exp.inicio} — {exp.fin}</p>
                    {exp.descripcion && (
                      <p className="text-gray-600 text-sm">{exp.descripcion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Educación */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-azul-marino mb-4 text-lg">Educación</h2>
          {educacion.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay educación registrada.</p>
          ) : (
            <div className="space-y-4">
              {educacion.map((edu, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base flex-shrink-0">🎓</div>
                  <div className="flex-1 border-b border-gray-50 pb-4 last:border-0">
                    <p className="font-semibold text-azul-marino">{edu.titulo}</p>
                    <p className="text-gray-600 text-sm">{edu.institucion}</p>
                    <p className="text-gray-400 text-xs">{edu.año}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón volver */}
        <div className="text-center pb-4">
          <Link
            to="/empresa/candidatos"
            className="inline-flex items-center gap-2 text-azul-marino hover:text-esmeralda text-sm font-semibold transition-colors"
          >
            ← Volver al banco de candidatos
          </Link>
        </div>
      </div>
    </div>
  );
}
