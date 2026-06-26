import { MUNICIPIOS_COLOMBIA } from "./municipios";

/**
 * Configuración regional de MedApply.
 *
 * Para agregar un nuevo país (ej. Perú), crea un objeto con la misma forma
 * y cámbialo en REGION_ACTIVA. El resto del código ya lo leerá automáticamente.
 *
 * Ejemplo: import { REGION_PE } from "./region"; → REGION_ACTIVA = REGION_PE;
 */

// ── Colombia ────────────────────────────────────────────────────────────────
export const REGION_CO = {
  pais: "Colombia",
  paisCodigo: "CO",
  moneda: "COP",
  monedaSimbolo: "$",
  locale: "es-CO",

  salarioMinimo: 1_423_500,
  auxilioTransporte: 200_000,

  // Registro profesional de salud equivalente en cada país
  registroProfesional: {
    nombre: "ReTHUS",
    nombreCompleto: "Registro Único Nacional del Talento Humano en Salud",
    entidad: "Ministerio de Salud de Colombia",
    url: "https://www.minsalud.gov.co",
    campoCodigo: "Número de tarjeta profesional",
    placeholder: "Ej. 12345-C",
  },

  leyPrivacidad: "Ley 1581 de 2012",

  ciudades: MUNICIPIOS_COLOMBIA,

  telefono: {
    formato: "3XX XXX XXXX",
    prefijoPais: "+57",
    longitud: 10,
  },

  planes: {
    candidato: {
      gratuito: 0,
      destacado: 9_900,
    },
    empresa: {
      gratuito: 0,
      vacanteUnica: 49_900,
      basico: 89_900,
      estandar: 189_900,
      premium: 299_900,
    },
  },

  metodoPago: "PSE o tarjeta débito/crédito",
  impuesto: "IVA incluido",
};

// ── Perú (preparado para activar en el futuro) ───────────────────────────────
export const REGION_PE = {
  pais: "Perú",
  paisCodigo: "PE",
  moneda: "PEN",
  monedaSimbolo: "S/",
  locale: "es-PE",

  salarioMinimo: 1_025,       // Remuneración Mínima Vital (S/.) — actualizar al activar
  auxilioTransporte: 0,

  registroProfesional: {
    nombre: "SERUMS",
    nombreCompleto: "Servicio Rural y Urbano-Marginal de Salud",
    entidad: "Ministerio de Salud del Perú",
    url: "https://www.gob.pe/minsa",
    campoCodigo: "Código de habilitación",
    placeholder: "Ej. CM-12345",
  },

  leyPrivacidad: "Ley 29733",

  ciudades: [
    "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura",
    "Iquitos", "Cusco", "Huancayo", "Tacna", "Ica",
  ],

  telefono: {
    formato: "9XX XXX XXX",
    prefijoPais: "+51",
    longitud: 9,
  },

  planes: {
    candidato: {
      gratuito: 0,
      destacado: 19,           // en PEN — actualizar al activar
    },
    empresa: {
      gratuito: 0,
      basico: 99,
      premium: 199,
    },
  },

  metodoPago: "Yape, Plin o tarjeta",
  impuesto: "IGV incluido",
};

// ── México (preparado para activar en el futuro) ─────────────────────────────
export const REGION_MX = {
  pais: "México",
  paisCodigo: "MX",
  moneda: "MXN",
  monedaSimbolo: "$",
  locale: "es-MX",

  salarioMinimo: 278_80,      // Salario mínimo diario MXN × 30 — actualizar al activar
  auxilioTransporte: 0,

  registroProfesional: {
    nombre: "Cédula Profesional",
    nombreCompleto: "Cédula Profesional SEP",
    entidad: "Secretaría de Educación Pública",
    url: "https://www.sep.gob.mx",
    campoCodigo: "Número de cédula profesional",
    placeholder: "Ej. 12345678",
  },

  leyPrivacidad: "LFPDPPP",

  ciudades: [
    "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana",
    "León", "Juárez", "Zapopan", "Mérida", "Cancún",
  ],

  telefono: {
    formato: "XX XXXX XXXX",
    prefijoPais: "+52",
    longitud: 10,
  },

  planes: {
    candidato: {
      gratuito: 0,
      destacado: 79,
    },
    empresa: {
      gratuito: 0,
      basico: 499,
      premium: 999,
    },
  },

  metodoPago: "OXXO, tarjeta o transferencia",
  impuesto: "IVA incluido",
};

// ── REGIÓN ACTIVA — cambia solo esta línea para cambiar de país ──────────────
export const REGION = REGION_CO;

// ── Utilidades ───────────────────────────────────────────────────────────────

/** Formatea un número como moneda de la región activa */
export function formatMoneda(valor) {
  return new Intl.NumberFormat(REGION.locale, {
    style: "currency",
    currency: REGION.moneda,
    maximumFractionDigits: 0,
  }).format(valor);
}

/** Formatea un número con separadores de miles de la región activa */
export function formatNumero(valor) {
  return new Intl.NumberFormat(REGION.locale).format(valor);
}

/** Formatea un precio de plan: "$9.900 COP/mes" o "S/ 19/mes" */
export function formatPlan(valor) {
  if (valor === 0) return "Gratis";
  return `${REGION.monedaSimbolo}${formatNumero(valor)} ${REGION.moneda}/mes`;
}
