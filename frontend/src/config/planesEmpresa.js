// Configuración de los 4 niveles de plan para empresas en MedApply.
// El valor real de cada empresa vive en perfiles_empresa.plan (Supabase).
// Este archivo solo define los límites y features de cada nivel — no es data mock,
// es configuración de producto (igual patrón que REGION_CO.planes en config/region.js).

export const LABEL_PLAN = {
  gratuito: "Gratis",
  basico:   "Básico",
  estandar: "Estándar",
  premium:  "Premium",
};

export const ORDEN_PLAN = ["gratuito", "basico", "estandar", "premium"];

// Número máximo de vacantes activas simultáneas por plan
export const LIMITE_VACANTES = {
  gratuito: 1,
  basico:   5,
  estandar: 15,
  premium:  Infinity,
};

// Puede ver la hoja de vida completa del candidato
export const PUEDE_VER_HV = {
  gratuito: false,
  basico:   true,
  estandar: true,
  premium:  true,
};

// Puede contactar directamente al candidato (ver su email)
export const PUEDE_CONTACTAR = {
  gratuito: false,
  basico:   false,
  estandar: true,
  premium:  true,
};

export const PLANES_INFO = [
  {
    key: "gratuito",
    nombre: "Gratis",
    precio: 0,
    badge: "Gratis por tiempo limitado",
    vacantesLabel: "1 vacante",
    features: [
      "1 vacante activa",
      "Solo ver nombre de candidatos",
    ],
  },
  {
    key: "basico",
    nombre: "Básico",
    precio: 59900,
    vacantesLabel: "5 vacantes",
    features: [
      "5 vacantes activas",
      "Ver hojas de vida completas",
    ],
  },
  {
    key: "estandar",
    nombre: "Estándar",
    precio: 119900,
    vacantesLabel: "15 vacantes",
    features: [
      "15 vacantes activas",
      "Ver hojas de vida completas",
      "Contactar candidatos",
    ],
  },
  {
    key: "premium",
    nombre: "Premium",
    precio: 249900,
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
