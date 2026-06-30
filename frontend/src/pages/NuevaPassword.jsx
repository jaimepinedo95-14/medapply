import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LogoIcono from "../components/common/LogoIcono";

export default function NuevaPassword() {
  const navigate = useNavigate();

  // Estados del flujo
  const [fase, setFase] = useState("verificando"); // verificando | formulario | invalido | exito
  const [form, setForm]                   = useState({ password: "", confirmPassword: "" });
  const [verPwd, setVerPwd]               = useState(false);
  const [verPwdConfirm, setVerPwdConfirm] = useState(false);
  const [errores, setErrores]             = useState({});
  const [errorGeneral, setErrorGeneral]   = useState("");
  const [cargando, setCargando]           = useState(false);

  useEffect(() => {
    let cancelado = false;

    // Suscribir PRIMERO para no perder el evento PASSWORD_RECOVERY.
    // Supabase v2 procesa el hash de la URL de forma asíncrona y dispara
    // PASSWORD_RECOVERY a todos los suscriptores activos.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (cancelado) return;
      if (event === "PASSWORD_RECOVERY") {
        setFase("formulario");
      }
    });

    (async () => {
      const search    = new URLSearchParams(window.location.search);
      const tokenHash = search.get("token_hash");
      const queryType = search.get("type");
      const code      = search.get("code");
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const hashToken  = hashParams.get("access_token");
      const hashType   = hashParams.get("type");

      // ── Formato 1: ?token_hash=...&type=recovery (PKCE – email link moderno) ──
      if (tokenHash && queryType === "recovery") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (!cancelado) setFase(error ? "invalido" : "formulario");
        return;
      }

      // ── Formato 2: ?code=... (PKCE code exchange) ─────────────────────────────
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelado) setFase(error ? "invalido" : "formulario");
        return;
      }

      // ── Formato 3: #access_token=...&type=recovery (implicit / legacy) ────────
      // Supabase detecta el hash automáticamente y dispara PASSWORD_RECOVERY
      // via onAuthStateChange (suscrito arriba). Como fallback, esperamos a que
      // la sesión quede establecida y la verificamos.
      if (hashToken && hashType === "recovery") {
        // Dar tiempo al SDK para procesar el hash de forma asíncrona
        await new Promise((r) => setTimeout(r, 1000));
        if (cancelado) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!cancelado) {
          // Si PASSWORD_RECOVERY ya disparó, fase ya es "formulario" — el setter no cambia nada
          setFase((prev) => prev === "verificando" ? (session ? "formulario" : "invalido") : prev);
        }
        return;
      }

      // ── Sin token en URL ───────────────────────────────────────────────────────
      if (!cancelado) setFase("invalido");
    })();

    return () => {
      cancelado = true;
      subscription.unsubscribe();
    };
  }, []);

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: null });
  };

  const validar = () => {
    const e = {};
    if (!form.password || form.password.length < 6)
      e.password = "La contraseña debe tener al menos 6 caracteres.";
    if (!form.confirmPassword)
      e.confirmPassword = "Confirma tu nueva contraseña.";
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Las contraseñas no coinciden.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length) { setErrores(errs); return; }

    setCargando(true);
    setErrorGeneral("");
    try {
      const { error } = await supabase.auth.updateUser({ password: form.password });
      if (error) throw error;
      setFase("exito");
    } catch (err) {
      setErrorGeneral(err.message || "No se pudo actualizar la contraseña. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // ── Fases ─────────────────────────────────────────────────────────────────

  if (fase === "verificando") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-esmeralda border-t-transparent rounded-full animate-spin" />
          Verificando enlace...
        </div>
      </div>
    );
  }

  if (fase === "invalido") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
        <div className="max-w-md w-full mx-auto text-center">
          <LogoLink />
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⛔</span>
            </div>
            <h2 className="text-xl font-bold text-azul-marino mb-2">Enlace inválido o expirado</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Este enlace de recuperación ya fue usado o ha caducado.
              Solicita uno nuevo desde la página de recuperación de contraseña.
            </p>
            <Link to="/recuperar-password"
              className="inline-block bg-esmeralda hover:bg-esmeralda-hover text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
              Solicitar nuevo enlace →
            </Link>
          </div>
          <p className="text-center text-sm text-gray-500 mt-5">
            <Link to="/login" className="text-esmeralda font-semibold hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (fase === "exito") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
        <div className="max-w-md w-full mx-auto text-center">
          <LogoLink />
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-6">
            <div className="w-16 h-16 bg-esmeralda/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-azul-marino mb-2">¡Contraseña actualizada!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Tu contraseña ha sido cambiada correctamente.
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-esmeralda hover:bg-esmeralda-hover text-white font-bold py-3.5 rounded-xl transition-colors text-base"
            >
              Iniciar sesión →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // fase === "formulario"
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">

        <LogoLink />

        <div className="text-center mt-6 mb-7">
          <h1 className="text-2xl font-bold text-azul-marino">Crea tu nueva contraseña</h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Elige una contraseña segura de al menos 6 caracteres.
          </p>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-5">

          {errorGeneral && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
              <span className="flex-shrink-0">⚠️</span>{errorGeneral}
            </div>
          )}

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-semibold text-azul-marino mb-1.5">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                name="password"
                type={verPwd ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={cambiar}
                placeholder="Mínimo 6 caracteres"
                className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-azul-claro
                  ${errores.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              <button type="button" onClick={() => setVerPwd(!verPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">
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
                placeholder="Repite tu nueva contraseña"
                className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-azul-claro
                  ${errores.confirmPassword
                    ? "border-red-400 bg-red-50"
                    : form.confirmPassword && form.confirmPassword === form.password
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200"
                  }`}
              />
              <button type="button" onClick={() => setVerPwdConfirm(!verPwdConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">
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

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-esmeralda hover:bg-esmeralda-hover text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60 text-base"
          >
            {cargando ? "Guardando..." : "Guardar nueva contraseña →"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link to="/login" className="text-esmeralda font-semibold hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Logo reutilizable ─────────────────────────────────────────────────────────
function LogoLink() {
  return (
    <div className="flex justify-center">
      <Link to="/" className="inline-flex items-center gap-2">
        <LogoIcono size={36} />
        <span className="font-bold text-2xl text-azul-marino">Med<span className="font-light text-esmeralda-claro">Apply</span></span>
      </Link>
    </div>
  );
}
