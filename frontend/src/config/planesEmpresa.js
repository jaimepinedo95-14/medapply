// Configuración de los planes para empresas en MedApply.
// El valor real de cada empresa vive en perfiles_empresa.plan (Supabase),
// con valores 'gratuito' | 'basico' | 'estandar' | 'premium'.
// "Vacante única" NO es un plan (no se guarda en perfiles_empresa.plan) —
// es una compra de un solo uso para sumar +1 vacante sin cambiar de plan.
// Este archivo solo define límites y precios — no es data mock, es
// configuración de producto (igual patrón que REGION_CO.planes en config/region.js).
// Los pagos (Wompi) todavía no están activos: todo lo de aquí es solo
// texto/valores/lógica visual hasta que se integre el cobro real.

// ──────────────────────────────────────────────────────────────────────────
// 🔒 ACCESO GRATUITO ILIMITADO (temporal)
// Decisión de producto: mientras los pagos (Wompi) no estén activos, TODOS
// los usuarios tienen acceso gratuito ilimitado y no se muestra ningún plan
// de pago. Para reactivar los planes reales, cambia esta bandera a `false`
// — toda la configuración original (límites, precios, features por plan)
// queda intacta abajo y vuelve a aplicarse automáticamente sin tocar nada
// más en este archivo.
// ──────────────────────────────────────────────────────────────────────────
const ACCESO_GRATUITO_ILIMITADO = true;

export const LABEL_PLAN = {
  gratuito: "Gratis",
  basico:   "Básico",
  estandar: "Estándar",
  premium:  "Premium",
};

export const ORDEN_PLAN = ["gratuito", "basico", "estandar", "premium"];

// Número máximo de vacantes activas simultáneas por plan (valores reales).
// El plan "gratuito" es además de un solo uso en la vida de la empresa (no
// recurrente): una vez que publicó su primera vacante gratis (en cualquier
// estado: activa, cerrada o expirada), no puede publicar otra gratis aunque
// la primera ya esté cerrada — debe comprar una vacante única o subir de plan.
const LIMITE_VACANTES_REAL = {
  gratuito: 1,
  basico:   3,
  estandar: 8,
  premium:  Infinity,
};

export const LIMITE_VACANTES = ACCESO_GRATUITO_ILIMITADO
  ? { gratuito: Infinity, basico: Infinity, estandar: Infinity, premium: Infinity }
  : LIMITE_VACANTES_REAL;

// Compra de una sola vacante adicional, sin cambiar de plan. Pensada para
// empresas que ya agotaron su vacante gratuita y solo necesitan publicar una más.
export const VACANTE_UNICA = {
  nombre: "Vacante única",
  precio: 49900,
  descripcion: "1 vacante adicional, pago único (no recurrente).",
};

// Puede ver la hoja de vida completa del candidato (valores reales)
const PUEDE_VER_HV_REAL = {
  gratuito: false,
  basico:   true,
  estandar: true,
  premium:  true,
};
export const PUEDE_VER_HV = ACCESO_GRATUITO_ILIMITADO
  ? { gratuito: true, basico: true, estandar: true, premium: true }
  : PUEDE_VER_HV_REAL;

// Puede contactar directamente al candidato (ver su email) (valores reales)
const PUEDE_CONTACTAR_REAL = {
  gratuito: false,
  basico:   false,
  estandar: true,
  premium:  true,
};
export const PUEDE_CONTACTAR = ACCESO_GRATUITO_ILIMITADO
  ? { gratuito: true, basico: true, estandar: true, premium: true }
  : PUEDE_CONTACTAR_REAL;

// Puede ver el perfil completo en "Buscar candidatos" (valores reales)
const PUEDE_VER_PERFIL_BUSQUEDA_REAL = {
  gratuito: false,
  basico:   false,
  estandar: true,
  premium:  true,
};
export const PUEDE_VER_PERFIL_BUSQUEDA = ACCESO_GRATUITO_ILIMITADO
  ? { gratuito: true, basico: true, estandar: true, premium: true }
  : PUEDE_VER_PERFIL_BUSQUEDA_REAL;

export const PLANES_INFO = [
  {
    key: "gratuito",
    nombre: "Gratis",
    precio: 0,
    badge: "Solo primera vez",
    vacantesLabel: "1 vacante (única vez)",
    features: [
      "1 vacante activa — solo la primera vez",
      "Solo ver nombre de candidatos",
    ],
  },
  {
    key: "basico",
    nombre: "Básico",
    precio: 89900,
    vacantesLabel: "3 vacantes",
    features: [
      "3 vacantes activas",
      "Ver hojas de vida completas",
    ],
  },
  {
    key: "estandar",
    nombre: "Estándar",
    precio: 189900,
    vacantesLabel: "8 vacantes",
    features: [
      "8 vacantes activas",
      "Ver hojas de vida completas",
      "Contactar candidatos",
    ],
  },
  {
    key: "premium",
    nombre: "Premium",
    precio: 299900,
    vacantesLabel: "Vacantes ilimitadas",
    features: [
      "Vacantes ilimitadas",
      "Ver hojas de vida completas",
      "Contactar candidatos",
      "Match con IA",
      "Vacantes destacadas",
    ],
  },
];

export function formatPrecioPlan(valor) {
  if (valor === 0) return "$0";
  return `$${valor.toLocaleString("es-CO")}`;
}

// Determina si una empresa puede publicar/renovar una vacante según su plan
// y su historial real en Supabase:
// - "gratuito": de un solo uso — cuenta TODAS las vacantes que haya tenido
//   alguna vez (cualquier estado), no solo las activas.
// - resto de planes: límite de vacantes ACTIVAS simultáneas.
export function puedeCrearVacante(plan, { totalHistorico = 0, activasActuales = 0 } = {}) {
  if (ACCESO_GRATUITO_ILIMITADO) return true;
  if (plan === "gratuito") return totalHistorico < 1;
  const limite = LIMITE_VACANTES_REAL[plan] ?? 1;
  if (!Number.isFinite(limite)) return true;
  return activasActuales < limite;
}
