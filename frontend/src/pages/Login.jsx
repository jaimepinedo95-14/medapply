import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { usuario, login, DESTINO_POR_ROL } = useAuth();

  // Si ya hay sesión activa, redirigir al panel correspondiente
  useEffect(() => {
    if (usuario) {
      navigate(DESTINO_POR_ROL[usuario.rol] || "/", { replace: true });
    }
  }, [usuario, navigate, DESTINO_POR_ROL]);

  const [datos, setDatos]             = useState({ email: "", password: "" });
  const [mostrarPwd, setMostrarPwd]   = useState(false);
  const [errores, setErrores]         = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando]       = useState(false);

  const cambiar = (e) => {
    setDatos((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errores[e.target.name]) setErrores((p) => ({ ...p, [e.target.name]: "" }));
    if (errorGeneral) setErrorGeneral("");
  };

  const validar = () => {
    const err = {};
    if (!datos.email.trim()) err.email = "Ingresa tu correo electrónico.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) err.email = "Correo no válido.";
    if (!datos.password) err.password = "Ingresa tu contraseña.";
    return err;
  };

  const enviar = async (e) => {
    e.preventDefault();
    const err = validar();
    if (Object.keys(err).length) { setErrores(err); return; }

    setCargando(true);
    setErrorGeneral("");
    try {
      await login(datos.email.trim(), datos.password);
      // El useEffect anterior detecta el cambio de `usuario` y redirige automáticamente
    } catch (e) {
      setErrorGeneral(e.message);
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-9 h-9 bg-esmeralda rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <span className="font-bold text-2xl">
              <span className="text-esmeralda">Med</span><span className="text-azul-marino">Apply</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-azul-marino">Bienvenido de nuevo</h1>
          <p className="text-gray-500 mt-1 text-sm">Inicia sesión en tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={enviar} noValidate className="space-y-5">

            {/* Error general */}
            {errorGeneral && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                {errorGeneral}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={datos.email}
                onChange={cambiar}
                placeholder="tu@correo.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-azul-claro
                  ${errores.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-azul-marino">Contraseña</label>
                <Link to="/recuperar-password" className="text-xs text-esmeralda hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={mostrarPwd ? "text" : "password"}
                  autoComplete="current-password"
                  value={datos.password}
                  onChange={cambiar}
                  placeholder="Tu contraseña"
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-azul-claro
                    ${errores.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  {mostrarPwd ? "🙈" : "👁"}
                </button>
              </div>
              {errores.password && <p className="text-red-500 text-xs mt-1">{errores.password}</p>}
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-esmeralda hover:bg-esmeralda-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 text-base"
            >
              {cargando ? "Iniciando sesión..." : "Iniciar sesión →"}
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link to="/registro/candidato" className="text-esmeralda font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>
          <p className="text-xs text-gray-400">
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
