import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { InputCampo } from "../../components/common/InputCampo";

export default function ConfiguracionCandidato() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState({ actual: "", nueva: "", confirmar: "" });
  const [erroresPassword, setErroresPassword] = useState({});
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [mensaje, setMensaje] = useState(null); // { tipo: "ok"|"error", texto }

  const manejarLogout = () => { logout(); navigate("/"); };

  function mostrarMensaje(tipo, texto) {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 4000);
  }

  const cambiarPassword = async () => {
    const err = {};
    if (!password.actual)                err.actual    = "Ingresa tu contraseña actual.";
    if (!password.nueva || password.nueva.length < 6)
                                          err.nueva     = "Mínimo 6 caracteres.";
    if (password.nueva !== password.confirmar)
                                          err.confirmar = "Las contraseñas no coinciden.";
    if (Object.keys(err).length) { setErroresPassword(err); return; }
    setErroresPassword({});
    setGuardandoPassword(true);
    try {
      // Verifica la contraseña actual re-autenticando contra Supabase antes
      // de cambiarla — updateUser() no valida la contraseña anterior por sí solo.
      const { error: errAuth } = await supabase.auth.signInWithPassword({
        email: usuario.email,
        password: password.actual,
      });
      if (errAuth) {
        setErroresPassword({ actual: "La contraseña actual no es correcta." });
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: password.nueva });
      if (error) throw error;

      setPassword({ actual: "", nueva: "", confirmar: "" });
      mostrarMensaje("ok", "Contraseña actualizada correctamente.");
    } catch (e) {
      mostrarMensaje("error", e.message);
    } finally {
      setGuardandoPassword(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Administra tu cuenta.</p>
      </div>

      {mensaje && (
        <div className={`rounded-xl px-4 py-3 mb-4 text-sm font-semibold ${
          mensaje.tipo === "ok"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {mensaje.tipo === "ok" ? "✅ " : "❌ "}{mensaje.texto}
        </div>
      )}

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
        <h2 className="text-lg font-bold text-azul-marino mb-4">Cambiar contraseña</h2>
        <div className="space-y-4 max-w-md">
          <InputCampo
            label="Contraseña actual"
            type="password"
            value={password.actual}
            onChange={(e) => setPassword((p) => ({ ...p, actual: e.target.value }))}
            error={erroresPassword.actual}
          />
          <InputCampo
            label="Nueva contraseña"
            type="password"
            value={password.nueva}
            onChange={(e) => setPassword((p) => ({ ...p, nueva: e.target.value }))}
            error={erroresPassword.nueva}
            placeholder="Mínimo 6 caracteres"
          />
          <InputCampo
            label="Confirmar nueva contraseña"
            type="password"
            value={password.confirmar}
            onChange={(e) => setPassword((p) => ({ ...p, confirmar: e.target.value }))}
            error={erroresPassword.confirmar}
            placeholder="Repite la nueva contraseña"
          />
        </div>
        <button
          onClick={cambiarPassword}
          disabled={guardandoPassword}
          className="btn-outline mt-5 py-2.5 px-5 text-sm disabled:opacity-50"
        >
          {guardandoPassword ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </div>

      {/* Sesión */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-azul-marino mb-2">Sesión</h2>
        <p className="text-gray-500 text-sm mb-4">Cierra tu sesión en este dispositivo.</p>
        <button onClick={manejarLogout} className="px-5 py-2 text-sm border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
