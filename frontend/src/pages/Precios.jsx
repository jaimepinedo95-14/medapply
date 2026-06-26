// Página de precios — los 4 planes de empresa vienen de config/planesEmpresa.js
// (misma fuente que usa el panel de empresa en /empresa/plan), para que los
// precios nunca queden desincronizados entre la web pública y el panel.
import { useState } from "react";
import { Link } from "react-router-dom";
import { REGION, formatNumero } from "../config/region";
import { PLANES_INFO, VACANTE_UNICA, formatPrecioPlan } from "../config/planesEmpresa";

const DESCRIPCION_POR_PLAN = {
  gratuito: "Prueba la plataforma publicando tu primera vacante sin costo.",
  basico:   "Para instituciones que contratan con frecuencia moderada.",
  estandar: "Para instituciones con varias vacantes abiertas a la vez.",
  premium:  "Para hospitales y clínicas con alta rotación de personal.",
};

const COLOR_POR_PLAN = {
  gratuito: "border-gray-200",
  basico:   "border-blue-200",
  estandar: "border-azul-marino/40",
  premium:  "border-esmeralda ring-2 ring-esmeralda",
};

const ESTILO_CTA_POR_PLAN = {
  gratuito: "btn-outline",
  basico:   "bg-azul-marino text-white rounded-xl px-6 py-3 font-semibold hover:bg-azul-claro transition-colors text-center block",
  estandar: "bg-azul-marino text-white rounded-xl px-6 py-3 font-semibold hover:bg-azul-claro transition-colors text-center block",
  premium:  "bg-esmeralda text-white rounded-xl px-6 py-3 font-semibold hover:bg-esmeralda-hover transition-colors text-center block",
};

const PLANES_EMPRESA = PLANES_INFO.map((p) => ({
  nombre: p.nombre,
  precio: p.precio,
  descripcion: DESCRIPCION_POR_PLAN[p.key],
  color: COLOR_POR_PLAN[p.key],
  badge: p.badge || null,
  caracteristicas: p.features.map((texto) => ({ texto, incluido: true })),
  cta: p.precio === 0 ? "Registrarme gratis" : `Elegir ${p.nombre}`,
  ctaHref: "/registro/empresa",
  ctaStyle: ESTILO_CTA_POR_PLAN[p.key],
}));

const PLANES_CANDIDATO = [
  {
    nombre: "Gratuito",
    precio: 0,
    descripcion: "Accede a miles de ofertas en el sector salud de Colombia.",
    color: "border-gray-200",
    badge: null,
    caracteristicas: [
      { texto: "Perfil profesional visible", incluido: true },
      { texto: "Postulaciones ilimitadas", incluido: true },
      { texto: "Subir hoja de vida PDF", incluido: true },
      { texto: "Acceso a todas las ofertas publicadas", incluido: true },
      { texto: "Apareces en búsquedas de empresas", incluido: false },
      { texto: "Insignia de perfil destacado", incluido: false },
      { texto: "Mayor visibilidad ante empresas Premium", incluido: false },
    ],
    cta: "Crear perfil gratis",
    ctaHref: "/registro/candidato",
    ctaStyle: "btn-outline",
  },
  {
    nombre: "Destacado",
    precio: REGION.planes.candidato.destacado,
    descripcion: "Máxima visibilidad ante las empresas que más contratan.",
    color: "border-yellow-400 ring-2 ring-yellow-400",
    badge: "Recomendado",
    caracteristicas: [
      { texto: "Todo lo del plan Gratuito", incluido: true },
      { texto: "Apareces primero en búsquedas", incluido: true },
      { texto: "Insignia ⭐ en tu perfil", incluido: true },
      { texto: "Mayor visibilidad ante empresas Premium", incluido: true },
      { texto: "Acceso preferencial a nuevas ofertas", incluido: true },
      { texto: "Tu perfil destacado por 30 días", incluido: true },
      { texto: "Soporte personalizado", incluido: true },
    ],
    cta: "Destacar mi perfil",
    ctaHref: "/registro/candidato",
    ctaStyle: "bg-yellow-500 text-white rounded-xl px-6 py-3 font-semibold hover:bg-yellow-600 transition-colors text-center block",
  },
];

const FAQS = [
  {
    pregunta: "¿Puedo cambiar de plan en cualquier momento?",
    respuesta: "Sí. Puedes actualizar tu plan en cualquier momento desde la sección 'Mi suscripción' dentro de tu panel. El cobro se ajusta de forma proporcional al tiempo restante del mes.",
  },
  {
    pregunta: "¿Cómo se realiza el cobro?",
    respuesta: "El cobro se realiza mensualmente a través de pasarela de pago segura (PSE, tarjeta débito/crédito). Recibirás una factura electrónica a tu correo registrado.",
  },
  {
    pregunta: "¿Qué pasa si cancelo mi suscripción?",
    respuesta: "Si cancelas tu suscripción, seguirás teniendo acceso a los beneficios del plan hasta que termine el período por el que pagaste. Luego pasarás automáticamente al plan Gratuito.",
  },
  {
    pregunta: "¿Hay contratos o cobros de permanencia?",
    respuesta: "No. Todas las suscripciones son mensuales y sin contratos de permanencia. Puedes cancelar cuando quieras sin penalizaciones.",
  },
  {
    pregunta: "¿Los precios incluyen IVA?",
    respuesta: "Los precios mostrados ya incluyen el IVA aplicable según la legislación colombiana vigente.",
  },
];

function TarjetaPlan({ plan }) {
  return (
    <div className={`bg-white rounded-3xl border-2 ${plan.color} p-6 flex flex-col relative`}>
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-esmeralda text-white text-xs font-bold px-4 py-1 rounded-full">
          {plan.badge}
        </span>
      )}
      <div className="mb-5">
        <h3 className="text-lg font-bold text-azul-marino mb-1">{plan.nombre}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          {plan.precio === 0 ? (
            <span className="text-3xl font-bold text-azul-marino">Gratis</span>
          ) : (
            <>
              <span className="text-3xl font-bold text-azul-marino">
                {REGION.monedaSimbolo}{formatNumero(plan.precio)}
              </span>
              <span className="text-gray-400 text-sm"> {REGION.moneda}/mes</span>
            </>
          )}
        </div>
        <p className="text-gray-500 text-sm">{plan.descripcion}</p>
      </div>

      {/* Lista de características */}
      <ul className="space-y-2 flex-1 mb-6">
        {plan.caracteristicas.map((c, i) => (
          <li key={i} className={`flex items-center gap-2 text-sm ${c.incluido ? "text-gray-700" : "text-gray-300"}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${c.incluido ? "bg-esmeralda/15 text-esmeralda" : "bg-gray-100 text-gray-300"}`}>
              {c.incluido ? "✓" : "–"}
            </span>
            {c.texto}
          </li>
        ))}
      </ul>

      <Link to={plan.ctaHref} className={plan.ctaStyle}>
        {plan.cta}
      </Link>
    </div>
  );
}

export default function Precios() {
  const [seccion, setSeccion] = useState("empresas");
  const [faqAbierto, setFaqAbierto] = useState(null);

  const planesActuales = seccion === "empresas" ? PLANES_EMPRESA : PLANES_CANDIDATO;

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-azul-marino text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-esmeralda-claro font-semibold uppercase tracking-widest text-sm mb-3">Planes y precios</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Precios transparentes para el sector salud
          </h1>
          <p className="text-blue-200 text-lg">
            Sin contratos ni sorpresas. Elige el plan que mejor se adapta a tu institución o perfil profesional.
          </p>
        </div>
      </section>

      {/* Toggle empresas / candidatos */}
      <div className="py-8 px-4 bg-gray-50">
        <div className="flex justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 flex gap-1 shadow-sm">
            {["empresas", "candidatos"].map((s) => (
              <button
                key={s}
                onClick={() => setSeccion(s)}
                className={`px-6 py-2.5 rounded-xl font-semibold capitalize text-sm transition-all ${seccion === s ? "bg-azul-marino text-white shadow" : "text-gray-600 hover:text-azul-marino"}`}
              >
                {s === "empresas" ? "🏥 Para empresas" : "👤 Para candidatos"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tarjetas de planes */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {seccion === "empresas" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {planesActuales.map((plan) => (
                  <TarjetaPlan key={plan.nombre} plan={plan} />
                ))}
              </div>
              <div className="mt-6 max-w-md mx-auto bg-white border border-dashed border-esmeralda rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-azul-marino text-sm">{VACANTE_UNICA.nombre}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{VACANTE_UNICA.descripcion}</p>
                  <p className="text-gray-400 text-xs mt-0.5">No cambia tu plan, solo suma 1 vacante.</p>
                </div>
                <p className="text-esmeralda font-bold text-lg whitespace-nowrap">
                  {formatPrecioPlan(VACANTE_UNICA.precio)}
                </p>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {planesActuales.map((plan) => (
                <TarjetaPlan key={plan.nombre} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Garantía / Beneficios */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-azul-marino text-center mb-8">¿Por qué elegir MedApply?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icono: "🛡", titulo: "Pago seguro", desc: "Transacciones cifradas con los mejores estándares de seguridad." },
              { icono: "🔄", titulo: "Sin permanencia", desc: "Cancela o cambia tu plan cuando quieras, sin penalizaciones." },
              { icono: "🏥", titulo: "Sector salud", desc: "Plataforma especializada exclusivamente en el sector salud de Colombia." },
              { icono: "📊", titulo: "Datos reales", desc: "Estadísticas claras sobre el alcance de tus ofertas y candidatos." },
            ].map((b) => (
              <div key={b.titulo} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <div className="text-3xl mb-3">{b.icono}</div>
                <p className="font-semibold text-azul-marino mb-1">{b.titulo}</p>
                <p className="text-gray-500 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparativa rápida */}
      {seccion === "empresas" && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-azul-marino text-center mb-8">Comparativa de planes</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-4 text-left font-semibold text-azul-marino">Característica</th>
                      <th className="px-4 py-4 text-center font-semibold text-gray-500">Gratis</th>
                      <th className="px-4 py-4 text-center font-semibold text-azul-marino">Básico</th>
                      <th className="px-4 py-4 text-center font-semibold text-azul-marino">Estándar</th>
                      <th className="px-4 py-4 text-center font-semibold text-esmeralda">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      ["Vacantes activas", "1 (única vez)", "3", "8", "Ilimitadas"],
                      ["Ver postulantes", "Solo nombre", "✓", "✓", "✓"],
                      ["Banco de hojas de vida", "–", "✓", "✓", "✓"],
                      ["Contactar candidatos", "–", "–", "✓", "✓"],
                      ["Match con IA", "–", "–", "–", "✓"],
                      ["Precio/mes", "Gratis", "$89.900", "$189.900", "$299.900"],
                    ].map(([label, gratuito, basico, estandar, premium]) => (
                      <tr key={label} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-700">{label}</td>
                        <td className="px-4 py-3 text-center text-gray-400">{gratuito}</td>
                        <td className="px-4 py-3 text-center text-azul-marino">{basico}</td>
                        <td className="px-4 py-3 text-center text-azul-marino">{estandar}</td>
                        <td className="px-4 py-3 text-center text-esmeralda font-semibold">{premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-azul-marino text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setFaqAbierto(faqAbierto === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
                >
                  <span className="font-semibold text-azul-marino text-sm">{faq.pregunta}</span>
                  <span className={`text-gray-400 text-lg transition-transform ${faqAbierto === i ? "rotate-180" : ""}`}>▾</span>
                </button>
                {faqAbierto === i && (
                  <div className="px-5 pb-4 border-t border-gray-50">
                    <p className="text-gray-600 text-sm leading-relaxed pt-3">{faq.respuesta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-14 px-4 bg-azul-marino text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-blue-200 mb-8">
            Regístrate gratis hoy y empieza a conectar con el mejor talento del sector salud en Colombia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/registro/empresa" className="bg-esmeralda hover:bg-esmeralda-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Registrar mi empresa
            </Link>
            <Link to="/registro/candidato" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Crear perfil profesional
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
