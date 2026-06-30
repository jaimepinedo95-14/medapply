import { Link } from "react-router-dom";
import { CIUDADES_SEO, CIUDADES_TOP_8 } from "../../config/seo";

// Grid de links a otras ciudades (excluye la ciudad actual si se pasa)
export default function CiudadLinks({ excluirSlug = null, limite = 8, titulo = "Empleos en otras ciudades" }) {
  const ciudades = (limite === 8 ? CIUDADES_TOP_8 : CIUDADES_SEO.slice(0, limite))
    .filter(c => c.slug !== excluirSlug);

  return (
    <section className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-azul-marino mb-4">{titulo}</h2>
        <div className="flex flex-wrap gap-2">
          {ciudades.map(c => (
            <Link
              key={c.slug}
              to={`/empleos/${c.slug}`}
              className="text-sm text-azul-marino hover:text-esmeralda font-medium border border-gray-200 hover:border-esmeralda px-3 py-1.5 rounded-xl transition-colors bg-white"
            >
              📍 {c.nombre}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
