import { useState } from "react";

const PLANES = [
  {
    nombre: "Gratuito",
    precio: "0",
    actual: true,
    beneficios: ["1 oferta activa al mes", "Panel de gestión básico", "Ver candidatos postulados"],
    sinBeneficios: ["Más de 1 oferta activa", "Banco de hojas de vida", "Ofertas ilimitadas"],
    color: "border-gray-200",
    botonColor: "bg-gray-100 text-gray-400 cursor-not-allowed",
    botonTexto: "Plan actual",
    botonDeshabilitado: true,
  },
  {
    nombre: "Básico",
    precio: "79.900",
    actual: false,
    beneficios: ["Hasta 5 ofertas activas al mes", "Panel de gestión", "Ver candidatos postulados", "Soporte por correo"],
    sinBeneficios: ["Banco de hojas de vida"],
    color: "border-azul-marino",
    botonColor: "bg-azul-marino hover:bg-azul-hover text-white",
    botonTexto: "Activar plan Básico",
    botonDeshabilitado: false,
  },
  {
    nombre: "Premium",
    precio: "159.900",
    actual: false,
    etiqueta: "Más completo",
    beneficios: [
      "✨ Ofertas ilimitadas",
      "✨ Banco de hojas de vida",
      "Buscar y contactar candidatos",
      "Candidatos destacados primero",
      "Soporte prioritario",
    ],
    color: "border-esmeralda ring-2 ring-esmeralda",
    botonColor: "bg-esmeralda hover:bg-esmeralda-hover text-white",
    botonTexto: "Activar plan Premium",
    botonDeshabilitado: false,
  },
];

export default function SuscripcionEmpresa() {
  const [procesando, setProcesando] = useState(null);

  const activar = (plan) => {
    setProcesando(plan);
    setTimeout(() => {
      alert("Próximamente: integración con pasarela de pago.");
      setProcesando(null);
    }, 800);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-azul-marino">Mi suscripción</h1>
        <p className="text-gray-500 text-sm mt-1">Elige el plan que mejor se adapte a tus necesidades de contratación.</p>
      </div>

      {/* Plan actual */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-8 flex items-center gap-3">
        <span className="text-2xl">📋</span>
        <div>
          <p className="font-semibold text-azul-marino text-sm">Plan actual: Gratuito</p>
          <p className="text-gray-500 text-xs mt-0.5">Tienes 1 oferta activa disponible este mes.</p>
        </div>
      </div>

      {/* Tarjetas de planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANES.map((plan) => (
          <div key={plan.nombre} className={`bg-white rounded-2xl border p-6 relative flex flex-col ${plan.color}`}>
            {plan.etiqueta && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-esmeralda text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                {plan.etiqueta}
              </span>
            )}
            <div>
              <h3 className="text-lg font-bold text-azul-marino">{plan.nombre}</h3>
              <div className="my-3">
                <span className="text-2xl font-bold text-azul-marino">${plan.precio}</span>
                <span className="text-gray-400 text-xs"> COP/mes</span>
              </div>
              <ul className="space-y-1.5 mb-5">
                {plan.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-esmeralda mt-0.5 flex-shrink-0">✓</span> {b}
                  </li>
                ))}
                {plan.sinBeneficios?.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-300 line-through">
                    <span className="mt-0.5 flex-shrink-0">✗</span> {b}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => !plan.botonDeshabilitado && activar(plan.nombre)}
              disabled={plan.botonDeshabilitado || procesando === plan.nombre}
              className={`w-full mt-auto py-2.5 text-sm font-semibold rounded-xl transition-colors ${plan.botonColor} disabled:opacity-50`}
            >
              {procesando === plan.nombre ? "Procesando..." : plan.botonTexto}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-6">
        Todos los planes incluyen factura electrónica. Puedes cancelar en cualquier momento.
      </p>
    </div>
  );
}
