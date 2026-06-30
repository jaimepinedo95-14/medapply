import { Link } from "react-router-dom";

export default function EmptyState({ ciudad = null, profesion = null }) {
  const lugar = ciudad ? `en ${ciudad}` : profesion ? `de ${profesion}` : "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
      <div className="text-5xl mb-4">🔔</div>
      <h3 className="text-xl font-bold text-azul-marino mb-2">
        Aún no hay vacantes activas {lugar}
      </h3>
      <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
        Regístrate gratis y te alertamos en cuanto aparezcan nuevas oportunidades{lugar ? ` ${lugar}` : ""}.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/registro/candidato" className="btn-primario text-sm py-2.5 px-6">
          Crear perfil y activar alerta
        </Link>
        <Link to="/empleos" className="btn-outline text-sm py-2.5 px-6">
          Ver todas las vacantes
        </Link>
      </div>
    </div>
  );
}
