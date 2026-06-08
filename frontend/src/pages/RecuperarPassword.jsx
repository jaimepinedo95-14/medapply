import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RecuperarPassword() {
  const { recuperarPassword } = useAuth();
  const [email, setEmail]       = useState("");
  const [enviado, setEnviado]   = useState(false);
  const [error, setError]       = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      await recuperarPassword(email.trim());
      setEnviado(true);
    } catch (err) {
      setError(err.message || "No se pudo enviar el correo. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-esmeralda rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <span className="font-bold text-2xl">
              <span className="text-esmeralda">Med</span><span className="text-azul-marino">Apply</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          {enviado ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-esmeralda/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-azul-marino mb-2">¡Correo enviado!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Revisa tu bandeja de entrada en <strong>{email}</strong>.
                El enlace expira en 1 hora. Si no lo ves, revisa spam.
              </p>
              <Link to="/login" className="btn-primario py-3 px-8 inline-block">
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-azul-marino mb-2">Recuperar contraseña</h1>
                <p className="text-gray-500 text-sm">
                  Ingresa tu correo y te enviamos un enlace para restablecerla.
                </p>
              </div>
              <form onSubmit={enviar} noValidate className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-azul-claro transition-colors
                      ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    autoFocus
                  />
                  {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full btn-primario py-3 disabled:opacity-60"
                >
                  {cargando ? "Enviando..." : "Enviar enlace de recuperación →"}
                </button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-5">
                <Link to="/login" className="text-azul-marino font-semibold hover:underline">
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
