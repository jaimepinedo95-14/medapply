import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Datos de ejemplo para el panel de inicio
const POSTULACIONES_RECIENTES = [
  { cargo: "Médico General", empresa: "Clínica San Rafael", ciudad: "Bogotá", estado: "En revisión", fecha: "hace 2 días" },
  { cargo: "Médico de Urgencias", empresa: "Hospital Universitario", ciudad: "Medellín", estado: "Visto", fecha: "hace 5 días" },
  { cargo: "Médico Rural", empresa: "Ministerio de Salud", ciudad: "Cundinamarca", estado: "Preseleccionado", fecha: "hace 1 semana" },
];

const COLORES_ESTADO = {
  "En revisión":    "bg-yellow-100 text-yellow-700",
  "Visto":          "bg-blue-100 text-blue-700",
  "Preseleccionado":"bg-green-100 text-green-700",
  "Descartado":     "bg-red-100 text-red-700",
};

export default function DashboardCandidato() {
  const { usuario } = useAuth();
  const nombre = usuario?.nombre?.split(" ")[0] || "Profesional";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Saludo */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">¡Hola, {nombre}! 👋</h1>
        <p className="text-gray-500 mt-1">Aquí tienes un resumen de tu actividad en MedApply.</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Postulaciones activas", valor: "3", icono: "📤", color: "bg-blue-50 border-blue-100" },
          { label: "Ofertas nuevas hoy",   valor: "12", icono: "🔔", color: "bg-green-50 border-green-100" },
          { label: "Perfil completado",    valor: "60%", icono: "👤", color: "bg-yellow-50 border-yellow-100" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-5 ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icono}</div>
            <p className="text-3xl font-bold text-azul-marino">{stat.valor}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerta de perfil incompleto */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <div>
          <p className="text-yellow-800 font-semibold text-sm">Tu perfil está incompleto</p>
          <p className="text-yellow-700 text-xs mt-0.5">
            Completa tu experiencia laboral y educación para aumentar tus posibilidades.{" "}
            <Link to="/candidato/perfil" className="font-bold underline">Completar ahora →</Link>
          </p>
        </div>
      </div>

      {/* Postulaciones recientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-azul-marino">Mis últimas postulaciones</h2>
          <Link to="/candidato/postulaciones" className="text-esmeralda text-sm font-semibold hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {POSTULACIONES_RECIENTES.map((p, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-azul-marino text-sm truncate">{p.cargo}</p>
                <p className="text-gray-400 text-xs mt-0.5">{p.empresa} · {p.ciudad}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${COLORES_ESTADO[p.estado]}`}>
                  {p.estado}
                </span>
                <span className="text-gray-400 text-xs hidden sm:block">{p.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link to="/empleos" className="bg-esmeralda hover:bg-esmeralda-hover text-white rounded-2xl p-5 flex items-center gap-4 transition-colors">
          <span className="text-3xl">🔍</span>
          <div>
            <p className="font-bold">Buscar nuevas ofertas</p>
            <p className="text-green-100 text-sm">12 ofertas nuevas hoy</p>
          </div>
        </Link>
        <Link to="/candidato/perfil" className="bg-azul-marino hover:bg-azul-hover text-white rounded-2xl p-5 flex items-center gap-4 transition-colors">
          <span className="text-3xl">📝</span>
          <div>
            <p className="font-bold">Completar mi perfil</p>
            <p className="text-blue-200 text-sm">Sube tu hoja de vida</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
