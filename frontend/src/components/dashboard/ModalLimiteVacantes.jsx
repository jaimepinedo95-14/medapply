import { useState } from "react";
import { Link } from "react-router-dom";
import { LABEL_PLAN, VACANTE_UNICA, formatPrecioPlan } from "../../config/planesEmpresa";

// Se muestra cuando una empresa intenta publicar o renovar una vacante pero
// ya agotó las disponibles según su plan. Ofrece dos caminos: comprar una
// vacante única o subir de plan. Los pagos (Wompi) todavía no están activos,
// así que ambos botones muestran un aviso en vez de procesar un cobro real.
export default function ModalLimiteVacantes({ plan, onCerrar }) {
  const [mensaje, setMensaje] = useState("");

  const mostrarProximamente = () => {
    setMensaje("Próximamente — escríbenos a hola@medapply.co mientras activamos los pagos.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🚧</div>
          <h3 className="font-bold text-azul-marino text-lg">Agotaste tus vacantes disponibles</h3>
          <p className="text-gray-500 text-sm mt-1">
            Tu plan actual es <strong>{LABEL_PLAN[plan]}</strong>. Elige una opción para seguir publicando:
          </p>
        </div>

        {mensaje && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4 text-center text-sm text-azul-marino font-semibold">
            {mensaje}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={mostrarProximamente}
            className="w-full flex items-center justify-between border border-esmeralda rounded-xl px-4 py-3 text-left hover:bg-esmeralda/5 transition-colors"
          >
            <span>
              <span className="block font-semibold text-azul-marino text-sm">{VACANTE_UNICA.nombre}</span>
              <span className="block text-gray-400 text-xs">{VACANTE_UNICA.descripcion}</span>
            </span>
            <span className="text-esmeralda font-bold text-sm whitespace-nowrap ml-3">
              {formatPrecioPlan(VACANTE_UNICA.precio)}
            </span>
          </button>

          <button
            onClick={mostrarProximamente}
            className="w-full bg-azul-marino hover:bg-azul-claro text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            Subir a un plan superior
          </button>

          <Link
            to="/empresa/plan"
            className="block text-center text-sm text-gray-500 hover:text-azul-marino py-2"
          >
            Ver comparativa de planes
          </Link>
        </div>

        <button onClick={onCerrar} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600">
          Cerrar
        </button>
      </div>
    </div>
  );
}
