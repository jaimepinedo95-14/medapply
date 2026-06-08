import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OFERTAS_RECIENTES = [
  { id: 1, cargo: "Médico General", postulados: 8,  estado: "Activa",   publicada: "hace 2 días" },
  { id: 2, cargo: "Jefe de Enfermería", postulados: 14, estado: "Activa", publicada: "hace 5 días" },
  { id: 3, cargo: "Auxiliar Administrativo", postulados: 22, estado: "Cerrada", publicada: "hace 2 semanas" },
];

export default function DashboardEmpresa() {
  const { usuario } = useAuth();
  const nombre = usuario?.nombre || "Empresa";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Saludo */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">¡Hola, {nombre}! 👋</h1>
        <p className="text-gray-500 mt-1">Gestiona tus ofertas y encuentra el talento que necesitas.</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Ofertas activas",       valor: "2",  icono: "📋", color: "bg-blue-50 border-blue-100" },
          { label: "Candidatos postulados", valor: "44", icono: "👥", color: "bg-green-50 border-green-100" },
          { label: "Plan actual",           valor: "Gratis", icono: "⭐", color: "bg-yellow-50 border-yellow-100" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-5 ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icono}</div>
            <p className="text-3xl font-bold text-azul-marino">{stat.valor}</p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerta plan gratuito: límite de oferta */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">💡</span>
        <div>
          <p className="text-yellow-800 font-semibold text-sm">Estás en el plan gratuito (1 oferta activa al mes)</p>
          <p className="text-yellow-700 text-xs mt-0.5">
            Actualiza tu plan para publicar más ofertas y acceder al banco de hojas de vida.{" "}
            <Link to="/empresa/suscripcion" className="font-bold underline">Ver planes →</Link>
          </p>
        </div>
      </div>

      {/* Mis últimas ofertas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-azul-marino">Mis últimas ofertas</h2>
          <Link to="/empresa/ofertas" className="text-esmeralda text-sm font-semibold hover:underline">Ver todas →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {OFERTAS_RECIENTES.map((o) => (
            <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-azul-marino text-sm truncate">{o.cargo}</p>
                <p className="text-gray-400 text-xs mt-0.5">Publicada {o.publicada}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-center hidden sm:block">
                  <p className="font-bold text-azul-marino">{o.postulados}</p>
                  <p className="text-gray-400 text-xs">postulados</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  o.estado === "Activa" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>{o.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/empresa/publicar-oferta" className="bg-esmeralda hover:bg-esmeralda-hover text-white rounded-2xl p-5 flex items-center gap-4 transition-colors">
          <span className="text-3xl">➕</span>
          <div>
            <p className="font-bold">Publicar nueva oferta</p>
            <p className="text-green-100 text-sm">Llega a miles de profesionales</p>
          </div>
        </Link>
        <Link to="/empresa/candidatos" className="bg-azul-marino hover:bg-azul-hover text-white rounded-2xl p-5 flex items-center gap-4 transition-colors">
          <span className="text-3xl">👥</span>
          <div>
            <p className="font-bold">Banco de candidatos</p>
            <p className="text-blue-200 text-sm">Disponible en plan Premium</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
