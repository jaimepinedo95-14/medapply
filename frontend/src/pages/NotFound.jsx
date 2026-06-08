// Página 404 — diseño MedApply
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">

        {/* Número 404 */}
        <div className="relative mb-6">
          <p className="text-[120px] font-black text-gray-100 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-azul-marino rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">🩺</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-azul-marino mb-3">
          Esta página no existe
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          La página que buscas no fue encontrada. Puede que haya sido movida,
          eliminada o que la URL esté mal escrita.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline py-3 px-6"
          >
            ← Volver atrás
          </button>
          <Link to="/" className="btn-primario py-3 px-6">
            Ir al inicio
          </Link>
        </div>

        {/* Links útiles */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-400 text-xs mb-4 uppercase tracking-widest font-semibold">
            Páginas populares
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Buscar empleos", href: "/empleos" },
              { label: "Para empresas",  href: "/para-empresas" },
              { label: "Precios",        href: "/precios" },
              { label: "Nosotros",       href: "/nosotros" },
              { label: "FAQ",            href: "/faq" },
            ].map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm text-azul-marino hover:text-esmeralda font-medium border border-gray-200 hover:border-esmeralda px-3 py-1.5 rounded-lg transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
