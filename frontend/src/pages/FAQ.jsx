// Preguntas Frecuentes — dos secciones: candidatos y empresas
import { useState } from "react";

const PREGUNTAS_CANDIDATOS = [
  {
    q: "¿Cómo me registro en MedApply?",
    a: "El registro es muy sencillo: solo necesitas tu nombre completo, correo electrónico y una contraseña. Sin formularios largos. Después del registro puedes completar tu perfil profesional poco a poco con foto, experiencia, educación, hoja de vida PDF y más — todo a tu ritmo y 100% opcional.",
  },
  {
    q: "¿Es gratuito crear un perfil como candidato?",
    a: "Sí, completamente gratuito. Puedes registrarte, crear tu perfil, postularte a ofertas y ser visible para empresas sin pagar nada. El plan Destacado ($9.900 COP/mes) es opcional y te da más visibilidad: apareces primero en las búsquedas de empresas y obtienes una insignia especial en tu perfil.",
  },
  {
    q: "¿Qué es el badge Verificado ReTHUS y cómo lo obtengo?",
    a: "ReTHUS es el Registro Único Nacional del Talento Humano en Salud del Ministerio de Salud de Colombia. Al ingresar tu número de tarjeta profesional en tu perfil, se activa automáticamente un badge verde de 'Verificado ReTHUS' que aumenta la confianza de las empresas en tu perfil. Puedes consultar tu número en el portal oficial: minsalud.gov.co.",
  },
  {
    q: "¿Cómo me postulo a una oferta?",
    a: "Entra al detalle de la oferta y haz clic en el botón verde 'Postularme a esta oferta'. Si ya iniciaste sesión, tu postulación se envía automáticamente. Si no tienes cuenta, te redirigirá al registro (solo 30 segundos). Después podrás ver el estado de todas tus postulaciones en la sección 'Mis postulaciones' de tu panel.",
  },
  {
    q: "¿Cómo sé si mi postulación fue recibida o revisada?",
    a: "En tu panel, en la sección 'Mis postulaciones', puedes ver el estado de cada postulación: Enviada, En revisión, Preseleccionado, Entrevista agendada, Rechazada, o Contratado. Cuando el estado cambia, también recibirás una notificación al correo que registraste.",
  },
  {
    q: "¿Puedo subir mi hoja de vida en PDF?",
    a: "Sí. En tu perfil, en la sección 'Hoja de vida PDF', puedes subir un archivo PDF de máximo 5 MB. Este archivo estará disponible para las empresas que visiten tu perfil. También puedes reemplazarlo en cualquier momento si actualizas tu CV.",
  },
  {
    q: "¿Qué es el video de presentación?",
    a: "Es un video opcional de máximo 60 segundos donde te presentas y cuentas brevemente tu experiencia. Los perfiles con video reciben hasta 3 veces más contactos de empresas. No necesita ser profesional — la autenticidad vale más. Puedes subir MP4, MOV o WebM desde tu perfil.",
  },
  {
    q: "¿Cómo funciona el indicador de completitud del perfil?",
    a: "Tu perfil tiene un porcentaje de completitud del 0% al 100%. Cada sección que completas sube el porcentaje: foto (+10%), información básica (+20%), teléfono (+5%), ReTHUS (+15%), experiencia (+20%), educación (+15%), CV PDF (+10%), video (+5%). Los perfiles con mayor porcentaje aparecen primero en las búsquedas de empresas premium.",
  },
  {
    q: "¿Cómo cancelo mi plan Destacado?",
    a: "Puedes cancelar en cualquier momento desde tu panel, en la sección 'Mi suscripción'. Al cancelar, seguirás con los beneficios del plan Destacado hasta que termine el período mensual que ya pagaste. Después pasas automáticamente al plan gratuito, sin cobros adicionales.",
  },
  {
    q: "¿Mis datos personales están protegidos?",
    a: "Sí. MedApply cumple con la Ley 1581 de 2012 de protección de datos personales de Colombia. Tu información solo se comparte con empresas según los permisos que tú configures. Puedes ver nuestra Política de Privacidad completa en /privacidad y ejercer tus derechos de acceso, actualización, rectificación y supresión en cualquier momento.",
  },
];

const PREGUNTAS_EMPRESAS = [
  {
    q: "¿Cómo registro mi empresa en MedApply?",
    a: "El registro es muy rápido: solo nombre de tu empresa, correo y contraseña. Sin NIT, sin trámites largos. Después del registro, en la sección Configuración de tu panel, completas el perfil de tu empresa con NIT, logo, tipo de institución, ciudad y descripción.",
  },
  {
    q: "¿Cuáles son los planes disponibles para empresas?",
    a: "Tenemos tres planes: Gratuito (1 oferta activa/mes, sin costo), Básico ($79.900 COP/mes, hasta 5 ofertas + soporte por correo), y Premium ($159.900 COP/mes, ofertas ilimitadas + banco completo de candidatos + contacto directo + soporte prioritario). Todos los precios incluyen IVA.",
  },
  {
    q: "¿Cómo publico una oferta de empleo?",
    a: "Desde tu panel de empresa, ve a 'Publicar oferta'. Completa el formulario con: título del cargo, categoría profesional, ciudad, tipo de contrato, salario (opcional), descripción del cargo, requisitos y fecha límite de postulación. La oferta queda visible inmediatamente en el listado público de MedApply.",
  },
  {
    q: "¿Cuánto tiempo permanece activa una oferta?",
    a: "Cada oferta tiene una fecha límite que estableces al publicarla. Puedes editarla, pausarla o cerrarla en cualquier momento desde 'Mis ofertas' en tu panel. En el plan Gratuito solo puedes tener 1 oferta activa a la vez; en Básico hasta 5; en Premium son ilimitadas.",
  },
  {
    q: "¿Qué es el banco de candidatos y cómo accedo?",
    a: "El banco de candidatos es una base de datos de más de 1.200 profesionales del sector salud que han creado perfil en MedApply. Puedes filtrar por categoría profesional, ciudad y disponibilidad, y ver el perfil completo de cada candidato. Esta función está disponible exclusivamente para empresas con plan Premium.",
  },
  {
    q: "¿Cómo contacto directamente a un candidato?",
    a: "Con el plan Premium, desde el banco de candidatos puedes hacer clic en 'Contactar' en el perfil de cualquier candidato y enviarle un mensaje directamente. El candidato recibirá tu mensaje por correo. También puedes ver y contactar a quienes se postularon a tus ofertas desde 'Mis ofertas → Ver postulados'.",
  },
  {
    q: "¿Puedo pausar una oferta sin eliminarla?",
    a: "Sí. En 'Mis ofertas', cada oferta tiene un botón para pausarla temporalmente. Los candidatos no podrán postularse mientras esté pausada, pero toda la información se conserva. Puedes reactivarla cuando quieras.",
  },
  {
    q: "¿Cómo cambio o cancelo mi plan?",
    a: "Desde tu panel, en 'Mi suscripción', puedes actualizar o cambiar tu plan en cualquier momento. Al cancelar, mantienes los beneficios del plan actual hasta el final del período mensual ya pagado. No hay contratos de permanencia ni penalizaciones.",
  },
  {
    q: "¿Hay factura electrónica disponible?",
    a: "Sí. Cada pago genera automáticamente una factura electrónica que se envía al correo registrado. Para empresas con plan Básico o Premium, la factura está disponible también en la sección 'Mi suscripción → Historial de pagos' de tu panel.",
  },
  {
    q: "¿Qué pasa con mis ofertas si cambio al plan Gratuito?",
    a: "Al bajar al plan Gratuito, solo podrás mantener 1 oferta activa. Las ofertas adicionales pasarán automáticamente a estado 'Pausada' — no se eliminarán. Podrás reactivar o archivar las ofertas pausadas desde 'Mis ofertas'.",
  },
];

function AccordionItem({ pregunta, respuesta, abierto, onToggle }) {
  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-colors ${abierto ? "border-azul-claro/40" : "border-gray-100 hover:border-gray-200"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50/50 transition-colors"
      >
        <span className="font-semibold text-azul-marino text-sm leading-snug">{pregunta}</span>
        <span className={`text-gray-400 text-lg flex-shrink-0 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}>▾</span>
      </button>
      {abierto && (
        <div className="bg-white px-5 pb-5 border-t border-gray-100">
          <p className="text-gray-600 text-sm leading-relaxed pt-3">{respuesta}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [abierto, setAbierto] = useState(null);
  const [seccion, setSeccion] = useState("candidatos");

  const toggle = (id) => setAbierto((a) => (a === id ? null : id));

  const preguntas = seccion === "candidatos" ? PREGUNTAS_CANDIDATOS : PREGUNTAS_EMPRESAS;

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-azul-marino text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-esmeralda-claro font-semibold uppercase tracking-widest text-sm mb-3">Ayuda</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Preguntas frecuentes</h1>
          <p className="text-blue-200 text-lg">
            Todo lo que necesitas saber sobre cómo funciona MedApply.
          </p>
        </div>
      </section>

      {/* Toggle candidatos / empresas */}
      <div className="py-8 px-4 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-1 flex gap-1 shadow-sm">
            {[
              { key: "candidatos", label: "👤 Para candidatos" },
              { key: "empresas",   label: "🏥 Para empresas" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => { setSeccion(s.key); setAbierto(null); }}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${seccion === s.key ? "bg-azul-marino text-white shadow" : "text-gray-600 hover:text-azul-marino"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preguntas */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {preguntas.map((item, i) => (
            <AccordionItem
              key={`${seccion}-${i}`}
              pregunta={item.q}
              respuesta={item.a}
              abierto={abierto === `${seccion}-${i}`}
              onToggle={() => toggle(`${seccion}-${i}`)}
            />
          ))}
        </div>
      </section>

      {/* CTA de contacto */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-3xl mb-3">💬</div>
          <h2 className="text-xl font-bold text-azul-marino mb-2">¿No encontraste tu respuesta?</h2>
          <p className="text-gray-500 text-sm mb-6">
            Escríbenos y te respondemos en menos de 24 horas hábiles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:hola@medapply.co"
              className="bg-azul-marino text-white font-semibold px-6 py-3 rounded-xl hover:bg-azul-claro transition-colors"
            >
              📧 hola@medapply.co
            </a>
            <a
              href="/nosotros#contacto"
              className="btn-outline py-3 px-6"
            >
              Formulario de contacto
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
