// Perfil público de empresa — visible para todos los usuarios
import { useParams, Link } from "react-router-dom";
import { EMPRESAS_DEMO } from "../data/empresasDemo";
import { OFERTAS_DEMO } from "../data/ofertasDemo";

const COLORES_TIPO = {
  "Clínica":    "bg-blue-100 text-blue-700",
  "Hospital":   "bg-esmeralda/10 text-esmeralda",
  "EPS":        "bg-purple-100 text-purple-700",
  "IPS":        "bg-yellow-100 text-yellow-700",
  "Laboratorio":"bg-pink-100 text-pink-700",
};

export default function PerfilPublicoEmpresa() {
  const { id } = useParams();
  const empresa = EMPRESAS_DEMO.find((e) => e.id === Number(id));

  // Si no se encuentra la empresa por ID, buscar por nombre en las ofertas para demo
  const ofertasEmpresa = empresa
    ? OFERTAS_DEMO.filter((o) => o.empresa === empresa.nombre)
    : [];

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h1 className="text-2xl font-bold text-azul-marino mb-2">Empresa no encontrada</h1>
          <p className="text-gray-500 mb-6">No existe ninguna empresa con ese identificador.</p>
          <Link to="/empleos" className="btn-primario">Ver ofertas disponibles</Link>
        </div>
      </div>
    );
  }

  const colorTipo = COLORES_TIPO[empresa.tipo] || "bg-gray-100 text-gray-700";

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Encabezado de la empresa */}
      <div className="bg-azul-marino text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg text-4xl flex-shrink-0">
              {empresa.logo}
            </div>

            {/* Info principal */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{empresa.nombre}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorTipo}`}>
                  {empresa.tipo}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-blue-200 text-sm">
                <span className="flex items-center gap-1">
                  <span>📍</span> {empresa.ciudad}
                </span>
                <span className="flex items-center gap-1">
                  <span>👥</span> {empresa.empleados} empleados
                </span>
                <span className="flex items-center gap-1">
                  <span>🏛</span> Fundada en {empresa.fundacion}
                </span>
                <span className="flex items-center gap-1">
                  <span>✅</span> {empresa.acreditacion}
                </span>
              </div>
            </div>

            {/* Ofertas activas */}
            <div className="bg-white/10 rounded-2xl px-5 py-3 text-center flex-shrink-0">
              <p className="text-2xl font-bold">{ofertasEmpresa.length}</p>
              <p className="text-blue-200 text-xs">ofertas activas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna izquierda — info de contacto */}
          <div className="space-y-4">

            {/* Datos de contacto */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-azul-marino mb-4">Información de contacto</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base">📧</span>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs">Correo</p>
                    <p className="text-gray-700 font-medium truncate">{empresa.email}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base">📞</span>
                  <div>
                    <p className="text-gray-400 text-xs">Teléfono</p>
                    <p className="text-gray-700 font-medium">{empresa.telefono}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base">🌐</span>
                  <div>
                    <p className="text-gray-400 text-xs">Sitio web</p>
                    <p className="text-gray-700 font-medium">{empresa.sitioWeb}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base">🪪</span>
                  <div>
                    <p className="text-gray-400 text-xs">NIT</p>
                    <p className="text-gray-700 font-medium">{empresa.nit}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Ver todas las ofertas */}
            <Link
              to="/empleos"
              className="block bg-esmeralda text-white text-center rounded-2xl px-5 py-3 font-semibold hover:bg-esmeralda-hover transition-colors"
            >
              Ver todas las ofertas del sector salud
            </Link>
          </div>

          {/* Columna derecha — descripción + ofertas */}
          <div className="lg:col-span-2 space-y-5">

            {/* Descripción */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-azul-marino mb-3 text-lg">Sobre {empresa.nombre}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{empresa.descripcion}</p>
            </div>

            {/* Ofertas activas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-azul-marino mb-4 text-lg">
                Ofertas activas
                {ofertasEmpresa.length > 0 && (
                  <span className="ml-2 bg-esmeralda text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {ofertasEmpresa.length}
                  </span>
                )}
              </h2>

              {ofertasEmpresa.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm">No hay ofertas activas en este momento.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ofertasEmpresa.map((oferta) => (
                    <div key={oferta.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-esmeralda transition-colors group">
                      <div className="min-w-0">
                        <p className="font-semibold text-azul-marino text-sm group-hover:text-esmeralda transition-colors truncate">
                          {oferta.cargo}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                          <span>📍 {oferta.ciudad}</span>
                          <span>📄 {oferta.tipoContrato}</span>
                          {oferta.salario && <span>💰 {oferta.salario}</span>}
                        </div>
                      </div>
                      <Link
                        to={`/empleos/${oferta.id}`}
                        className="ml-3 flex-shrink-0 bg-white border border-esmeralda text-esmeralda text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-esmeralda hover:text-white transition-colors"
                      >
                        Ver oferta
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
