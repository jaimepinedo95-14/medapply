// Footer actualizado con todos los enlaces de la plataforma
import { Link } from "react-router-dom";

export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-azul-marino text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Columna 1: Logo y descripción */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-esmeralda rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xl">M</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-white font-bold text-xl">Med</span>
                <span className="text-esmeralda-claro font-light text-xl">Apply</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              La plataforma de empleo 100% del sector salud.
              Conectamos talento médico con las mejores instituciones del país.
            </p>
            <p className="text-gray-400 text-xs">
              📧 hola@medapply.co
            </p>
          </div>

          {/* Columna 2: Para candidatos */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Para candidatos</h4>
            <ul className="space-y-2.5 text-gray-300 text-sm">
              <li>
                <Link to="/empleos" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">🔍</span> Buscar empleos
                </Link>
              </li>
              <li>
                <Link to="/salarios" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">💰</span> Guía de salarios
                </Link>
              </li>
              <li>
                <Link to="/registro/candidato" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">👤</span> Crear perfil gratis
                </Link>
              </li>
              <li>
                <Link to="/precios" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">⭐</span> Perfil destacado
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Para empresas */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Para empresas</h4>
            <ul className="space-y-2.5 text-gray-300 text-sm">
              <li>
                <Link to="/para-empresas#como-funciona" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">🏥</span> Cómo funciona
                </Link>
              </li>
              <li>
                <Link to="/precios" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">💳</span> Precios
                </Link>
              </li>
              <li>
                <Link to="/registro/empresa" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">📋</span> Publicar oferta
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">ℹ️</span> Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Legal y ayuda */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal y ayuda</h4>
            <ul className="space-y-2.5 text-gray-300 text-sm">
              <li>
                <Link to="/faq" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">❓</span> Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">🔒</span> Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">📜</span> Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/nosotros#contacto" className="hover:text-esmeralda-claro transition-colors flex items-center gap-1.5">
                  <span className="text-xs">✉️</span> Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-400 text-sm">
            © {anioActual} MedApply S.A.S. Todos los derechos reservados.
          </p>
          <div className="flex gap-5 text-sm">
            <Link to="/privacidad" className="text-gray-400 hover:text-white transition-colors">Privacidad</Link>
            <Link to="/terminos"   className="text-gray-400 hover:text-white transition-colors">Términos</Link>
            <Link to="/nosotros#contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</Link>
          </div>
          <p className="text-gray-500 text-sm">
            Hecho con ♥ para el sector salud de Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
