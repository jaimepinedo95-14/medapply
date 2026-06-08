import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ConfiguracionCandidato() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [notis, setNotis] = useState({ nuevasOfertas: true, respuestaPostulacion: true, novedades: false });

  const manejarLogout = () => { logout(); navigate("/"); };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Administra tus preferencias de cuenta.</p>
      </div>

      {/* Notificaciones */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
        <h2 className="text-lg font-bold text-azul-marino mb-4">Notificaciones por correo</h2>
        <div className="space-y-4">
          {[
            { key: "nuevasOfertas",          label: "Nuevas ofertas que coincidan con mi perfil" },
            { key: "respuestaPostulacion",    label: "Respuestas a mis postulaciones" },
            { key: "novedades",              label: "Novedades y consejos de MedApply" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">{label}</span>
              <div
                onClick={() => setNotis(p => ({ ...p, [key]: !p[key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${notis[key] ? "bg-esmeralda" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notis[key] ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
        <h2 className="text-lg font-bold text-azul-marino mb-4">Seguridad</h2>
        <button className="btn-outline py-2 px-5 text-sm w-full sm:w-auto">
          Cambiar contraseña
        </button>
      </div>

      {/* Zona de peligro */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-red-600 mb-2">Zona de riesgo</h2>
        <p className="text-gray-500 text-sm mb-4">Estas acciones son irreversibles.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={manejarLogout} className="px-5 py-2 text-sm border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            Cerrar sesión
          </button>
          {!confirmarEliminar ? (
            <button onClick={() => setConfirmarEliminar(true)} className="px-5 py-2 text-sm border border-red-300 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-red-600 font-semibold">¿Seguro? Esta acción no se puede deshacer.</p>
              <button className="px-4 py-2 text-xs bg-red-600 text-white rounded-xl hover:bg-red-700">Sí, eliminar</button>
              <button onClick={() => setConfirmarEliminar(false)} className="px-4 py-2 text-xs border border-gray-300 rounded-xl">Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
