import { Link } from "react-router-dom";
import { PROFESIONES_SEO, PROFESIONES_TOP_6 } from "../../config/seo";

// Grid de links a profesiones (opcionalmente filtradas por ciudad)
export default function ProfesionLinks({
  excluirSlug = null,
  ciudadSlug  = null,
  ciudadNombre = null,
  limite      = 6,
  titulo      = null,
}) {
  const profs = (limite === 6 ? PROFESIONES_TOP_6 : PROFESIONES_SEO.slice(0, limite))
    .filter(p => p.slug !== excluirSlug);

  const heading = titulo
    ?? (ciudadNombre
        ? `Buscar por profesión en ${ciudadNombre}`
        : "Otras profesiones en salud");

  const buildHref = (p) =>
    ciudadSlug
      ? `/empleos/${ciudadSlug}?prof=${p.slug}`
      : `/empleos/profesion/${p.slug}`;

  return (
    <section className="py-10 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-azul-marino mb-4">{heading}</h2>
        <div className="flex flex-wrap gap-2">
          {profs.map(p => (
            <Link
              key={p.slug}
              to={`/empleos/profesion/${p.slug}`}
              className="text-sm text-azul-marino hover:text-esmeralda font-medium border border-gray-200 hover:border-esmeralda px-3 py-1.5 rounded-xl transition-colors bg-white"
            >
              🩺 {p.nombre}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
