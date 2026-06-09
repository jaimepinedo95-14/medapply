// Landing page de ventas para empresas — /para-empresas
import { useState } from "react";
import { Link } from "react-router-dom";
import { useStats } from "../hooks/useStats";

const BENEFICIOS = [
  { icono: "🎯", titulo: "Solo sector salud",      desc: "Sin perfiles irrelevantes. Todos los candidatos son del sector salud: médicos, enfermeros, técnicos, administrativos y más." },
  { icono: "⚡", titulo: "Publicación instantánea", desc: "Publica una oferta en menos de 5 minutos y empieza a recibir postulaciones el mismo día." },
  { icono: "🔍", titulo: "Filtros especializados",  desc: "Busca por categoría profesional, ciudad, disponibilidad y nivel de experiencia. Sin ruido." },
  { icono: "👥", titulo: "Banco de candidatos",     desc: "Con plan Premium, accede directamente al banco de perfiles activos y contacta candidatos proactivamente." },
  { icono: "✅", titulo: "Candidatos verificados",  desc: "Los perfiles con badge ReTHUS tienen su número de tarjeta profesional verificado con el Ministerio de Salud." },
  { icono: "📊", titulo: "Panel de gestión",        desc: "Gestiona todas tus ofertas, postulaciones y candidatos desde un panel intuitivo y organizado." },
];

const PASOS = [
  { numero: "01", titulo: "Crea tu cuenta gratis", desc: "Solo nombre de empresa, correo y contraseña. Sin formularios largos. En 30 segundos estás dentro.", icono: "🚀" },
  { numero: "02", titulo: "Publica tu primera oferta", desc: "Completa el formulario con el cargo, descripción, requisitos y condiciones. Tu oferta queda visible al instante.", icono: "📋" },
  { numero: "03", titulo: "Recibe y gestiona postulaciones", desc: "Los candidatos se postulan directamente. Revisa perfiles, descarga hojas de vida y agenda entrevistas desde tu panel.", icono: "👥" },
];

const TESTIMONIOS = [
  {
    texto: "Publicamos una oferta para Enfermera Jefe UCI y recibimos 12 postulaciones en las primeras 24 horas. La calidad de los perfiles era muy superior a otras plataformas genéricas.",
    autor: "Director de Talento Humano",
    empresa: "Clínica Las Américas, Medellín",
    avatar: "CLA",
  },
  {
    texto: "El banco de candidatos de MedApply nos ahorra semanas de búsqueda. Podemos filtrar por categoría y ciudad y contactar directamente a los profesionales que buscamos.",
    autor: "Coordinadora de RRHH",
    empresa: "Hospital Universitario San Ignacio, Bogotá",
    avatar: "HUS",
  },
  {
    texto: "Como EPS necesitamos contratar constantemente. El plan Premium nos permite publicar ofertas ilimitadas y buscar proactivamente. El ROI frente a otras plataformas es mucho mejor.",
    autor: "Gerente de Gestión Humana",
    empresa: "Coomeva EPS, Cali",
    avatar: "CEP",
  },
];

const PLANES = [
  {
    nombre: "Gratuito",
    precio: 0,
    color: "border-gray-200",
    badge: null,
    items: ["1 oferta activa al mes", "Ver candidatos postulados", "Panel básico de gestión", "Perfil de empresa público"],
    cta: "Empezar gratis",
    href: "/registro/empresa",
    ctaStyle: "btn-outline w-full text-center py-2.5",
  },
  {
    nombre: "Básico",
    precio: 79900,
    color: "border-azul-claro/40",
    badge: null,
    items: ["Hasta 5 ofertas activas", "Ver candidatos postulados", "Soporte por correo", "Estadísticas básicas"],
    cta: "Elegir Básico",
    href: "/registro/empresa",
    ctaStyle: "bg-azul-marino text-white rounded-xl py-2.5 w-full text-center font-semibold hover:bg-azul-claro transition-colors block",
  },
  {
    nombre: "Premium",
    precio: 159900,
    color: "border-esmeralda ring-2 ring-esmeralda",
    badge: "Más popular",
    items: ["Ofertas ilimitadas", "Banco completo de candidatos", "Contactar candidatos directamente", "Candidatos destacados primero", "Soporte prioritario < 4h", "Estadísticas avanzadas"],
    cta: "Elegir Premium",
    href: "/registro/empresa",
    ctaStyle: "bg-esmeralda text-white rounded-xl py-2.5 w-full text-center font-semibold hover:bg-esmeralda-hover transition-colors block",
  },
];

export default function ParaEmpresas() {
  const stats = useStats();
  const [form, setForm] = useState({ nombre: "", cargo: "", empresa: "", email: "", telefono: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviarDemo = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.empresa) return;
    setEnviando(true);
    setTimeout(() => { setEnviando(false); setEnviado(true); }, 1200);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-azul-marino to-azul-claro text-white pt-16 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-96 h-96 bg-white rounded-full absolute -top-20 -right-20" />
          <div className="w-64 h-64 bg-esmeralda rounded-full absolute bottom-10 -left-10" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="bg-esmeralda/20 text-esmeralda-claro text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 inline-block">
              La plataforma del sector salud
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-5">
              La única bolsa de empleo<br />
              <span className="text-esmeralda-claro">100% del sector salud</span><br />
              en Colombia
            </h1>
            <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Conecta con profesionales de la salud verificados: médicos, enfermeros, bacteriólogos,
              fisioterapeutas y más. Sin perfiles irrelevantes, sin pérdida de tiempo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/registro/empresa" className="bg-esmeralda hover:bg-esmeralda-hover text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg">
                Publicar oferta gratis →
              </Link>
              <a href="#demo" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors">
                Solicitar demo
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-8">
            {[
              { num: stats.candidatos.toLocaleString("es-CO"), label: "Candidatos activos" },
              { num: stats.empresas.toLocaleString("es-CO"),   label: "Empresas confían en nosotros" },
              { num: stats.ofertas.toLocaleString("es-CO"),    label: "Ofertas publicadas" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black">{s.num}</p>
                <p className="text-blue-300 text-xs mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-azul-marino mb-3">
            ¿Cansado de filtrar perfiles irrelevantes?
          </h2>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            Las plataformas genéricas te hacen perder horas revisando hojas de vida de personas que no
            tienen nada que ver con el sector salud. MedApply lo resuelve de raíz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { antes: "Horas filtrando perfiles sin experiencia en salud", despues: "Solo candidatos especializados en el sector salud" },
              { antes: "Postulaciones de personas que no cumplen el perfil", despues: "Postulaciones filtradas por categoría profesional" },
              { antes: "Plataformas genéricas sin contexto médico", despues: "Vocabulario, categorías y filtros del sector salud" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="bg-red-50 rounded-xl p-3">
                    <span className="text-xs text-red-600 font-bold block mb-1">ANTES</span>
                    <p className="text-red-700 text-sm">{item.antes}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <span className="text-xs text-green-600 font-bold block mb-1">CON MEDAPPLY</span>
                    <p className="text-green-700 text-sm font-medium">{item.despues}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-azul-marino">Cómo funciona MedApply para empresas</h2>
            <p className="text-gray-500 mt-2">Tres pasos y ya estás contratando</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PASOS.map((paso) => (
              <div key={paso.numero} className="text-center">
                <div className="w-16 h-16 bg-azul-marino rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                  {paso.icono}
                </div>
                <span className="text-esmeralda font-black text-sm tracking-widest">{paso.numero}</span>
                <h3 className="font-bold text-azul-marino text-lg mt-1 mb-2">{paso.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-azul-marino">¿Por qué elegir MedApply?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-3xl mb-3">{b.icono}</div>
                <h3 className="font-bold text-azul-marino mb-2">{b.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANES ── */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-azul-marino">Planes transparentes, sin contratos</h2>
            <p className="text-gray-500 mt-2">Cancela cuando quieras. Sin permanencia mínima.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANES.map((plan) => (
              <div key={plan.nombre} className={`bg-white rounded-3xl border-2 ${plan.color} p-6 flex flex-col relative`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-esmeralda text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <p className="font-bold text-azul-marino text-lg mb-1">{plan.nombre}</p>
                <div className="mb-4">
                  {plan.precio === 0
                    ? <span className="text-3xl font-black text-azul-marino">Gratis</span>
                    : <><span className="text-3xl font-black text-azul-marino">${plan.precio.toLocaleString("es-CO")}</span><span className="text-gray-400 text-sm">/mes</span></>
                  }
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-esmeralda mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={plan.href} className={plan.ctaStyle}>{plan.cta}</Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-5">
            ¿Necesitas un plan personalizado?{" "}
            <a href="#demo" className="text-azul-marino font-semibold hover:underline">Contáctanos</a>
          </p>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-azul-marino">Lo que dicen nuestras empresas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIOS.map((t) => (
              <div key={t.empresa} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="text-esmeralda text-2xl mb-3">"</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">{t.texto}</p>
                <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                  <div className="w-10 h-10 bg-azul-marino rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-azul-marino text-sm">{t.autor}</p>
                    <p className="text-gray-400 text-xs">{t.empresa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULARIO DE DEMO ── */}
      <section className="py-14 px-4" id="demo">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-azul-marino">Solicitar una demo personalizada</h2>
            <p className="text-gray-500 text-sm mt-2">
              Cuéntanos sobre tu institución y te mostramos cómo MedApply puede ayudarte a contratar más rápido.
            </p>
          </div>

          {enviado ? (
            <div className="bg-green-50 border border-green-100 rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-bold text-azul-marino text-xl mb-2">¡Solicitud enviada!</h3>
              <p className="text-gray-500 text-sm">Nuestro equipo te contactará en menos de 24 horas hábiles al correo que nos indicaste.</p>
            </div>
          ) : (
            <form onSubmit={enviarDemo} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-azul-marino mb-1.5">Tu nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={cambiar} required placeholder="Nombre completo" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-azul-marino mb-1.5">Tu cargo</label>
                  <input name="cargo" value={form.cargo} onChange={cambiar} placeholder="Ej: Director de RRHH" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-azul-marino mb-1.5">Nombre de la institución *</label>
                <input name="empresa" value={form.empresa} onChange={cambiar} required placeholder="Clínica, hospital, IPS, EPS..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-azul-marino mb-1.5">Correo corporativo *</label>
                  <input name="email" type="email" value={form.email} onChange={cambiar} required placeholder="tu@empresa.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-azul-marino mb-1.5">Teléfono</label>
                  <input name="telefono" type="tel" value={form.telefono} onChange={cambiar} placeholder="3XX XXX XXXX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-azul-marino mb-1.5">¿En qué podemos ayudarte?</label>
                <textarea name="mensaje" value={form.mensaje} onChange={cambiar} rows={3} placeholder="Cuéntanos qué cargos necesitas cubrir, cuántas vacantes tienes o cualquier pregunta..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro resize-none" />
              </div>
              <button type="submit" disabled={enviando} className="w-full bg-esmeralda hover:bg-esmeralda-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60">
                {enviando ? "Enviando..." : "Solicitar demo gratuita →"}
              </button>
              <p className="text-center text-xs text-gray-400">O regístrate directamente: <Link to="/registro/empresa" className="text-azul-marino font-semibold hover:underline">Crear cuenta gratis</Link></p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
