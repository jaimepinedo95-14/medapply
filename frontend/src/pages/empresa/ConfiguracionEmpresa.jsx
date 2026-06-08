import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { InputCampo, SelectCampo } from "../../components/common/InputCampo";

const TIPOS_EMPRESA = ["Clínica","Hospital","IPS","EPS","Empresa de ambulancias","Laboratorio clínico","Consultorio médico","Hogar geriátrico","Farmacia / Droguería","Otro"];
const CIUDADES = ["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga","Pereira","Manizales","Santa Marta","Cúcuta","Otra"];

export default function ConfiguracionEmpresa() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("perfil"); // "perfil" | "acceso" | "notificaciones"
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // Datos del perfil de la empresa
  const [perfil, setPerfil] = useState({
    nombre: "Clínica San Rafael",
    nit: "900123456-7",
    tipo: "Clínica",
    ciudad: "Bogotá",
    telefono: "6014567890",
    email: "contacto@clinicasanrafael.com",
    descripcion: "Clínica de tercer nivel con más de 30 años de experiencia en el sector salud de Colombia.",
    sitioWeb: "www.clinicasanrafael.com",
  });

  // Datos de acceso
  const [acceso, setAcceso] = useState({ emailActual: "", emailNuevo: "", passwordActual: "", passwordNuevo: "", confirmarPassword: "" });
  const [erroresAcceso, setErroresAcceso] = useState({});

  // Notificaciones
  const [notis, setNotis] = useState({ nuevosPostulados: true, recordatorioOfertas: true, novedades: false });

  const guardarPerfil = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const guardarAcceso = () => {
    const err = {};
    if (!acceso.passwordActual) err.passwordActual = "Ingresa tu contraseña actual.";
    if (acceso.emailNuevo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(acceso.emailNuevo)) err.emailNuevo = "Correo no válido.";
    if (acceso.passwordNuevo && acceso.passwordNuevo.length < 8) err.passwordNuevo = "Mínimo 8 caracteres.";
    if (acceso.passwordNuevo && acceso.passwordNuevo !== acceso.confirmarPassword) err.confirmarPassword = "Las contraseñas no coinciden.";
    if (Object.keys(err).length) { setErroresAcceso(err); return; }
    setErroresAcceso({});
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const manejarLogout = () => { logout(); navigate("/"); };

  const TABS = [
    { key: "perfil",         label: "Perfil de empresa" },
    { key: "acceso",         label: "Acceso y seguridad" },
    { key: "notificaciones", label: "Notificaciones" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona los datos de tu empresa y las preferencias de la cuenta.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key ? "bg-white text-azul-marino shadow-sm" : "text-gray-500 hover:text-azul-marino"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Alerta de guardado */}
      {guardado && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 text-green-700 text-sm font-semibold">
          ✅ Cambios guardados correctamente.
        </div>
      )}

      {/* ── TAB: Perfil de empresa ── */}
      {tab === "perfil" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {/* Logo de la empresa */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl border border-gray-200">
              🏥
            </div>
            <div>
              <p className="font-semibold text-azul-marino text-sm">Logo de la empresa</p>
              <p className="text-gray-400 text-xs mt-0.5">PNG o JPG · Máximo 2 MB</p>
              <button className="mt-2 text-xs text-esmeralda font-semibold hover:underline">
                Subir logo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputCampo
              label="Nombre de la empresa"
              value={perfil.nombre}
              onChange={(e) => setPerfil(p => ({ ...p, nombre: e.target.value }))}
              placeholder="Nombre de la institución"
              className="md:col-span-2"
            />
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">NIT <span className="text-red-500">*</span></label>
              <input value={perfil.nit} onChange={(e) => setPerfil(p => ({ ...p, nit: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-esmeralda" placeholder="900123456-7" />
            </div>
            <InputCampo label="Teléfono de contacto" value={perfil.telefono} onChange={(e) => setPerfil(p => ({ ...p, telefono: e.target.value }))} />
            <SelectCampo label="Tipo de empresa" value={perfil.tipo} onChange={(e) => setPerfil(p => ({ ...p, tipo: e.target.value }))}>
              {TIPOS_EMPRESA.map(t => <option key={t} value={t}>{t}</option>)}
            </SelectCampo>
            <SelectCampo label="Ciudad" value={perfil.ciudad} onChange={(e) => setPerfil(p => ({ ...p, ciudad: e.target.value }))}>
              {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
            </SelectCampo>
            <InputCampo label="Sitio web" value={perfil.sitioWeb} onChange={(e) => setPerfil(p => ({ ...p, sitioWeb: e.target.value }))} placeholder="www.ejemplo.com" className="md:col-span-2" />
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">Descripción de la empresa</label>
              <textarea value={perfil.descripcion} onChange={(e) => setPerfil(p => ({ ...p, descripcion: e.target.value }))} rows={4}
                placeholder="Cuéntales a los candidatos sobre tu empresa, misión y cultura organizacional..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-esmeralda resize-none" />
            </div>
          </div>
          <button onClick={guardarPerfil} className="btn-secundario mt-5 py-3 px-6 text-sm">
            Guardar cambios del perfil
          </button>
        </div>
      )}

      {/* ── TAB: Acceso y seguridad ── */}
      {tab === "acceso" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-azul-marino mb-5">Cambiar correo o contraseña</h2>
          <div className="space-y-4">
            <InputCampo label="Contraseña actual" name="passwordActual" type="password" value={acceso.passwordActual}
              onChange={(e) => setAcceso(p => ({ ...p, passwordActual: e.target.value }))} error={erroresAcceso.passwordActual} />
            <hr className="border-gray-100" />
            <InputCampo label="Nuevo correo corporativo (opcional)" name="emailNuevo" type="email" value={acceso.emailNuevo}
              onChange={(e) => setAcceso(p => ({ ...p, emailNuevo: e.target.value }))} error={erroresAcceso.emailNuevo} placeholder="nuevo@empresa.com" />
            <InputCampo label="Nueva contraseña (opcional)" name="passwordNuevo" type="password" value={acceso.passwordNuevo}
              onChange={(e) => setAcceso(p => ({ ...p, passwordNuevo: e.target.value }))} error={erroresAcceso.passwordNuevo} placeholder="Mínimo 8 caracteres" />
            <InputCampo label="Confirmar nueva contraseña" name="confirmarPassword" type="password" value={acceso.confirmarPassword}
              onChange={(e) => setAcceso(p => ({ ...p, confirmarPassword: e.target.value }))} error={erroresAcceso.confirmarPassword} placeholder="Repite la contraseña" />
          </div>
          <button onClick={guardarAcceso} className="btn-secundario mt-5 py-3 px-6 text-sm">Guardar cambios</button>
        </div>
      )}

      {/* ── TAB: Notificaciones ── */}
      {tab === "notificaciones" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-azul-marino mb-5">Notificaciones por correo</h2>
          <div className="space-y-4">
            {[
              { key: "nuevosPostulados",    label: "Nuevos candidatos postulados a mis ofertas" },
              { key: "recordatorioOfertas", label: "Recordatorio de ofertas próximas a vencer" },
              { key: "novedades",           label: "Novedades y consejos de MedApply" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">{label}</span>
                <div onClick={() => setNotis(p => ({ ...p, [key]: !p[key] }))}
                  className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${notis[key] ? "bg-esmeralda" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notis[key] ? "translate-x-5" : ""}`} />
                </div>
              </label>
            ))}
          </div>
          <button onClick={guardarPerfil} className="btn-secundario mt-6 py-3 px-6 text-sm">Guardar preferencias</button>
        </div>
      )}

      {/* Zona de peligro */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm mt-5">
        <h2 className="text-lg font-bold text-red-600 mb-2">Zona de riesgo</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={manejarLogout} className="px-5 py-2 text-sm border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50">
            Cerrar sesión
          </button>
          {!confirmarEliminar ? (
            <button onClick={() => setConfirmarEliminar(true)} className="px-5 py-2 text-sm border border-red-300 rounded-xl text-red-600 hover:bg-red-50">
              Eliminar cuenta de empresa
            </button>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-red-600 font-semibold">¿Eliminar cuenta y todas las ofertas?</p>
              <button className="px-4 py-2 text-xs bg-red-600 text-white rounded-xl">Sí, eliminar</button>
              <button onClick={() => setConfirmarEliminar(false)} className="px-4 py-2 text-xs border border-gray-300 rounded-xl">Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
