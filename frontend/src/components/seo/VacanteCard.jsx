import { Link } from "react-router-dom";
import { CIUDADES_SEO, PROFESIONES_SEO } from "../../config/seo";

function diasDesde(fechaStr) {
  if (!fechaStr) return "";
  const diff = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return `Hace ${diff} d.`;
}

function formatSalario(min, max) {
  if (!min && !max) return null;
  const fmt = (v) => new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 0 }).format(v);
  if (min && max) return `$${fmt(min)} – $${fmt(max)}`;
  if (min) return `Desde $${fmt(min)}`;
  return `Hasta $${fmt(max)}`;
}

// Resuelve el slug de ciudad a partir del nombre guardado en Supabase
function slugCiudad(nombreCiudad) {
  return CIUDADES_SEO.find(c => c.db === nombreCiudad)?.slug ?? null;
}

// Resuelve el slug de profesión a partir del valor de categoria_profesional
function slugProfesion(categoria) {
  if (!categoria) return null;
  const cat = categoria.toLowerCase();
  return PROFESIONES_SEO.find(p =>
    p.db.toLowerCase() === cat || cat.includes(p.busqueda.toLowerCase())
  )?.slug ?? null;
}

export default function VacanteCard({ oferta, mostrarLinks = true }) {
  const salario     = formatSalario(oferta.salario_min, oferta.salario_max);
  const ciudadSlug  = slugCiudad(oferta.ciudad);
  const profSlug    = slugProfesion(oferta.categoria_profesional);

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
          <div className="flex flex-wrap gap-1.5 mt-2">
            {oferta.ciudad && (
              ciudadSlug ? (
                <Link to={`/empleos/${ciudadSlug}`}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-full transition-colors">
                  📍 {oferta.ciudad}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                  📍 {oferta.ciudad}
                </span>
              )
            )}
            {oferta.tipo_contrato && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                📄 {oferta.tipo_contrato}
              </span>
            )}
            {oferta.categoria_profesional && (
              profSlug ? (
                <Link to={`/empleos/profesion/${profSlug}`}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors">
                  🩺 {oferta.categoria_profesional}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  🩺 {oferta.categoria_profesional}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div>
          {salario
            ? <p className="text-esmeralda font-bold text-sm">{salario} COP/mes</p>
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
