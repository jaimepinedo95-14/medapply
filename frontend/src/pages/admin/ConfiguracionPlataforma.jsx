// Configuración de la plataforma — solo superadmin
import { useState } from "react";
import { REGION } from "../../config/region";

function SeccionConfig({ titulo, icono, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <span className="text-xl">{icono}</span>
        <h2 className="font-bold text-azul-marino">{titulo}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function CampoConfig({ label, value, onChange, tipo = "text", ayuda }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-azul-marino mb-1.5">{label}</label>
      <input type={tipo} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro" />
      {ayuda && <p className="text-xs text-gray-400 mt-1">{ayuda}</p>}
    </div>
  );
}

export default function ConfiguracionPlataforma() {
  const [guardado, setGuardado] = useState(false);

  // Configuración general
  const [config, setConfig] = useState({
    nombrePlataforma: "MedApply",
    emailSoporte: "hola@medapply.co",
    emailPagos: "pagos@medapply.co",
    emailLegal: "legal@medapply.co",
    sitioWeb: "www.medapply.co",
    descripcion: "La única plataforma de empleo 100% del sector salud en Colombia.",
  });

  // Planes
  const [planes, setPlanes] = useState({
    candidatoDestacado: REGION.planes.candidato.destacado,
    empresaBasico: REGION.planes.empresa.basico,
    empresaPremium: REGION.planes.empresa.premium,
  });

  // Límites
  const [limites, setLimites] = useState({
    ofertasGratuito: 1,
    ofertasBasico: 5,
    videoMaxSegundos: 60,
    cvMaxMB: 5,
    imagenMaxMB: 2,
  });

  // Toggle features
  const [features, setFeatures] = useState({
    registroAbierto: true,
    moderacionOfertas: false,
    emailBienvenida: true,
    rethusVerificacion: true,
    planModerador: true,
  });

  const cambiarConfig = (campo) => (val) => setConfig((p) => ({ ...p, [campo]: val }));
  const cambiarPlan = (campo) => (val) => setPlanes((p) => ({ ...p, [campo]: Number(val) }));
  const cambiarLimite = (campo) => (val) => setLimites((p) => ({ ...p, [campo]: Number(val) }));
  const toggleFeature = (campo) => setFeatures((p) => ({ ...p, [campo]: !p[campo] }));

  const guardar = () => {
    // En producción llama a la API
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Configuración de la plataforma</h1>
          <p className="text-gray-500 text-sm mt-1">Solo el Super Admin tiene acceso a esta sección.</p>
        </div>
        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full">👑 Superadmin</span>
      </div>

      {/* General */}
      <SeccionConfig titulo="Información general" icono="🌐">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoConfig label="Nombre de la plataforma" value={config.nombrePlataforma} onChange={cambiarConfig("nombrePlataforma")} />
          <CampoConfig label="Sitio web" value={config.sitioWeb} onChange={cambiarConfig("sitioWeb")} />
          <CampoConfig label="Email de soporte" value={config.emailSoporte} onChange={cambiarConfig("emailSoporte")} tipo="email" />
          <CampoConfig label="Email de pagos" value={config.emailPagos} onChange={cambiarConfig("emailPagos")} tipo="email" />
          <CampoConfig label="Email legal" value={config.emailLegal} onChange={cambiarConfig("emailLegal")} tipo="email" />
        </div>
        <div className="mt-4">
          <label className="block text-xs font-semibold text-azul-marino mb-1.5">Descripción pública</label>
          <textarea value={config.descripcion} onChange={(e) => cambiarConfig("descripcion")(e.target.value)}
            rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro resize-none" />
        </div>
      </SeccionConfig>

      {/* Precios */}
      <SeccionConfig titulo="Planes y precios" icono="💳">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CampoConfig label="Candidato Destacado (COP/mes)" value={planes.candidatoDestacado}
            onChange={cambiarPlan("candidatoDestacado")} tipo="number"
            ayuda="Actualmente: $9.900 COP" />
          <CampoConfig label="Empresa Básico (COP/mes)" value={planes.empresaBasico}
            onChange={cambiarPlan("empresaBasico")} tipo="number"
            ayuda="Actualmente: $89.900 COP" />
          <CampoConfig label="Empresa Premium (COP/mes)" value={planes.empresaPremium}
            onChange={cambiarPlan("empresaPremium")} tipo="number"
            ayuda="Actualmente: $299.900 COP" />
        </div>
      </SeccionConfig>

      {/* Límites técnicos */}
      <SeccionConfig titulo="Límites y restricciones" icono="⚙️">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <CampoConfig label="Ofertas plan Gratuito" value={limites.ofertasGratuito}
            onChange={cambiarLimite("ofertasGratuito")} tipo="number" />
          <CampoConfig label="Ofertas plan Básico" value={limites.ofertasBasico}
            onChange={cambiarLimite("ofertasBasico")} tipo="number" />
          <CampoConfig label="Video máx. (segundos)" value={limites.videoMaxSegundos}
            onChange={cambiarLimite("videoMaxSegundos")} tipo="number" />
          <CampoConfig label="CV máx. (MB)" value={limites.cvMaxMB}
            onChange={cambiarLimite("cvMaxMB")} tipo="number" />
          <CampoConfig label="Imagen de perfil máx. (MB)" value={limites.imagenMaxMB}
            onChange={cambiarLimite("imagenMaxMB")} tipo="number" />
        </div>
      </SeccionConfig>

      {/* Feature flags */}
      <SeccionConfig titulo="Funcionalidades activas" icono="🔧">
        <div className="space-y-4">
          {[
            { key: "registroAbierto",    label: "Registro abierto al público",         desc: "Si se desactiva, no se pueden crear nuevas cuentas" },
            { key: "moderacionOfertas",  label: "Moderación manual de ofertas",         desc: "Las ofertas nuevas quedan pendientes de aprobación antes de publicarse" },
            { key: "emailBienvenida",    label: "Email de bienvenida automático",        desc: "Envía email al registrarse un candidato o empresa" },
            { key: "rethusVerificacion", label: "Badge de verificación ReTHUS",          desc: "Los candidatos pueden agregar su número de tarjeta profesional" },
            { key: "planModerador",      label: "Panel de moderador activo",             desc: "Los usuarios con rol Moderador pueden acceder a /moderador" },
          ].map((f) => (
            <div key={f.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-azul-marino">{f.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
              </div>
              <button onClick={() => toggleFeature(f.key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${features[f.key] ? "bg-esmeralda" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${features[f.key] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </SeccionConfig>

      {/* Región activa */}
      <SeccionConfig titulo="Configuración regional" icono="🌎">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-azul-marino mb-3">Región activa: <span className="text-esmeralda">{REGION.pais}</span></p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {[
              { label: "Moneda",         val: `${REGION.monedaSimbolo} ${REGION.moneda}` },
              { label: "Locale",         val: REGION.locale },
              { label: "Registro prof.", val: REGION.registroProfesional.nombre },
              { label: "Ley privacidad", val: REGION.leyPrivacidad },
              { label: "Ciudades",       val: `${REGION.ciudades.length} ciudades` },
              { label: "Sal. mínimo",    val: `${REGION.monedaSimbolo}${REGION.salarioMinimo.toLocaleString()}` },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-lg p-2 border border-blue-100">
                <p className="text-gray-400">{item.label}</p>
                <p className="font-semibold text-azul-marino">{item.val}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Para cambiar de país edita <code className="bg-gray-100 px-1 py-0.5 rounded">src/config/region.js</code> y cambia la línea <code className="bg-gray-100 px-1 py-0.5 rounded">export const REGION = REGION_CO;</code>
          </p>
        </div>
      </SeccionConfig>

      {/* Botón guardar */}
      <div className="flex justify-end pb-6">
        <button onClick={guardar}
          className="bg-esmeralda hover:bg-esmeralda-hover text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
          {guardado ? "✅ Guardado" : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}
