// Registro de empresa simplificado — solo nombre, email y contraseña
// NIT, logo, tipo y descripción se completan después en Configuración
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { REGION } from "../config/region";
import { useStats } from "../hooks/useStats";
import BotonesOAuth from "../components/auth/BotonesOAuth";

const BENEFICIOS = [
  { icono: "👥", texto: "Banco de candidatos especializados en el sector salud" },
  { icono: "📋", texto: "Publica ofertas en minutos y llega a miles de profesionales" },
  { icono: "🎯", texto: "Filtra por categoría, ciudad y disponibilidad" },
  { icono: "💳", texto: "Plan gratuito disponible, sin tarjeta de crédito" },
];

export default function RegistroEmpresa() {
  const navigate = useNavigate();
  const { registrarEmpresa } = useAuth();
  const stats = useStats();

  const [form, setForm]             = useState({ nombre: "", email: "", password: "", confirmPassword: "" });
  const [verPwd, setVerPwd]         = useState(false);
  const [verPwdConfirm, setVerPwdConfirm] = useState(false);
  const [acepta, setAcepta]         = useState(false);
  const [errores, setErrores]       = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando]     = useState(false);
  const [exito, setExito]           = useState(false);

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: null });
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 2)
      e.nombre   = "Escribe el nombre de tu empresa.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email    = "Correo electrónico no válido.";
    if (!form.password || form.password.length < 6)
      e.password = "Mínimo 6 caracteres.";
    if (!form.confirmPassword)
      e.confirmPassword = "Confirma tu contraseña.";
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Las contraseñas no coinciden.";
    if (!acepta)
      e.acepta   = "Debes aceptar la política de datos.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }
    setCargando(true);
    setErrorGeneral("");
    try {
      const { user } = await registrarEmpresa(form.nombre.trim(), form.email.trim(), form.password);
      if (user && !user.confirmed_at) {
        setExito(true);
      } else {
        navigate("/empresa/dashboard");
      }
    } catch (err) {
      setErrorGeneral(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Panel izquierdo — solo escritorio */}
      <div className="hidden lg:flex lg:w-5/12 bg-azul-marino text-white flex-col justify-center px-12 py-16">
        <Link to="/" className="flex items-center mb-10">
          <div className="w-10 h-10 bg-esmeralda rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">+</span>
          </div>
          <span className="font-bold text-2xl">
            <span className="text-esmeralda-claro">Med</span><span className="text-white">Apply</span>
          </span>
        </Link>

        <h2 className="text-3xl font-bold leading-snug mb-3">
          Contrata el mejor talento del sector salud
        </h2>
        <p className="text-blue-200 mb-8">
          Únete a las instituciones de salud que ya usan MedApply para encontrar a sus profesionales.
        </p>

        <ul className="space-y-4 mb-10">
          {BENEFICIOS.map((b) => (
            <li key={b.texto} className="flex items-start gap-3">
              <span className="text-2xl leading-none">{b.icono}</span>
              <span className="text-blue-100 text-sm leading-relaxed">{b.texto}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-3 gap-3">
          {[
            { num: stats.candidatos.toLocaleString("es-CO"), label: "Candidatos activos" },
            { num: stats.ofertas.toLocaleString("es-CO"),    label: "Ofertas publicadas" },
            { num: stats.empresas.toLocaleString("es-CO"),   label: "Empresas" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{s.num}</p>
              <p className="text-blue-300 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gray-50">

        {/* Logo solo en móvil */}
        <Link to="/" className="lg:hidden flex items-center mb-8">
          <div className="w-8 h-8 bg-esmeralda rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">+</span>
          </div>
          <span className="font-bold text-xl">
            <span className="text-esmeralda">Med</span><span className="text-azul-marino">Apply</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-azul-marino">Registra tu empresa</h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Empieza en 30 segundos. Completa el perfil de tu empresa después.
            </p>
          </div>

          {exito ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-esmeralda/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-azul-marino mb-2">¡Empresa registrada!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Revisa tu correo en <strong>{form.email}</strong> y confirma tu cuenta para activarla.
              </p>
              <Link to="/login" className="btn-primario inline-block py-2.5 px-6 text-sm">
                Ir al inicio de sesión
              </Link>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-5">

            {errorGeneral && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
                <span className="flex-shrink-0">⚠️</span>{errorGeneral}
              </div>
            )}

            {/* OAuth */}
            <BotonesOAuth />
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-100" />
              <span className="text-xs text-gray-400 font-medium">o regístrate con email</span>
              <hr className="flex-1 border-gray-100" />
            </div>

            {/* Nombre de empresa */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Nombre de la empresa / institución
              </label>
              <input
                name="nombre"
                type="text"
                autoComplete="organization"
                value={form.nombre}
                onChange={cambiar}
                placeholder="Ej: MiEmpresa S.A.S."
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-azul-claro ${errores.nombre ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
            </div>

            {/* Email corporativo */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Correo corporativo
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={cambiar}
                placeholder="rrhh@tuempresa.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-azul-claro ${errores.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={verPwd ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={cambiar}
                  placeholder="Mínimo 6 caracteres"
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-azul-claro ${errores.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setVerPwd(!verPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  {verPwd ? "🙈" : "👁"}
                </button>
              </div>
              {errores.password && <p className="text-red-500 text-xs mt-1">{errores.password}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={verPwdConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={cambiar}
                  placeholder="Repite tu contraseña"
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-azul-claro ${errores.confirmPassword ? "border-red-400 bg-red-50" : form.confirmPassword && form.confirmPassword === form.password ? "border-green-400 bg-green-50" : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setVerPwdConfirm(!verPwdConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  {verPwdConfirm ? "🙈" : "👁"}
                </button>
              </div>
              {errores.confirmPassword
                ? <p className="text-red-500 text-xs mt-1">{errores.confirmPassword}</p>
                : form.confirmPassword && form.confirmPassword === form.password
                  ? <p className="text-green-600 text-xs mt-1">✓ Las contraseñas coinciden</p>
                  : null
              }
            </div>

            {/* Ley 1581 */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => {
                    setAcepta(e.target.checked);
                    if (errores.acepta) setErrores({ ...errores, acepta: null });
                  }}
                  className="mt-0.5 flex-shrink-0 accent-esmeralda"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  Acepto el tratamiento de datos según la{" "}
                  <Link to="/privacidad" target="_blank" className="text-azul-marino underline">
                    Política de Privacidad
                  </Link>{" "}
                  ({REGION.leyPrivacidad}).
                </span>
              </label>
              {errores.acepta && <p className="text-red-500 text-xs mt-1">{errores.acepta}</p>}
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-esmeralda hover:bg-esmeralda-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 text-base"
            >
              {cargando ? "Creando cuenta..." : "Registrar empresa →"}
            </button>
          </form>
          )}

          {/* Qué pasa después */}
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <p className="text-xs text-azul-marino leading-relaxed">
              <span className="font-semibold">Después del registro</span>, completa el perfil de tu empresa: NIT, logo, tipo de institución, ciudad y descripción — todo en la sección <span className="font-semibold">Configuración</span> de tu panel.
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-esmeralda font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿Eres un profesional de la salud?{" "}
            <Link to="/registro/candidato" className="text-azul-marino font-semibold hover:underline">
              Crea tu perfil de candidato
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
