// Registro simplificado: solo nombre, email y contraseña
// Los demás datos del perfil se completan después, a ritmo propio
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { REGION } from "../config/region";
import BotonesOAuth from "../components/auth/BotonesOAuth";
import { enviarBienvenidaCandidato } from "../lib/notificacionesEmail";

const SUPERADMIN_EMAIL = "jaimepinedo95@gmail.com";

const BENEFICIOS = [
  { icono: "🔍", texto: "Miles de ofertas en el sector salud de Colombia" },
  { icono: "🏥", texto: "Hospitales, clínicas y EPS verificadas" },
  { icono: "📈", texto: "Tu perfil visible para empresas que buscan activamente" },
  { icono: "⚡", texto: "Postúlate en segundos, sin intermediarios" },
];

export default function RegistroCandidato() {
  const navigate = useNavigate();
  const { registrarCandidato } = useAuth();

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
      e.nombre   = "Escribe tu nombre completo.";
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
      const { user } = await registrarCandidato(form.nombre.trim(), form.email.trim(), form.password);
      enviarBienvenidaCandidato({ email: form.email.trim(), nombre: form.nombre.trim() });
      // Si el email necesita confirmación, mostrar mensaje; si no, redirigir
      if (user && !user.confirmed_at) {
        setExito(true);
      } else {
        navigate("/candidato/dashboard");
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
          Encuentra tu próximo empleo en salud
        </h2>
        <p className="text-blue-200 mb-8">
          Miles de profesionales ya confían en MedApply para avanzar en su carrera.
        </p>

        <ul className="space-y-4 mb-10">
          {BENEFICIOS.map((b) => (
            <li key={b.texto} className="flex items-start gap-3">
              <span className="text-2xl leading-none">{b.icono}</span>
              <span className="text-blue-100 text-sm leading-relaxed">{b.texto}</span>
            </li>
          ))}
        </ul>

        <div className="bg-white/10 rounded-2xl p-5">
          <p className="text-sm text-blue-100 leading-relaxed">
            La primera bolsa de empleo exclusiva del sector salud en Colombia. Crea tu perfil gratis y conecta directamente con clínicas, hospitales y EPS.
          </p>
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
            <h1 className="text-2xl font-bold text-azul-marino">Crea tu cuenta gratis</h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Solo 30 segundos. Completarás tu perfil después, a tu ritmo.
            </p>
          </div>

          {exito ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-esmeralda/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-azul-marino mb-2">¡Cuenta creada!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Revisa tu correo en <strong>{form.email}</strong> y confirma tu cuenta para activarla.
                Después podrás iniciar sesión.
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

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Nombre completo
              </label>
              <input
                name="nombre"
                type="text"
                autoComplete="name"
                value={form.nombre}
                onChange={cambiar}
                placeholder="Ej: Valentina García Mora"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-azul-claro ${errores.nombre ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={cambiar}
                placeholder="tu@correo.com"
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

            {/* Ley 1581 — obligatorio legalmente pero no invasivo */}
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
                  Acepto el tratamiento de mis datos según la{" "}
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
              {cargando ? "Creando tu cuenta..." : "Crear cuenta gratis →"}
            </button>
          </form>
          )}

          {/* Qué pasa después */}
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <p className="text-xs text-azul-marino leading-relaxed">
              <span className="font-semibold">Después del registro</span>, completa tu perfil a tu ritmo: foto, categoría profesional, experiencia, hoja de vida PDF, video de presentación y tu número ReTHUS para el badge de verificación. Todo <span className="font-semibold">opcional</span>.
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-esmeralda font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿Eres empresa?{" "}
            <Link to="/registro/empresa" className="text-azul-marino font-semibold hover:underline">
              Registra tu institución
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
