import { useState } from "react";
import { Link } from "react-router-dom";

// Pasos para candidatos
const PASOS_CANDIDATO = [
  {
    numero: "1",
    titulo: "Crea tu perfil",
    descripcion: "Regístrate gratis, completa tu perfil con experiencia, educación y sube tu hoja de vida.",
    icono: "👤",
  },
  {
    numero: "2",
    titulo: "Busca empleos",
    descripcion: "Usa los filtros para encontrar ofertas por categoría, ciudad y tipo de contrato.",
    icono: "🔍",
  },
  {
    numero: "3",
    titulo: "Postúlate",
    descripcion: "Aplica a las ofertas con un clic. Las empresas podrán ver tu perfil y contactarte.",
    icono: "📤",
  },
  {
    numero: "4",
    titulo: "Consigue el trabajo",
    descripcion: "Recibe respuestas directamente en tu panel. ¡Tu nuevo empleo en salud te espera!",
    icono: "🎉",
  },
];

// Pasos para empresas
const PASOS_EMPRESA = [
  {
    numero: "1",
    titulo: "Registra tu empresa",
    descripcion: "Crea el perfil de tu institución con logo, descripción y datos de contacto.",
    icono: "🏥",
  },
  {
    numero: "2",
    titulo: "Publica tu oferta",
    descripcion: "Describe el cargo, requisitos, ciudad y condiciones. En minutos está publicada.",
    icono: "📝",
  },
  {
    numero: "3",
    titulo: "Recibe candidatos",
    descripcion: "Los profesionales se postulan a tu oferta. Revisa sus perfiles y hojas de vida.",
    icono: "📥",
  },
  {
    numero: "4",
    titulo: "Contrata al mejor",
    descripcion: "Contacta directamente a los candidatos que más te interesen y concreta la contratación.",
    icono: "🤝",
  },
];

export default function ComoFunciona() {
  // Alterna entre vista candidato y empresa
  const [vistaActiva, setVistaActiva] = useState("candidato");
  const pasos = vistaActiva === "candidato" ? PASOS_CANDIDATO : PASOS_EMPRESA;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-azul-marino mb-3">
            ¿Cómo funciona MedApply?
          </h2>
          <p className="text-gray-500 text-lg">
            Sencillo, rápido y diseñado para el sector salud
          </p>

          {/* Selector candidato / empresa */}
          <div className="inline-flex bg-white rounded-xl border border-gray-200 p-1 mt-6 shadow-sm">
            <button
              onClick={() => setVistaActiva("candidato")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                vistaActiva === "candidato"
                  ? "bg-azul-marino text-white shadow-sm"
                  : "text-gray-500 hover:text-azul-marino"
              }`}
            >
              Soy candidato
            </button>
            <button
              onClick={() => setVistaActiva("empresa")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                vistaActiva === "empresa"
                  ? "bg-azul-marino text-white shadow-sm"
                  : "text-gray-500 hover:text-azul-marino"
              }`}
            >
              Soy empresa
            </button>
          </div>
        </div>

        {/* Pasos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {pasos.map((paso, index) => (
            <div key={paso.numero} className="relative">
              {/* Línea conectora entre pasos — solo escritorio */}
              {index < pasos.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 z-0 -translate-x-1/2" />
              )}

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative z-10 h-full">
                {/* Número del paso */}
                <div className="w-10 h-10 bg-azul-marino text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">
                  {paso.numero}
                </div>

                {/* Ícono */}
                <div className="text-3xl mb-3">{paso.icono}</div>

                {/* Título y descripción */}
                <h3 className="font-bold text-azul-marino text-lg mb-2">{paso.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{paso.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-10">
          {vistaActiva === "candidato" ? (
            <Link to="/registro/candidato" className="btn-primario inline-block">
              Crear mi perfil gratis
            </Link>
          ) : (
            <Link to="/registro/empresa" className="btn-secundario inline-block">
              Registrar mi empresa
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
