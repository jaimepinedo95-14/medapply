/**
 * Departamento de cada municipio de Colombia — fuente: división político-
 * administrativa DIVIPOLA/DANE. Los nombres de municipio coinciden exactamente
 * con los de MUNICIPIOS_COLOMBIA (municipios.js), incluyendo los sufijos de
 * desambiguación entre paréntesis para nombres duplicados.
 *
 * Para municipios poco conocidos, verifica contra una fuente oficial (DANE)
 * si el dato es crítico — esta lista se construyó con conocimiento general de
 * la geografía administrativa de Colombia, no se extrajo de un dataset oficial
 * descargado.
 */

export const MUNICIPIOS_POR_DEPARTAMENTO = {
  "Amazonas": [
    "Leticia", "Puerto Nariño",
  ],
  "Antioquia": [
    "Abejorral", "Abriaquí", "Alejandría", "Amagá", "Amalfi", "Andes", "Angelópolis",
    "Angostura", "Anorí", "Anzá", "Apartadó", "Arboletes", "Argelia (Antioquia)", "Chigorodó",
    "Armenia (Antioquia)", "Barbosa (Antioquia)", "Bello", "Betania", "Betulia (Antioquia)",
    "Briceño (Antioquia)", "Buriticá", "Cáceres", "Caicedo", "Caldas (Antioquia)",
    "Campamento", "Cañasgordas", "Caracolí", "Caramanta", "Carepa", "Carmen de Viboral",
    "Caucasia", "Cisneros", "Cocorná", "Concepción (Antioquia)", "Concordia (Antioquia)",
    "Copacabana", "Dabeiba", "Don Matías", "Ebéjico", "El Bagre",
    "El Peñol (Antioquia)", "Entrerríos", "Envigado", "Fredonia",
    "Frontino", "Giraldo", "Girardota", "Gómez Plata", "Granada (Antioquia)", "Guadalupe (Antioquia)",
    "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín",
    "Jericó (Antioquia)", "La Ceja", "La Estrella", "La Pintada", "La Unión (Antioquia)",
    "Liborina", "Maceo", "Marinilla", "Medellín", "Montebello", "Murindó", "Mutatá",
    "Nariño (Antioquia)", "Nechí", "Necoclí", "Olaya", "Peque", "Pueblorrico",
    "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Remedios", "El Retiro", "Rionegro (Antioquia)",
    "Sabanalarga (Antioquia)", "Sabaneta", "Salgar", "San Andrés de Cuerquia",
    "San Carlos (Antioquia)", "San Francisco (Antioquia)", "San Jerónimo", "San José de la Montaña",
    "San Juan de Urabá", "San Luis (Antioquia)", "San Pedro de los Milagros", "San Pedro de Urabá",
    "San Rafael", "San Roque", "San Vicente Ferrer", "Santa Bárbara (Antioquia)",
    "Santa Rosa de Osos", "Santo Domingo", "Santuario (Antioquia)", "Segovia", "Sonsón",
    "Sopetrán", "Tarazá", "Tarso", "Titiribí", "Toledo (Antioquia)", "Turbo",
    "Uramita", "Urrao", "Valdivia", "Valparaíso (Antioquia)", "Vegachí", "Venecia (Antioquia)",
    "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", "Yondó", "Zaragoza",
  ],
  "Arauca": [
    "Arauca", "Arauquita", "Cravo Norte", "Fortul", "Puerto Rondón", "Saravena", "Tame",
  ],
  "Atlántico": [
    "Baranoa", "Barranquilla", "Campo de la Cruz", "Candelaria (Atlántico)", "Galapa",
    "Juan de Acosta", "Luruaco", "Malambo", "Manatí", "Palmar de Varela", "Piojó",
    "Polonuevo", "Ponedera", "Puerto Colombia", "Repelón", "Sabanagrande", "Sabanalarga (Atlántico)",
    "Santa Lucía", "Santo Tomás", "Soledad", "Suan", "Tubará", "Usiacurí",
  ],
  "Bolívar": [
    "Achí", "Altos del Rosario", "Arenal", "Arjona", "Arroyohondo", "Barranco de Loba",
    "Calamar (Bolívar)", "Cantagallo", "Cartagena", "Cicuco", "Clemencia", "Córdoba (Bolívar)",
    "El Carmen de Bolívar", "El Guamo", "El Peñón (Bolívar)", "Hatillo de Loba", "Magangué",
    "Mahates", "Margarita", "María la Baja", "Mompós", "Montecristo", "Morales (Bolívar)",
    "Norosí", "Pinillos", "Regidor", "Río Viejo", "San Cristóbal", "San Estanislao",
    "San Fernando", "San Jacinto", "San Jacinto del Cauca", "San Juan Nepomuceno",
    "San Martín de Loba", "San Pablo (Bolívar)", "Santa Catalina", "Santa Rosa (Bolívar)",
    "Santa Rosa del Sur", "Simití", "Soplaviento", "Talaigua Nuevo", "Tiquisio",
    "Turbaco", "Turbaná", "Villanueva (Bolívar)", "Zambrano",
  ],
  "Boyacá": [
    "Almeida", "Aquitania", "Arcabuco", "Belén (Boyacá)", "Berbeo", "Betéitiva", "Boavita",
    "Boyacá", "Briceño (Boyacá)", "Buenavista (Boyacá)", "Busbanzá", "Caldas (Boyacá)",
    "Campohermoso", "Cerinza", "Chinavita", "Chiquinquirá", "Chiscas", "Chita", "Chitaraque",
    "Chivatá", "Chíquiza", "Chivor", "Cómbita", "Corrales", "Covarachía", "Cubará",
    "Cucaita", "Cuítiva", "Duitama", "El Cocuy", "El Espino", "Firavitoba", "Floresta",
    "Gachantivá", "Gameza", "Garagoa", "Guacamayas", "Guateque", "Guayatá", "Güicán de la Sierra",
    "Coper", "Villa de Leyva",
    "Iza", "Jenesano", "Jericó (Boyacá)", "Labranzagrande", "La Capilla", "La Uvita",
    "La Victoria (Boyacá)", "Macanal", "Maripí", "Miraflores (Boyacá)", "Mongua", "Mongüí",
    "Moniquirá", "Motavita", "Muzo", "Nobsa", "Nuevo Colón", "Oicatá", "Otanche", "Pachavita",
    "Paipa", "Pajarito", "Panqueba", "Pauna", "Paya", "Paz de Río", "Pesca",
    "Pisba", "Puerto Boyacá", "Quípama", "Ramiriquí", "Ráquira", "Rondón",
    "Saboyá", "Sáchica", "Samacá", "San Eduardo", "San José de Pare", "San Luis de Gaceno",
    "San Mateo", "San Miguel de Sema", "San Pablo de Borbur", "Santa María (Boyacá)",
    "Santa Rosa de Viterbo", "Santa Sofía", "Santana", "Sativanorte", "Sativasur",
    "Siachoque", "Soatá", "Socotá", "Socha", "Sogamoso", "Somondoco", "Sora", "Soracá",
    "Sotaquirá", "Susacón", "Sutamarchán", "Sutatenza", "Tasco", "Tenza", "Tibaná",
    "Tibasosa", "Tinjacá", "Tipacoque", "Toca", "Togüí", "Tópaga", "Tota", "Tunja",
    "Turmequé", "Tuta", "Tutazá", "Úmbita", "Ventaquemada", "Viracachá", "Zetaquira",
  ],
  "Caldas": [
    "Aguadas", "Anserma", "Aranzazu", "Belalcázar", "Chinchiná", "Filadelfia", "La Dorada",
    "La Merced", "Manizales", "Manzanares", "Marmato", "Marquetalia", "Marulanda",
    "Neira", "Norcasia", "Pácora", "Palestina (Caldas)", "Pensilvania", "Riosucio (Caldas)",
    "Risaralda", "Salamina (Caldas)", "Samaná", "San José (Caldas)", "Supía", "Victoria",
    "Villamaría", "Viterbo",
  ],
  "Caquetá": [
    "Albania (Caquetá)", "Belén de los Andaquíes", "Cartagena del Chairá", "Curillo",
    "El Doncello", "El Paujil", "Florencia", "La Montañita",
    "Milán", "Morelia", "Puerto Rico (Caquetá)", "San José del Fragua",
    "San Vicente del Caguán", "Solano", "Solita", "Valparaíso (Caquetá)",
  ],
  "Casanare": [
    "Aguazul", "Chameza", "Hato Corozal", "La Salina", "Maní", "Monterrey", "Nunchía",
    "Orocué", "Paz de Ariporo", "Pore", "Recetor", "Sabanalarga (Casanare)", "Sácama",
    "San Luis de Palenque", "Támara", "Tauramena", "Trinidad", "Villanueva (Casanare)",
    "Yopal",
  ],
  "Cauca": [
    "Almaguer", "Argelia (Cauca)", "Balboa (Cauca)", "Bolívar (Cauca)", "Buenos Aires",
    "Cajibío", "Caldono", "Caloto", "Corinto", "El Tambo (Cauca)", "Florencia (Cauca)",
    "Guapi", "Inzá", "Jambaló", "La Sierra", "La Vega (Cauca)", "López de Micay",
    "Mercaderes", "Miranda", "Morales (Cauca)", "Padilla", "Páez", "Patía", "Piamonte",
    "Piendamó", "Popayán", "Puerto Tejada", "Puracé", "Rosas", "San Sebastián",
    "Santa Rosa (Cauca)", "Santander de Quilichao", "Silvia", "Sotara", "Suárez (Cauca)",
    "Sucre (Cauca)", "Timbío", "Timbiquí", "Toribío", "Totoró", "Villa Rica",
  ],
  "Cesar": [
    "Aguachica", "Agustín Codazzi", "Astrea", "Becerril", "Bosconia", "Chimichagua",
    "Chiriguaná", "Curumaní", "El Copey", "El Paso", "Gamarra", "González", "La Gloria",
    "La Jagua de Ibirico", "Manaure Balcón del Cesar", "Pailitas", "Pelaya", "Pueblo Bello",
    "Río de Oro", "La Paz (Cesar)", "San Alberto", "San Diego", "San Martín (Cesar)",
    "Tamalameque", "Valledupar",
  ],
  "Chocó": [
    "Acandí", "Alto Baudó", "Atrato", "Bagadó", "Bahía Solano", "Bajo Baudó",
    "Bojayá", "Carmen del Darién", "Cértegui", "Condoto", "El Cantón de San Pablo",
    "El Carmen de Atrato", "El Litoral del San Juan", "Istmina", "Juradó", "Lloró",
    "Medio Atrato", "Medio Baudó", "Medio San Juan", "Nóvita", "Nuquí", "Quibdó",
    "Río Iró", "Río Quito", "Riosucio (Chocó)", "San José del Palmar", "Sipí", "Tadó",
    "Unguía", "Unión Panamericana",
  ],
  "Córdoba": [
    "Ayapel", "Buenavista (Córdoba)", "Canalete", "Cereté", "Chimá", "Chinú", "Ciénaga de Oro",
    "Cotorra", "La Apartada", "Lorica", "Los Córdobas", "Momil", "Montelíbano", "Montería",
    "Moñitos", "Planeta Rica", "Pueblo Nuevo", "Puerto Escondido", "Puerto Libertador",
    "Purísima", "Sahagún", "San Andrés de Sotavento", "San Antero", "San Bernardo del Viento",
    "San Carlos (Córdoba)", "San José de Uré", "San Pelayo", "Tierralta", "Tuchín", "Valencia",
  ],
  "Cundinamarca": [
    "Agua de Dios", "Albán (Cundinamarca)", "Anapoima", "Anolaima", "Apulo", "Arbeláez",
    "Beltrán", "Bituima", "Bojacá", "Cabrera (Cundinamarca)", "Cachipay", "Cajicá",
    "Caparrapí", "Cáqueza", "Carmen de Carupa", "Chaguaní", "Chía", "Chipaque", "Choachí",
    "Fomeque",
    "Chocontá", "Cogua", "Cota", "Cucunubá", "El Colegio", "El Peñón (Cundinamarca)",
    "El Rosal", "Facatativá", "Fosca", "Funza", "Fúquene", "Fusagasugá", "Gachalá",
    "Gachancipá", "Gachetá", "Gama", "Girardot", "Granada (Cundinamarca)", "Guachetá",
    "Guaduas", "Guasca", "Guataquí", "Guatavita", "Guayabal de Síquima", "Guayabetal",
    "Gutiérrez", "Jerusalén", "Junín", "La Calera", "La Mesa", "La Palma", "La Peña",
    "La Vega (Cundinamarca)", "Lenguazaque", "Machetá", "Madrid", "Manta", "Medina",
    "Mosquera (Cundinamarca)", "Nariño (Cundinamarca)", "Nemocón", "Nilo", "Nimaima",
    "Nocaima", "Pacho", "Paime", "Pandi", "Paratebueno", "Pasca", "Puerto Salgar",
    "Pulí", "Quebradanegra", "Quetame", "Quipile", "Ricaurte (Cundinamarca)", "San Antonio del Tequendama",
    "San Bernardo (Cundinamarca)", "San Cayetano (Cundinamarca)", "San Francisco (Cundinamarca)",
    "San Juan de Rioseco", "Sasaima", "Sesquilé", "Sibaté", "Silvania", "Simijaca",
    "Soacha", "Sopó", "Subachoque", "Suesca", "Supatá", "Susa", "Sutatausa", "Tabio",
    "Tausa", "Tena", "Tenjo", "Tibacuy", "Tibirita", "Tocaima", "Tocancipá", "Topaipí",
    "Ubalá", "Ubaque", "Ubaté", "Une", "Útica", "Venecia (Cundinamarca)", "Vergara",
    "Vianí", "Villagómez", "Villapinzón", "Villeta", "Viotá", "Yacopí", "Zipacón",
    "Zipaquirá",
  ],
  "Bogotá D.C.": [
    "Bogotá",
  ],
  "Guainía": [
    "Barranco Minas", "Inírida", "Mapiripana", "Puerto Colombia (Guainía)", "San Felipe",
    "Cacahual", "La Guadalupe", "Pana Pana", "Morichal",
  ],
  "Guaviare": [
    "Calamar (Guaviare)", "El Retorno", "Miraflores (Guaviare)", "San José del Guaviare",
  ],
  "Huila": [
    "Acevedo", "Agrado", "Aipe", "Algeciras", "Altamira", "Baraya", "Campoalegre",
    "Colombia", "Elías", "Garzón", "Gigante", "Guadalupe (Huila)", "Hobo", "Iquira",
    "Isnos", "La Argentina", "La Plata", "Nátaga", "Neiva", "Oporapa", "Paicol",
    "Palermo", "Palestina (Huila)", "Pital", "Pitalito", "Rivera", "Saladoblanco",
    "San Agustín", "Santa María (Huila)", "Suaza", "Tarqui", "Tesalia", "Tello",
    "Teruel", "Timaná", "Villavieja", "Yaguará",
  ],
  "La Guajira": [
    "Albania (La Guajira)", "Barrancas", "Dibulla", "Distracción", "El Molino", "Fonseca",
    "Hatonuevo", "La Jagua del Pilar", "Maicao", "Manaure", "Riohacha", "San Juan del Cesar",
    "Uribia", "Urumita", "Villanueva (La Guajira)",
  ],
  "Magdalena": [
    "Algarrobo", "Aracataca", "Ariguaní", "Cerro de San Antonio", "Chibolo", "Ciénaga", "Ciénega",
    "Concordia (Magdalena)", "El Banco", "El Piñón", "El Retén", "Fundación", "Guamal (Magdalena)",
    "Nueva Granada", "Pedraza", "Pijiño del Carmen", "Pivijay", "Plato", "Puebloviejo",
    "Remolino", "Sabanas de San Ángel", "Salamina (Magdalena)", "San Sebastián de Buenavista",
    "San Zenón", "Santa Ana", "Santa Bárbara de Pinto", "Santa Marta", "Sitionuevo",
    "Tenerife", "Zapayán", "Zona Bananera",
  ],
  "Meta": [
    "Acacías", "Barranca de Upía", "Cabuyaro", "Castilla la Nueva", "Cubarral", "Cumaral",
    "El Calvario", "El Castillo", "El Dorado", "Fuente de Oro", "Granada (Meta)",
    "Guamal (Meta)", "La Macarena", "La Uribe", "Lejanías", "Mapiripán", "Mesetas",
    "Puerto Concordia", "Puerto Gaitán", "Puerto Lleras", "Puerto López", "Puerto Rico (Meta)",
    "Restrepo (Meta)", "San Carlos de Guaroa", "San Juan de Arama", "San Juanito",
    "San Martín (Meta)", "Vista Hermosa", "Villavicencio",
  ],
  "Nariño": [
    "Albán (Nariño)", "Aldana", "Ancuyá", "Arboleda", "Barbacoas", "Belén (Nariño)",
    "Buesaco", "Chachagüí", "Colón (Nariño)", "Consacá", "Contadero", "Córdoba (Nariño)",
    "Cuaspud", "Cumbal", "Cumbitara", "El Charco", "El Peñol (Nariño)", "El Rosario",
    "El Tablón de Gómez", "El Tambo (Nariño)", "Francisco Pizarro", "Funes", "Guachucal",
    "Guaitarilla", "Gualmatán", "Iles", "Imués", "Ipiales", "La Cruz", "La Florida",
    "La Llanada", "La Tola", "La Unión (Nariño)", "Leiva", "Linares", "Los Andes",
    "Magüí Payán", "Mallama", "Mosquera (Nariño)", "Olaya Herrera", "Ospina", "Pasto",
    "Policarpa", "Potosí", "Providencia (Nariño)", "Puerres", "Pupiales", "Ricaurte (Nariño)",
    "Roberto Payán", "Samaniego", "San Bernardo (Nariño)", "San Lorenzo", "San Pablo (Nariño)",
    "San Pedro de Cartago", "Sandoná", "Santa Bárbara (Nariño)", "Santacruz", "Sapuyes",
    "Taminango", "Tangua", "Tumaco", "Túquerres", "Yacuanquer",
  ],
  "Norte de Santander": [
    "Ábrego", "Arboledas", "Bochalema", "Bucarasica", "Cáchira", "Cácota", "Chinácota",
    "Chitagá", "Convención", "Cucutilla", "Durania", "El Carmen (Norte de Santander)",
    "El Tarra", "El Zulia", "Gramalote", "Hacarí", "Herrán", "Labateca", "La Esperanza",
    "La Playa de Belén", "Los Patios", "Lourdes", "Mutiscua", "Ocaña", "Pamplona",
    "Pamplonita", "Puerto Santander", "Ragonvalia", "Salazar", "San Calixto",
    "San Cayetano (Norte de Santander)", "Santiago (Norte de Santander)", "Sardinata",
    "Silos", "Teorama", "Tibú", "Toledo (Norte de Santander)", "Villa Caro",
    "Villa del Rosario",
  ],
  "Putumayo": [
    "Colón (Putumayo)", "Mocoa", "Orito", "Puerto Asís", "Puerto Caicedo", "Puerto Guzmán",
    "Puerto Leguízamo", "San Francisco (Putumayo)", "San Miguel (Putumayo)", "Santiago (Putumayo)",
    "Sibundoy", "Valle del Guamuez", "Villagarzón",
  ],
  "Quindío": [
    "Armenia (Quindío)", "Buenavista (Quindío)", "Calarcá", "Circasia", "Córdoba (Quindío)",
    "Filandia", "Génova", "La Tebaida", "Montenegro", "Pijao", "Quimbaya", "Salento",
  ],
  "Risaralda": [
    "Apía", "Balboa (Risaralda)", "Belén de Umbría", "Dosquebradas", "Guática",
    "La Celia", "La Virginia", "Marsella", "Mistrató", "Pereira", "Pueblo Rico",
    "Quinchía", "Santa Rosa de Cabal", "Santuario (Risaralda)",
  ],
  "San Andrés y Providencia": [
    "Providencia (San Andrés)", "San Andrés (San Andrés y Providencia)",
  ],
  "Santander": [
    "Aguada", "Albania (Santander)", "Barbosa (Santander)", "Barichara", "Barrancabermeja",
    "Betulia (Santander)", "Bolívar (Santander)", "Bucaramanga", "Cabrera (Santander)",
    "California", "Capitanejo", "Carcasí", "Cepitá", "Cerrito", "Charalá", "Charta",
    "Chima (Santander)", "Chipatá", "Cimitarra", "Concepción (Santander)", "Confines",
    "Contratación", "Coromoro", "Curití", "El Carmen de Chucurí", "El Guacamayo",
    "El Peñón (Santander)", "El Playón", "Encino", "Enciso", "Floridablanca", "Gálan", "Florián",
    "Gambita", "Girón", "Guaca", "Guadalupe (Santander)", "Guapotá", "Guavatá",
    "Güepsa", "Hato", "Jesús María", "Jordán", "La Belleza", "La Paz (Santander)",
    "Landázuri", "Lebrija", "Los Santos", "Macaravita", "Málaga", "Matanza", "Mogotes",
    "Molagavita", "Ocamonte", "Oiba", "Onzaga", "Palmar", "Palmas del Socorro",
    "Páramo", "Piedecuesta", "Pinchote", "Puente Nacional", "Puerto Parra", "Puerto Wilches",
    "Rionegro (Santander)", "Sabana de Torres", "San Andrés (Santander)", "San Benito",
    "San Gil", "San Joaquín", "San José de Miranda", "San Miguel (Santander)",
    "San Vicente de Chucurí", "Santa Bárbara (Santander)", "Santa Helena del Opón",
    "Simacota", "Socorro", "Suaita", "Sucre (Santander)", "Suratá", "Tona", "Valle de San José",
    "Vélez", "Vetas", "Villanueva (Santander)", "Zapatoca",
  ],
  "Sucre": [
    "Buenavista (Sucre)", "Caimito", "Chalán", "Colosó", "Corozal", "Coveñas", "El Roble",
    "Galeras", "Guaranda", "La Unión (Sucre)", "Los Palmitos", "Majagual", "Morroa",
    "Ovejas", "Palmito", "Sampués", "San Benito Abad", "San Juan de Betulia",
    "San Marcos", "San Onofre", "San Pedro (Sucre)", "Sincelejo",
    "Sucre (Sucre)", "Tolú", "Toluviejo",
  ],
  "Tolima": [
    "Alpujarra", "Alvarado", "Ambalema", "Anzoátegui", "Armero-Guayabal", "Ataco", "Mariquita",
    "Cajamarca", "Carmen de Apicalá", "Casabianca", "Chaparral", "Coello", "Coyaima",
    "Cunday", "Dolores", "Espinal", "Falan", "Flandes", "Fresno", "Guamo", "Herveo",
    "Honda", "Ibagué", "Icononzo", "Lérida", "Líbano", "Melgar", "Murillo", "Natagaima",
    "Ortega", "Palocabildo", "Piedras", "Planadas", "Prado", "Purificación", "Rioblanco",
    "Roncesvalles", "Rovira", "Saldaña", "San Antonio", "San Luis (Tolima)", "Santa Isabel",
    "Suárez (Tolima)", "Valle de San Juan", "Venadillo", "Villahermosa", "Villarrica",
  ],
  "Valle del Cauca": [
    "Alcalá", "Andalucía", "Ansermanuevo", "Argelia (Valle del Cauca)", "Bolívar (Valle del Cauca)",
    "Buenaventura", "Bugalagrande", "Caicedonia", "Cali", "Calima", "Candelaria (Valle del Cauca)",
    "Guadalajara de Buga",
    "Cartago", "Dagua", "El Águila", "El Cairo", "El Cerrito", "El Dovio", "Florida",
    "Ginebra", "Guacarí", "Jamundí", "La Cumbre", "La Unión (Valle del Cauca)",
    "La Victoria (Valle del Cauca)", "Obando", "Palmira", "Pradera", "Restrepo (Valle del Cauca)",
    "Riofrío", "Roldanillo", "San Pedro (Valle del Cauca)", "Sevilla", "Toro", "Trujillo",
    "Tuluá", "Ulloa", "Versalles", "Vijes", "Yotoco", "Yumbo", "Zarzal",
  ],
  "Vaupés": [
    "Carurú", "Mitú", "Pacoa", "Papunaua", "Taraira", "Yavaraté",
  ],
  "Vichada": [
    "Cumaribo", "La Primavera", "Puerto Carreño", "Santa Rosalía",
  ],
};

// Mapa inverso: nombre de municipio (exactamente como en MUNICIPIOS_COLOMBIA) → departamento
export const DEPARTAMENTO_POR_MUNICIPIO = Object.fromEntries(
  Object.entries(MUNICIPIOS_POR_DEPARTAMENTO).flatMap(([depto, municipios]) =>
    municipios.map((m) => [m, depto])
  )
);

/** Devuelve "Ciudad, Departamento" o solo "Ciudad" si no se encontró el departamento */
export function formatoCiudadDepartamento(ciudad) {
  const depto = DEPARTAMENTO_POR_MUNICIPIO[ciudad];
  return depto ? `${ciudad}, ${depto}` : ciudad;
}
