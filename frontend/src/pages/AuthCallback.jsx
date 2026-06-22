import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// El cliente de Supabase (lib/supabase.js) tiene detectSessionInUrl: true,
// así que al cargar esta página ya intercambia automáticamente el code/hash
// de la URL por una sesión real y dispara SIGNED_IN, que AuthContext escucha
// y resuelve consultando la tabla `usuarios` en Supabase (sin datos mock).
export default function AuthCallback() {
  const navigate = useNavigate();
  const { usuario, DESTINO_POR_ROL } = useAuth();
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    if (usuario) {
      navigate(DESTINO_POR_ROL[usuario.rol] || "/", { replace: true });
      return;
    }
    // Si tras unos segundos no se estableció la sesión, el login con el
    // proveedor falló, fue cancelado, o el enlace expiró.
    const timeout = setTimeout(() => {
      if (!usuario) setFallo(true);
    }, 6000);
    return () => clearTimeout(timeout);
  }, [usuario, navigate, DESTINO_POR_ROL]);

  if (fallo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <p className="text-3xl mb-3">⚠️</p>
          <h2 className="text-lg font-bold text-azul-marino mb-2">
            No se pudo completar el inicio de sesión
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            El proceso fue cancelado o el enlace expiró. Intenta de nuevo.
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="btn-primario py-2.5 px-6 text-sm"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-3 text-gray-400">
        <div className="w-5 h-5 border-2 border-esmeralda border-t-transparent rounded-full animate-spin" />
        Completando inicio de sesión...
      </div>
    </div>
  );
}
