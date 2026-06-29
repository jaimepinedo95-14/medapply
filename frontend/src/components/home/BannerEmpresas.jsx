import { Link } from "react-router-dom";

// Sección que invita a las empresas a publicar sus ofertas
export default function BannerEmpresas() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-azul-marino to-azul-claro rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Texto */}
          <div className="text-white text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              ¿Tu empresa necesita personal de salud?
            </h2>
            <p className="text-blue-200 text-lg max-w-xl">
              Publica tu primera oferta gratis. Accede a miles de profesionales del sector salud en Colombia.
            </p>

            {/* Beneficios rápidos */}
            <ul className="mt-4 space-y-1.5 text-blue-100 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-esmeralda-claro">✓</span> 1 oferta activa gratis cada mes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-esmeralda-claro">✓</span> Acceso a banco de hojas de vida con plan Premium
              </li>
              <li className="flex items-center gap-2">
                <span className="text-esmeralda-claro">✓</span> Candidatos verificados del sector salud
              </li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/registro/empresa"
              className="bg-esmeralda hover:bg-esmeralda-hover text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200 text-center whitespace-nowrap"
            >
              Publicar oferta gratis
            </Link>
            {/* Oculto temporalmente: acceso gratuito ilimitado, sin planes de pago.
                Reactivar quitando este comentario.
            <Link
              to="/precios"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl border border-white/30 transition-colors duration-200 text-center whitespace-nowrap"
            >
              Ver planes
            </Link>
            */}
          </div>
        </div>
      </div>
    </section>
  );
}
