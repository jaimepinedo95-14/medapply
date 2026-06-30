// Configuración central de SEO: ciudades, profesiones, textos y salarios.
// Todas las páginas SEO importan desde aquí.

// ── Ciudades ────────────────────────────────────────────────────────────────
// `db` debe coincidir EXACTAMENTE con el valor del campo `ciudad` en Supabase.
export const CIUDADES_SEO = [
  { slug: "bogota",         nombre: "Bogotá",         db: "Bogotá"         },
  { slug: "medellin",       nombre: "Medellín",       db: "Medellín"       },
  { slug: "cali",           nombre: "Cali",           db: "Cali"           },
  { slug: "barranquilla",   nombre: "Barranquilla",   db: "Barranquilla"   },
  { slug: "cartagena",      nombre: "Cartagena",      db: "Cartagena"      },
  { slug: "bucaramanga",    nombre: "Bucaramanga",    db: "Bucaramanga"    },
  { slug: "pereira",        nombre: "Pereira",        db: "Pereira"        },
  { slug: "manizales",      nombre: "Manizales",      db: "Manizales"      },
  { slug: "cucuta",         nombre: "Cúcuta",         db: "Cúcuta"         },
  { slug: "ibague",         nombre: "Ibagué",         db: "Ibagué"         },
  { slug: "villavicencio",  nombre: "Villavicencio",  db: "Villavicencio"  },
  { slug: "santa-marta",    nombre: "Santa Marta",    db: "Santa Marta"    },
  { slug: "monteria",       nombre: "Montería",       db: "Montería"       },
  { slug: "neiva",          nombre: "Neiva",          db: "Neiva"          },
  { slug: "armenia",        nombre: "Armenia",        db: "Armenia"        },
  { slug: "pasto",          nombre: "Pasto",          db: "Pasto"          },
  { slug: "popayan",        nombre: "Popayán",        db: "Popayán"        },
  { slug: "valledupar",     nombre: "Valledupar",     db: "Valledupar"     },
  { slug: "sincelejo",      nombre: "Sincelejo",      db: "Sincelejo"      },
  { slug: "riohacha",       nombre: "Riohacha",       db: "Riohacha"       },
];

// Las 6 primeras son "ciudades principales" para footer y cross-links
export const CIUDADES_PRINCIPALES = CIUDADES_SEO.slice(0, 6);
// Las 8 primeras para la sección "Empleos en otras ciudades" de cada página ciudad
export const CIUDADES_TOP_8 = CIUDADES_SEO.slice(0, 8);

// ── Profesiones ──────────────────────────────────────────────────────────────
// `busqueda` es el término para ilike('categoria_profesional', '%busqueda%').
// Usar strings sin tildes en la búsqueda hace el ilike más robusto.
export const PROFESIONES_SEO = [
  {
    slug: "medicina-general",
    nombre: "Medicina General",
    plural: "Médicos Generales",
    db: "Médico general",
    busqueda: "dico general",
  },
  {
    slug: "enfermeria",
    nombre: "Enfermería",
    plural: "Enfermeros y Enfermeras",
    db: "Enfermero/a",
    busqueda: "enfermero",
  },
  {
    slug: "psicologia",
    nombre: "Psicología",
    plural: "Psicólogos y Psicólogas",
    db: "Psicólogo/a",
    busqueda: "psicolog",
  },
  {
    slug: "odontologia",
    nombre: "Odontología",
    plural: "Odontólogos y Odontólogas",
    db: "Odontólogo/a",
    busqueda: "odontolog",
  },
  {
    slug: "fisioterapia",
    nombre: "Fisioterapia",
    plural: "Fisioterapeutas",
    db: "Fisioterapeuta",
    busqueda: "fisioterapeuta",
  },
  {
    slug: "nutricion",
    nombre: "Nutrición y Dietética",
    plural: "Nutricionistas y Dietistas",
    db: "Nutricionista",
    busqueda: "nutricion",
  },
  {
    slug: "bacteriologia",
    nombre: "Bacteriología",
    plural: "Bacteriólogos y Bacteriólogas",
    db: "Bacteriólogo/a",
    busqueda: "bacteriol",
  },
  {
    slug: "optometria",
    nombre: "Optometría",
    plural: "Optómetras",
    db: "Optómetra",
    busqueda: "optometr",
  },
  {
    slug: "fonoaudiologia",
    nombre: "Fonoaudiología",
    plural: "Fonoaudiólogos y Fonoaudiólogas",
    db: "Fonoaudiólogo/a",
    busqueda: "fonoaudiolog",
  },
  {
    slug: "terapia-ocupacional",
    nombre: "Terapia Ocupacional",
    plural: "Terapeutas Ocupacionales",
    db: "Terapeuta ocupacional",
    busqueda: "terapeuta ocupacional",
  },
  {
    slug: "auxiliar-enfermeria",
    nombre: "Auxiliar de Enfermería",
    plural: "Auxiliares de Enfermería",
    db: "Auxiliar de enfermería",
    busqueda: "auxiliar de enfermer",
  },
  {
    slug: "instrumentacion-quirurgica",
    nombre: "Instrumentación Quirúrgica",
    plural: "Instrumentadores Quirúrgicos",
    db: "Instrumentador/a quirúrgico/a",
    busqueda: "instrumentador",
  },
  {
    slug: "salud-ocupacional",
    nombre: "Salud Ocupacional",
    plural: "Profesionales en Salud Ocupacional",
    db: "Salud ocupacional",
    busqueda: "salud ocupacional",
  },
  {
    slug: "medicina-especializada",
    nombre: "Medicina Especializada",
    plural: "Médicos Especialistas",
    db: "Médico especialista",
    busqueda: "dico especialista",
  },
];

// Las 5 primeras para footer y cross-links principales
export const PROFESIONES_PRINCIPALES = PROFESIONES_SEO.slice(0, 5);
// Las 6 primeras para la sección "Buscar por profesión en {Ciudad}"
export const PROFESIONES_TOP_6 = PROFESIONES_SEO.slice(0, 6);

// ── Textos SEO por ciudad ────────────────────────────────────────────────────
// Textos únicos de ~80-110 palabras para el bloque SEO de cada página /empleos/:ciudad
export const TEXTOS_SEO_CIUDAD = {
  bogota: `Bogotá concentra el mayor número de vacantes en salud de Colombia. La ciudad alberga hospitales universitarios como el Hospital de San José, la Fundación Santa Fe de Bogotá y el Hospital El Tunal, además de cientos de clínicas y centros médicos privados. Los médicos generales, enfermeros, psicólogos y bacteriólogos encuentran aquí las mejores oportunidades del país. Las localidades de Chapinero, Usaquén y Kennedy lideran la demanda de talento médico. Si buscas empleo en salud en Bogotá, MedApply conecta tu perfil con instituciones verificadas en toda la ciudad.`,

  medellin: `Medellín es el segundo mercado más activo para profesionales de la salud en Colombia. La ciudad cuenta con instituciones de alta complejidad como el Hospital Pablo Tobón Uribe, la Clínica Las Américas y el Hospital General de Medellín. El Eje Cafetero y el Área Metropolitana del Valle de Aburrá amplían las opciones laborales hacia Envigado, Bello e Itagüí. La demanda es especialmente alta para médicos generales, enfermeros y auxiliares de enfermería. MedApply actualiza diariamente las vacantes disponibles en clínicas e IPS de toda la región antioqueña.`,

  cali: `Cali es el tercer mercado de empleo en salud más grande del país. La ciudad alberga el Hospital Universitario del Valle (HUV), la Clínica Imbanaco y la Clínica de Occidente, entre decenas de IPS activas. Valle del Cauca tiene una demanda creciente de enfermeros, médicos generales, fisioterapeutas y bacteriólogos. Los municipios del Norte del Cauca y el corredor industrial hacia Palmira y Jamundí también generan empleo constante. En MedApply puedes postularte directamente a vacantes activas en Cali y el sur occidente colombiano.`,

  barranquilla: `Barranquilla lidera el empleo en salud en la Costa Caribe colombiana. El Hospital Universitario CARI, la Clínica del Caribe y la Fundación Clínica Campbell son los principales empleadores de la región. La ciudad experimenta un crecimiento sostenido en la demanda de médicos generales, odontólogos, psicólogos y auxiliares de enfermería. Los corregimientos del área metropolitana —Soledad, Malambo y Puerto Colombia— también ofrecen oportunidades laborales para profesionales del sector. En MedApply encuentras vacantes verificadas en todas las IPS y clínicas activas de Barranquilla y el Atlántico.`,

  cartagena: `Cartagena combina el turismo médico con una sólida red de instituciones de salud. El Hospital Universitario del Caribe, la Clínica Blas de Lezo y el Hospital Infantil Napoleón Franco Pareja son los referentes de la región. La creciente industria de turismo médico genera demanda específica de especialistas en medicina estética, cirugía plástica y rehabilitación. Los profesionales de enfermería, bacteriología y optometría también tienen amplia demanda. MedApply lista las vacantes más recientes en Cartagena y los municipios del Bolívar, conectando talento con las mejores instituciones del Caribe colombiano.`,

  bucaramanga: `Bucaramanga es uno de los centros de salud más importantes del nororiente colombiano. El Hospital Universitario Ramón González Valencia, la Clínica FOSCAL y el Instituto del Corazón atienden a pacientes de toda la región. La demanda de médicos especialistas, enfermeros y bacteriólogos supera la oferta local, generando oportunidades atractivas. El Área Metropolitana incluye Floridablanca, Girón y Piedecuesta, con múltiples centros médicos y EPS. MedApply muestra diariamente las vacantes activas en Santander, filtrando por especialidad y tipo de institución para facilitar tu búsqueda.`,

  pereira: `Pereira es el epicentro del empleo en salud en el Eje Cafetero. El Hospital Universitario San Jorge, la Clínica Comfamiliar Risaralda y la IPS Universitaria son los principales empleadores de la región. La ciudad demanda constantemente médicos generales, odontólogos, fisioterapeutas y auxiliares de enfermería. Los municipios de Dosquebradas y Santa Rosa de Cabal amplían las oportunidades para profesionales recién graduados. Con MedApply puedes encontrar vacantes reales en Pereira, Risaralda y el occidente colombiano, actualiz las ofertas cada día con información directa de las instituciones.`,

  manizales: `Manizales alberga una importante red hospitalaria que sirve a toda la región del Eje Cafetero. El Hospital Universitario de Caldas, la Clínica Santa María y el Hospital Santa Sofía son los empleadores más activos. La ciudad tiene una demanda consistente de médicos, enfermeros, bacteriólogos y personal auxiliar de enfermería. La universidad de Manizales y la Universidad de Caldas forman constantemente nuevos profesionales de la salud en la región. MedApply centraliza todas las vacantes disponibles en Manizales y Caldas, con filtros por categoría y tipo de contrato.`,

  cucuta: `Cúcuta es el principal centro de salud del nororiente de Colombia y punto de atención para pacientes venezolanos. El Hospital Universitario Erasmo Meoz y la ESE Norte de Santander atienden diariamente a miles de pacientes. La demanda de médicos generales, enfermeros y auxiliares es especialmente alta debido a la presión migratoria en la frontera. El área metropolitana con Villa del Rosario y Los Patios amplía el mercado laboral. En MedApply encuentras vacantes verificadas en Cúcuta y Norte de Santander, con información clara sobre requisitos y condiciones salariales.`,

  ibague: `Ibagué tiene un sistema de salud en crecimiento que demanda constantemente nuevos profesionales. El Hospital Federico Lleras Acosta, la Clínica Tolima y el Hospital San Francisco de Asís son los principales centros médicos del Tolima. La ciudad demanda médicos generales, odontólogos, psicólogos y personal de enfermería, especialmente en atención primaria. Municipios como Espinal, Melgar y Chaparral también generan oportunidades para profesionales dispuestos a trabajar en zonas de influencia. MedApply te conecta con vacantes reales en Ibagué y el Tolima, ordenadas por fecha de publicación.`,

  villavicencio: `Villavicencio es el centro de salud de los Llanos Orientales y la Orinoquia colombiana. El Hospital Departamental de Villavicencio y la Clínica del Meta son los empleadores más grandes de la región. La escasez de profesionales de salud en la Orinoquia genera salarios competitivos y beneficios adicionales para quienes se trasladan. Meta, Casanare y Vichada demandan médicos, enfermeros, bacteriólogos y personal auxiliar de manera constante. MedApply es la plataforma más completa para encontrar empleo en salud en Villavicencio y la Orinoquia colombiana.`,

  "santa-marta": `Santa Marta combina un sistema de salud en expansión con una calidad de vida excepcional en el Caribe. El Hospital Universitario Fernando Troconis, la Clínica San Pedro Claver y los centros de atención del Magdalena generan empleo continuo. La demanda de médicos generales, odontólogos, fisioterapeutas y psicólogos supera la oferta local. El crecimiento turístico de la región impulsa también la medicina estética y la salud preventiva. Con MedApply puedes encontrar vacantes reales en Santa Marta y el Magdalena, con filtros por especialidad y tipo de contrato disponibles.`,

  monteria: `Montería es el centro de salud de Córdoba y la Costa Caribe interior. El Hospital San Jerónimo de Montería, el ESE Camu del Prado y la Clínica Especialistas son los principales empleadores de la región. La demanda de médicos generales, enfermeros y auxiliares es constante en toda la subregión cordobesa. Municipios como Cereté, Lorica y Sahagún generan oportunidades adicionales para profesionales que buscan desarrollarse en zonas con alta necesidad de atención. MedApply centraliza las vacantes activas en Montería y Córdoba, con información verificada y actualizada diariamente.`,

  neiva: `Neiva lidera el mercado de empleo en salud del Huila y el sur colombiano. El Hospital Universitario Hernando Moncaleano Perdomo y la Clínica Medilaser son los principales empleadores. La demanda en toda la región del Huila es alta para médicos generales, enfermeros, bacteriólogos y personal auxiliar. La cercanía con departamentos como Caquetá y Putumayo amplía las oportunidades para profesionales que deseen trabajar en regiones de difícil acceso con incentivos especiales. En MedApply encuentras las vacantes más recientes en Neiva y el Huila, disponibles sin costo para candidatos.`,

  armenia: `Armenia forma parte del triángulo de oro del Eje Cafetero, con una red de salud madura y en crecimiento. El Hospital San Juan de Dios y la Clínica Nuestra Señora de Los Remedios son los empleadores más activos en el Quindío. La demanda de médicos, odontólogos, psicólogos y auxiliares de enfermería es consistente durante todo el año. Los municipios del Quindío como Calarcá, La Tebaida y Montenegro también generan vacantes activas. MedApply conecta diariamente a profesionales de la salud con las mejores instituciones de Armenia y el Eje Cafetero.`,

  pasto: `Pasto es el epicentro de salud del suroccidente colombiano y de la región andina de Nariño. El Hospital Universitario Departamental de Nariño y la Clínica Nuestra Señora de Fátima atienden a una vasta población regional. La demanda de médicos generales, enfermeros, bacteriólogos y especialistas supera la oferta local de egresados. Departamentos vecinos como Putumayo y la frontera con Ecuador generan demanda adicional. En MedApply puedes postularte a vacantes verificadas en Pasto y todo el suroccidente colombiano sin intermediarios ni costos.`,

  popayan: `Popayán tiene una de las redes universitarias de salud más antiguas del país. El Hospital Universitario San José y el Centro Médico Imbanaco del Cauca son referentes regionales. La presencia de varias universidades médicas genera tanto oferta como demanda constante de profesionales de la salud. La ciudad necesita médicos generales, enfermeros, psicólogos y fisioterapeutas para atender a toda la región del Cauca. Con MedApply los profesionales en Popayán encuentran vacantes activas en clínicas e IPS verificadas, con información de contacto y requisitos claros.`,

  valledupar: `Valledupar es el principal centro de salud del Cesar y la Sierra Nevada colombiana. El Hospital Rosario Pumarejo de López y la Clínica Valledupar atienden a pacientes de todo el departamento. La región demanda constantemente médicos generales, odontólogos, bacteriólogos y auxiliares de enfermería. El auge agroindustrial y el crecimiento poblacional impulsan la apertura de nuevas IPS y centros médicos. MedApply facilita la búsqueda de empleo en salud en Valledupar y el Cesar, con vacantes filtradas por categoría profesional y tipo de institución.`,

  sincelejo: `Sincelejo es el polo de salud de Sucre y del Canal del Dique. El Hospital Universitario de Sincelejo y la ESE Camu del Prado son los empleadores más activos. La demanda de médicos generales, enfermeros, bacteriólogos y auxiliares es permanente en toda la región. Los municipios de Corozal, Sampués y Sahagún también generan oportunidades para profesionales recién egresados. MedApply lista las vacantes disponibles en Sincelejo y Sucre, con actualizaciones diarias y filtros por profesión para facilitar tu búsqueda en la región Caribe interior.`,

  riohacha: `Riohacha es el centro de salud de La Guajira y punto de atención para comunidades indígenas wayuu. El Hospital Nuestra Señora de Los Remedios y los centros de atención intercultural son los empleadores principales. La demanda de médicos, enfermeros y psicólogos con vocación social es alta en toda la Guajira. El trabajo con comunidades rurales e indígenas puede incluir incentivos adicionales del Ministerio de Salud para zonas de difícil acceso. Con MedApply encuentras oportunidades de empleo en salud en Riohacha y toda La Guajira, con información clara y directa de las instituciones empleadoras.`,
};

// ── Datos de salarios por profesión ─────────────────────────────────────────
// Para las páginas /salarios/:profesion — solo 5 profesiones con datos completos
export const DATOS_SALARIO = {
  "medicina-general": {
    nombre: "Medicina General",
    slug: "medicina-general",
    intro: "El médico general es uno de los profesionales de la salud más demandados de Colombia. Trabaja en atención primaria, urgencias, consulta externa y medicina domiciliaria. Los salarios varían según ciudad, tipo de institución y jornada.",
    rangos: [
      { nivel: "Recién graduado (0–2 años)", min: "3.500.000", max: "5.000.000" },
      { nivel: "Con experiencia (3–7 años)", min: "5.000.000", max: "8.000.000" },
      { nivel: "Senior (8+ años)",           min: "7.000.000", max: "12.000.000" },
    ],
    porCiudad: [
      { ciudad: "Bogotá",         min: "4.000.000", max: "10.000.000" },
      { ciudad: "Medellín",       min: "3.800.000", max: "9.000.000"  },
      { ciudad: "Cali",           min: "3.500.000", max: "8.500.000"  },
      { ciudad: "Barranquilla",   min: "3.200.000", max: "8.000.000"  },
      { ciudad: "Cartagena",      min: "3.000.000", max: "7.500.000"  },
      { ciudad: "Otras ciudades", min: "2.800.000", max: "7.000.000"  },
    ],
    porInstitucion: [
      { tipo: "Hospital público (planta)",    rango: "$3.500.000 – $6.000.000" },
      { tipo: "Clínica privada",              rango: "$4.500.000 – $10.000.000" },
      { tipo: "EPS (consulta externa)",       rango: "$3.500.000 – $6.500.000"  },
      { tipo: "Atención domiciliaria",        rango: "$4.000.000 – $7.500.000"  },
      { tipo: "Urgencias (turnos)",           rango: "$5.000.000 – $9.000.000"  },
    ],
    factoresSalario: "Los turnos nocturnos y festivos tienen recargos del 35–75% sobre el salario ordinario. Un médico que trabaja en prestación de servicios puede percibir ingresos brutos más altos, pero sin prestaciones sociales. La especialización duplica o triplica el salario base.",
    textoseo: "En Colombia, la demanda de médicos generales supera la oferta en ciudades intermedias. El sistema de salud colombiano emplea médicos en EPS, hospitales públicos, clínicas privadas, urgencias y atención domiciliaria. La experiencia, la ciudad y el tipo de contrato son los factores que más impactan el salario mensual.",
  },

  "enfermeria": {
    nombre: "Enfermería",
    slug: "enfermeria",
    intro: "Los profesionales de enfermería son el pilar del sistema de salud colombiano. Se desempeñan en hospitalización, cuidados intensivos, salas de cirugía, salud pública y atención domiciliaria. La demanda supera constantemente la oferta en todo el país.",
    rangos: [
      { nivel: "Recién graduado (0–2 años)", min: "2.500.000", max: "3.500.000" },
      { nivel: "Con experiencia (3–7 años)", min: "3.500.000", max: "5.000.000" },
      { nivel: "Senior (8+ años)",           min: "4.500.000", max: "7.000.000" },
    ],
    porCiudad: [
      { ciudad: "Bogotá",         min: "2.800.000", max: "6.500.000" },
      { ciudad: "Medellín",       min: "2.700.000", max: "6.000.000" },
      { ciudad: "Cali",           min: "2.500.000", max: "5.500.000" },
      { ciudad: "Barranquilla",   min: "2.300.000", max: "5.000.000" },
      { ciudad: "Cartagena",      min: "2.200.000", max: "4.800.000" },
      { ciudad: "Otras ciudades", min: "2.000.000", max: "4.500.000" },
    ],
    porInstitucion: [
      { tipo: "UCI / Cuidados intensivos",   rango: "$3.500.000 – $6.000.000" },
      { tipo: "Hospitalización general",     rango: "$2.500.000 – $4.500.000" },
      { tipo: "Salas de cirugía",            rango: "$3.000.000 – $5.500.000" },
      { tipo: "Salud pública / PAB",         rango: "$2.200.000 – $3.800.000" },
      { tipo: "Atención domiciliaria",       rango: "$2.800.000 – $4.500.000" },
    ],
    factoresSalario: "Los turnos rotativos con nocturnidad incrementan el salario total mensual hasta un 40%. Los especialistas en enfermería con posgrado (UCI, anestesia, pediatría) tienen una remuneración significativamente mayor. Los contratos de planta incluyen todas las prestaciones sociales.",
    textoseo: "Colombia tiene déficit de profesionales de enfermería en hospitales y clínicas de todo el país. Las ciudades intermedias ofrecen salarios competitivos y mejores posibilidades de ascenso. Los enfermeros con especialización en UCI, neonatología o anestesia tienen acceso a los salarios más altos del sector.",
  },

  "psicologia": {
    nombre: "Psicología",
    slug: "psicologia",
    intro: "La psicología en Colombia se ejerce en hospitales, clínicas, centros de atención en salud mental, empresas, colegios y consultorios privados. La demanda crece por mayor conciencia en salud mental y por programas del Estado.",
    rangos: [
      { nivel: "Recién graduado (0–2 años)", min: "2.000.000", max: "3.000.000" },
      { nivel: "Con experiencia (3–7 años)", min: "3.000.000", max: "4.500.000" },
      { nivel: "Senior (8+ años)",           min: "4.000.000", max: "7.000.000" },
    ],
    porCiudad: [
      { ciudad: "Bogotá",         min: "2.500.000", max: "6.500.000" },
      { ciudad: "Medellín",       min: "2.300.000", max: "6.000.000" },
      { ciudad: "Cali",           min: "2.000.000", max: "5.500.000" },
      { ciudad: "Barranquilla",   min: "1.900.000", max: "5.000.000" },
      { ciudad: "Otras ciudades", min: "1.700.000", max: "4.500.000" },
    ],
    porInstitucion: [
      { tipo: "Hospital psiquiátrico",        rango: "$2.500.000 – $4.500.000" },
      { tipo: "Clínica general (salud mental)", rango: "$2.200.000 – $4.000.000" },
      { tipo: "EPS / EAPB",                   rango: "$2.000.000 – $3.500.000" },
      { tipo: "Empresa (salud ocupacional)",  rango: "$2.800.000 – $5.000.000" },
      { tipo: "Consultorio privado",          rango: "$1.500.000 – $8.000.000" },
    ],
    factoresSalario: "El contexto de aplicación (clínica, laboral, forense, educativa) afecta significativamente el salario. Las especializaciones en neuropsicología, psicología clínica y psicología organizacional son las mejor remuneradas. La consulta privada puede generar ingresos variables pero más altos a largo plazo.",
    textoseo: "La salud mental en Colombia es una prioridad creciente del sistema de salud. Los psicólogos son demandados en hospitales, EPS, empresas y colegios. Bogotá y Medellín concentran la mayor demanda, pero ciudades intermedias también buscan psicólogos para programas de atención primaria en salud mental.",
  },

  "odontologia": {
    nombre: "Odontología",
    slug: "odontologia",
    intro: "Los odontólogos en Colombia trabajan en IPS, clínicas privadas, EPS, ejército, hospitales y consultorios propios. Los especialistas en ortodoncia, endodoncia, cirugía oral e implantología tienen los salarios más altos del sector dental.",
    rangos: [
      { nivel: "Recién graduado (0–2 años)", min: "2.500.000", max: "4.000.000" },
      { nivel: "Con experiencia (3–7 años)", min: "4.000.000", max: "7.000.000" },
      { nivel: "Especialista",               min: "6.000.000", max: "15.000.000" },
    ],
    porCiudad: [
      { ciudad: "Bogotá",         min: "3.000.000", max: "14.000.000" },
      { ciudad: "Medellín",       min: "2.800.000", max: "12.000.000" },
      { ciudad: "Cali",           min: "2.500.000", max: "10.000.000" },
      { ciudad: "Barranquilla",   min: "2.300.000", max: "9.000.000"  },
      { ciudad: "Otras ciudades", min: "2.000.000", max: "7.000.000"  },
    ],
    porInstitucion: [
      { tipo: "EPS (odontología general)",  rango: "$2.500.000 – $4.500.000" },
      { tipo: "Clínica de especialidades",  rango: "$4.000.000 – $12.000.000" },
      { tipo: "Hospital universitario",     rango: "$3.000.000 – $6.000.000"  },
      { tipo: "Clínica estética dental",    rango: "$5.000.000 – $15.000.000" },
      { tipo: "Consultorio propio",         rango: "Variable por producción"  },
    ],
    factoresSalario: "La especialización en ortodoncia, implantología o cirugía maxilofacial puede multiplicar hasta 4 veces el salario de un odontólogo general. Los contratos suelen ser por producción (porcentaje del trabajo realizado), lo que implica variabilidad mensual. Las ciudades principales tienen mayor volumen de pacientes y mejores posibilidades de especialización.",
    textoseo: "Colombia tiene una demanda activa de odontólogos tanto generales como especialistas. Las EPS emplean odontólogos en jornadas fijas, mientras que las clínicas privadas y estéticas ofrecen contratos por producción con mayor potencial de ingresos. La especialización es la mejor inversión para incrementar el salario en este campo.",
  },

  "fisioterapia": {
    nombre: "Fisioterapia",
    slug: "fisioterapia",
    intro: "Los fisioterapeutas en Colombia trabajan en hospitales, clínicas de rehabilitación, centros deportivos, empresas, hogares geriátricos y consultorios privados. La demanda creció significativamente tras la pandemia de COVID-19 por la rehabilitación respiratoria y motora.",
    rangos: [
      { nivel: "Recién graduado (0–2 años)", min: "2.200.000", max: "3.200.000" },
      { nivel: "Con experiencia (3–7 años)", min: "3.200.000", max: "4.800.000" },
      { nivel: "Senior (8+ años)",           min: "4.500.000", max: "7.000.000" },
    ],
    porCiudad: [
      { ciudad: "Bogotá",         min: "2.500.000", max: "6.500.000" },
      { ciudad: "Medellín",       min: "2.400.000", max: "6.000.000" },
      { ciudad: "Cali",           min: "2.200.000", max: "5.500.000" },
      { ciudad: "Barranquilla",   min: "2.000.000", max: "5.000.000" },
      { ciudad: "Otras ciudades", min: "1.900.000", max: "4.500.000" },
    ],
    porInstitucion: [
      { tipo: "Hospital (rehabilitación)",  rango: "$2.500.000 – $4.500.000" },
      { tipo: "Clínica de rehabilitación",  rango: "$2.800.000 – $5.000.000" },
      { tipo: "Centro deportivo / liga",    rango: "$3.000.000 – $6.000.000" },
      { tipo: "IPS domiciliaria",           rango: "$2.500.000 – $4.500.000" },
      { tipo: "Empresa (salud ocupacional)",rango: "$3.000.000 – $5.500.000" },
    ],
    factoresSalario: "La especialización en fisioterapia deportiva, neurológica o cardiorrespiratoria incrementa el salario hasta en un 60%. Los centros deportivos de clubes profesionales y la atención a deportistas de alto rendimiento son los empleos mejor remunerados. La consulta privada o domiciliaria puede generar ingresos más altos pero con mayor variabilidad.",
    textoseo: "Los fisioterapeutas son demandados en hospitales, clínicas de rehabilitación, equipos deportivos y hogares geriátricos en todo Colombia. La especialización en áreas como fisioterapia neurológica, cardiorrespiratoria o deportiva abre puertas a empleos con mejores salarios. MedApply actualiza diariamente las vacantes para fisioterapeutas en todo el país.",
  },
};
