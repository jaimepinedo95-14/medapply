import { useState } from "react";

const PLANES = [
  {
    nombre: "Gratuito",
    precio: "0",
    actual: true,
    beneficios: [
      "Perfil básico visible",
      "Postulaciones ilimitadas",
      "Subir hoja de vida PDF",
      "Acceso a todas las ofertas",
    ],
    sinBeneficios: ["Perfil destacado en búsquedas"],
    color: "border-gray-200",
    botonColor: "btn-outline",
    botonTexto: "Plan actual",
    botonDeshabilitado: true,
  },
  {
    nombre: "Destacado",
    precio: "9.900",
    actual: false,
    etiqueta: "Más popular",
    beneficios: [
      "Todo lo del plan gratuito",
      "✨ Perfil destacado en búsquedas",
      "Apareces primero ante las empresas",
      "Insignia de perfil verificado",
    ],
    color: "border-esmeralda ring-2 ring-esmeralda",
    botonColor: "btn-primario",
    botonTexto: "Activar por $9.900/mes",
    botonDeshabilitado: false,
  },
];

export default function SuscripcionCandidato() {
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const activarPlan = () => {
    setProcesando(true);
    // Pasarela de pago (Wompi) todavía no está activa
    setTimeout(() => {
      setMensaje("Próximamente — escríbenos a hola@medapply.co mientras activamos los pagos.");
      setProcesando(false);
      setTimeout(() => setMensaje(""), 5000);
    }, 600);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-azul-marino">Mi suscripción</h1>
        <p className="text-gray-500 text-sm mt-1">Destaca tu perfil y aparece primero ante las empresas del sector salud.</p>
      </div>

      {/* Banner + tarjetas de planes — ocultos temporalmente: acceso
          gratuito ilimitado, sin planes de pago. Quitar este comentario
          para reactivar cuando vuelvan los pagos.
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-8 flex items-center gap-3">
        <span className="text-2xl">📋</span>
        <div>
          <p className="font-semibold text-azul-marino text-sm">Estás en el plan Gratuito</p>
          <p className="text-gray-500 text-xs mt-0.5">Actualiza a Destacado para aparecer primero en las búsquedas de empresas.</p>
        </div>
      </div>

      {mensaje && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 mb-6 text-center text-sm text-azul-marino font-semibold">
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PLANES.map((plan) => (
          <div key={plan.nombre} className={`bg-white rounded-2xl border p-6 relative ${plan.color}`}>
            {plan.etiqueta && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-esmeralda text-white text-xs font-bold px-4 py-1 rounded-full">
                {plan.etiqueta}
              </span>
            )}
            <h3 className="text-lg font-bold text-azul-marino">{plan.nombre}</h3>
            <div className="my-3">
              <span className="text-3xl font-bold text-azul-marino">${plan.precio}</span>
              <span className="text-gray-400 text-sm"> COP/mes</span>
            </div>
            <ul className="space-y-2 mb-5">
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
            <button
              onClick={!plan.botonDeshabilitado ? activarPlan : undefined}
              disabled={plan.botonDeshabilitado || procesando}
              className={`w-full py-2.5 text-sm ${plan.botonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {procesando && !plan.botonDeshabilitado ? "Procesando..." : plan.botonTexto}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-6">
        Puedes cancelar en cualquier momento. El pago se procesa de forma segura.
      </p>
      */}

      <div className="bg-esmeralda/10 border border-esmeralda/30 rounded-xl px-5 py-4 text-center text-sm text-azul-marino font-semibold">
        🎉 Tienes acceso gratuito e ilimitado a todas las funciones de tu perfil.
      </div>
    </div>
  );
}
