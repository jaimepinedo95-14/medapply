// Página "Acerca de MedApply" con misión, valores y formulario de contacto
import { useState } from "react";
import { useStats } from "../hooks/useStats";

const VALORES = [
  {
    icono: "🤝",
    titulo: "Conexión",
    descripcion: "Construimos puentes entre profesionales de la salud y las instituciones que los necesitan, facilitando encuentros que transforman vidas.",
  },
  {
    icono: "🔍",
    titulo: "Transparencia",
    descripcion: "Información clara sobre ofertas, salarios y condiciones laborales. Sin letra pequeña ni procesos opacos.",
  },
  {
    icono: "🛡",
    titulo: "Privacidad",
    descripcion: "Los datos de nuestros usuarios se tratan con el más alto nivel de protección, conforme a la Ley 1581 de 2012.",
  },
  {
    icono: "⚡",
    titulo: "Agilidad",
    descripcion: "Tecnología diseñada para que contratar o encontrar empleo en el sector salud sea rápido y sencillo.",
  },
  {
    icono: "🏥",
    titulo: "Especialización",
    descripcion: "Nos enfocamos exclusivamente en el sector salud de Colombia. No somos una plataforma de empleo genérica — somos su plataforma.",
  },
  {
    icono: "🌎",
    titulo: "Impacto social",
    descripcion: "Cada conexión que facilitamos contribuye a mejorar la atención médica de millones de colombianos.",
  },
];

const EQUIPO = [
  { nombre: "Laura González", cargo: "CEO & Co-fundadora", iniciales: "LG" },
  { nombre: "Andrés Morales", cargo: "CTO & Co-fundador", iniciales: "AM" },
  { nombre: "Valeria Ríos", cargo: "Head of Growth", iniciales: "VR" },
  { nombre: "Camilo Torres", cargo: "Product Manager", iniciales: "CT" },
];

export default function Nosotros() {
  const stats = useStats();
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const validar = () => {
    const e = {};
    if (!form.nombre.trim())       e.nombre  = "Escribe tu nombre completo.";
    if (!form.email.trim())        e.email   = "Escribe tu correo electrónico.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Correo no válido.";
    if (!form.mensaje.trim())      e.mensaje = "Escribe tu mensaje.";
    else if (form.mensaje.length < 20) e.mensaje = "El mensaje debe tener al menos 20 caracteres.";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length > 0) { setErrores(e2); return; }
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      setForm({ nombre: "", email: "", mensaje: "" });
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-azul-marino text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-esmeralda-claro font-semibold uppercase tracking-widest text-sm mb-3">Acerca de nosotros</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-5">
            Conectando el talento de salud<br className="hidden sm:block" /> con Colombia
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            MedApply nació con una misión clara: hacer que encontrar trabajo en el sector salud colombiano sea tan sencillo y digno como la labor que realizan sus profesionales.
          </p>
        </div>
      </section>

      {/* Misión */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div>
              <span className="text-esmeralda font-semibold uppercase tracking-widest text-sm">Nuestra misión</span>
              <h2 className="text-2xl font-bold text-azul-marino mt-2 mb-4">
                Transformar la forma en que Colombia contrata y busca empleo en salud
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En Colombia, el sector salud emplea a más de 800.000 profesionales entre médicos, enfermeros, auxiliares, técnicos y personal administrativo. Sin embargo, encontrar empleo en este sector sigue siendo un proceso fragmentado, opaco y lleno de barreras.
              </p>
              <p className="text-gray-600 leading-relaxed">
                MedApply existe para cambiar eso. Somos una plataforma especializada que conecta directamente a profesionales de la salud con las instituciones que más los necesitan — con transparencia, eficiencia y respeto por ambas partes.
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { numero: stats.candidatos.toLocaleString("es-CO"), label: "Candidatos registrados", icono: "👩‍⚕️" },
                { numero: stats.empresas.toLocaleString("es-CO"),   label: "Empresas en la plataforma", icono: "🏥" },
                { numero: stats.ofertas.toLocaleString("es-CO"),    label: "Ofertas activas", icono: "📋" },
                { numero: "15",                                      label: "Ciudades de Colombia", icono: "🌎" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                  <div className="text-2xl mb-2">{s.icono}</div>
                  <p className="text-2xl font-bold text-azul-marino">{s.numero}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-esmeralda font-semibold uppercase tracking-widest text-sm">Lo que nos guía</span>
            <h2 className="text-2xl font-bold text-azul-marino mt-2">Nuestros valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {VALORES.map((v) => (
              <div key={v.titulo} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-3xl mb-3">{v.icono}</div>
                <h3 className="font-bold text-azul-marino mb-2">{v.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-esmeralda font-semibold uppercase tracking-widest text-sm">Nuestra historia</span>
          <h2 className="text-2xl font-bold text-azul-marino mt-2 mb-5">Nacimos en Colombia, para Colombia</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            MedApply fue fundada en 2026 por un equipo de profesionales con experiencia en tecnología y en el sector salud colombiano. Vimos de primera mano cómo médicos, enfermeras y auxiliares perdían semanas enviando hojas de vida por correo a instituciones que tardaban meses en responder.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Decidimos construir la plataforma que ese proceso merecía: moderna, especializada y pensada tanto para quien busca empleo como para quien necesita contratar. Hoy, MedApply es la plataforma de empleo de referencia para el sector salud en Colombia.
          </p>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-azul-marino">El equipo detrás de MedApply</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EQUIPO.map((p) => (
              <div key={p.nombre} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <div className="w-12 h-12 bg-azul-marino rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3">
                  {p.iniciales}
                </div>
                <p className="font-semibold text-azul-marino text-sm">{p.nombre}</p>
                <p className="text-gray-400 text-xs mt-0.5">{p.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section className="py-14 px-4" id="contacto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-esmeralda font-semibold uppercase tracking-widest text-sm">Contáctanos</span>
            <h2 className="text-2xl font-bold text-azul-marino mt-2">¿Tienes alguna pregunta?</h2>
            <p className="text-gray-500 text-sm mt-2">
              Escríbenos y te responderemos en menos de 24 horas hábiles.
            </p>
          </div>

          {enviado ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-azul-marino mb-2">¡Mensaje enviado!</h3>
              <p className="text-gray-500 text-sm">
                Gracias por escribirnos. Te responderemos pronto al correo que nos indicaste.
              </p>
              <button
                onClick={() => setEnviado(false)}
                className="mt-5 text-esmeralda font-semibold text-sm hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-azul-claro ${errores.nombre ? "border-red-400" : "border-gray-200"}`}
                />
                {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-azul-claro ${errores.email ? "border-red-400" : "border-gray-200"}`}
                />
                {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                  Mensaje *
                </label>
                <textarea
                  name="mensaje"
                  rows={5}
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-azul-claro resize-none ${errores.mensaje ? "border-red-400" : "border-gray-200"}`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errores.mensaje ? (
                    <p className="text-red-500 text-xs">{errores.mensaje}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-gray-400 text-xs">{form.mensaje.length} caracteres</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-azul-marino text-white font-semibold py-3 rounded-xl hover:bg-azul-claro transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {enviando ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          )}

          {/* Info adicional de contacto */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="text-xs text-gray-400">Correo general</p>
                <p className="text-sm font-semibold text-azul-marino">hola@medapply.co</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-xs text-gray-400">Datos personales</p>
                <p className="text-sm font-semibold text-azul-marino">privacidad@medapply.co</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
