import { Link } from "react-router-dom";

// Categorías del sector salud con sus íconos en SVG
const CATEGORIAS = [
  {
    nombre: "Médicos",
    descripcion: "General y especialistas",
    icono: "🩺",
    color: "bg-blue-50 hover:bg-blue-100",
    colorTexto: "text-blue-700",
    slug: "medicos",
  },
  {
    nombre: "Enfermería",
    descripcion: "Enfermeros y auxiliares",
    icono: "💉",
    color: "bg-green-50 hover:bg-green-100",
    colorTexto: "text-green-700",
    slug: "enfermeria",
  },
  {
    nombre: "Odontología",
    descripcion: "Odontólogos y asistentes",
    icono: "🦷",
    color: "bg-teal-50 hover:bg-teal-100",
    colorTexto: "text-teal-700",
    slug: "odontologia",
  },
  {
    nombre: "Farmacia",
    descripcion: "Farmacéuticos y auxiliares",
    icono: "💊",
    color: "bg-purple-50 hover:bg-purple-100",
    colorTexto: "text-purple-700",
    slug: "farmacia",
  },
  {
    nombre: "Radiología",
    descripcion: "Tecnólogos y radiólogos",
    icono: "🔬",
    color: "bg-orange-50 hover:bg-orange-100",
    colorTexto: "text-orange-700",
    slug: "radiologia",
  },
  {
    nombre: "Fisioterapia",
    descripcion: "Fisioterapeutas y terapistas",
    icono: "🏃",
    color: "bg-yellow-50 hover:bg-yellow-100",
    colorTexto: "text-yellow-700",
    slug: "fisioterapia",
  },
  {
    nombre: "Administrativo",
    descripcion: "Personal administrativo",
    icono: "📋",
    color: "bg-indigo-50 hover:bg-indigo-100",
    colorTexto: "text-indigo-700",
    slug: "administrativo",
  },
  {
    nombre: "Ambulancias",
    descripcion: "Conductores y camilleros",
    icono: "🚑",
    color: "bg-red-50 hover:bg-red-100",
    colorTexto: "text-red-700",
    slug: "ambulancias",
  },
  {
    nombre: "Laboratorio",
    descripcion: "Bacteriólogos y auxiliares",
    icono: "🧪",
    color: "bg-cyan-50 hover:bg-cyan-100",
    colorTexto: "text-cyan-700",
    slug: "laboratorio",
  },
  {
    nombre: "Ing. Biomédica",
    descripcion: "Ingenieros biomédicos",
    icono: "⚙️",
    color: "bg-slate-50 hover:bg-slate-100",
    colorTexto: "text-slate-700",
    slug: "ingenieria-biomedica",
  },
  {
    nombre: "Psicología",
    descripcion: "Psicólogos clínicos",
    icono: "🧠",
    color: "bg-pink-50 hover:bg-pink-100",
    colorTexto: "text-pink-700",
    slug: "psicologia",
  },
  {
    nombre: "Otros",
    descripcion: "Más categorías de salud",
    icono: "➕",
    color: "bg-gray-50 hover:bg-gray-100",
    colorTexto: "text-gray-700",
    slug: "",
  },
];

export default function Categorias() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado de la sección */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-azul-marino mb-3">
            Explora por categoría
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Encuentra oportunidades en todas las áreas del sector salud
          </p>
        </div>

        {/* Grilla de categorías */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIAS.map((cat) => (
            <Link
              key={cat.slug || "otros"}
              to={`/empleos${cat.slug ? `?categoria=${cat.slug}` : ""}`}
              className={`${cat.color} rounded-xl p-5 flex flex-col items-center text-center transition-all duration-200 cursor-pointer group hover:shadow-md hover:-translate-y-1`}
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {cat.icono}
              </span>
              <h3 className={`font-semibold text-sm ${cat.colorTexto} mb-1`}>
                {cat.nombre}
              </h3>
              <p className="text-xs text-gray-500 leading-tight">
                {cat.descripcion}
              </p>
            </Link>
          ))}
        </div>

        {/* Enlace ver todos */}
        <div className="text-center mt-8">
          <Link
            to="/empleos"
            className="text-esmeralda font-semibold hover:text-esmeralda-hover transition-colors inline-flex items-center gap-2"
          >
            Ver todas las ofertas
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
