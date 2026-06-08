import { useNotificaciones, TIPOS_NOTIFICACION } from "../context/NotificacionesContext";
import { Link } from "react-router-dom";

const META_TIPO = {
  [TIPOS_NOTIFICACION.POSTULACION_RECIBIDA]: { icono: "📥", color: "bg-blue-100 text-blue-600",   label: "Nueva postulación" },
  [TIPOS_NOTIFICACION.CAMBIO_ESTADO]:        { icono: "🔄", color: "bg-amber-100 text-amber-600", label: "Estado actualizado" },
  [TIPOS_NOTIFICACION.NUEVA_OFERTA]:         { icono: "💼", color: "bg-esmeralda/10 text-esmeralda", label: "Oferta recomendada" },
  [TIPOS_NOTIFICACION.MENSAJE]:              { icono: "💬", color: "bg-purple-100 text-purple-600", label: "Mensaje nuevo" },
  [TIPOS_NOTIFICACION.RECORDATORIO_PERFIL]:  { icono: "✅", color: "bg-gray-100 text-gray-500",   label: "Recordatorio" },
};

function tiempoRelativo(fecha) {
  const diff = Date.now() - new Date(fecha).getTime();
  const min  = Math.floor(diff / 60000);
  const hora = Math.floor(diff / 3600000);
  const dia  = Math.floor(diff / 86400000);
  if (min < 1)  return "Justo ahora";
  if (min < 60) return `Hace ${min} min`;
  if (hora < 24) return `Hace ${hora}h`;
  return `Hace ${dia}d`;
}

export default function Notificaciones() {
  const { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas, eliminar } = useNotificaciones();

  const sinLeer  = notificaciones.filter((n) => !n.leida);
  const leidas   = notificaciones.filter((n) => n.leida);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Notificaciones</h1>
          {noLeidas > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {noLeidas} notificacion{noLeidas !== 1 ? "es" : ""} sin leer
            </p>
          )}
        </div>
        {noLeidas > 0 && (
          <button onClick={marcarTodasLeidas}
            className="text-sm font-semibold text-esmeralda hover:text-esmeralda-hover transition-colors">
            Marcar todas como leídas
          </button>
        )}
      </div>

      {notificaciones.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔔</span>
          </div>
          <p className="text-gray-500 font-medium">No tienes notificaciones</p>
          <p className="text-gray-400 text-sm mt-1">Te avisaremos cuando haya novedades.</p>
        </div>
      )}

      {/* Sin leer */}
      {sinLeer.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Sin leer
          </h2>
          <div className="space-y-2">
            {sinLeer.map((n) => (
              <TarjetaNotificacion key={n.id} notif={n} onLeer={marcarLeida} onEliminar={eliminar} />
            ))}
          </div>
        </section>
      )}

      {/* Leídas */}
      {leidas.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Anteriores
          </h2>
          <div className="space-y-2">
            {leidas.map((n) => (
              <TarjetaNotificacion key={n.id} notif={n} onLeer={marcarLeida} onEliminar={eliminar} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TarjetaNotificacion({ notif, onLeer, onEliminar }) {
  const meta = META_TIPO[notif.tipo] || META_TIPO[TIPOS_NOTIFICACION.RECORDATORIO_PERFIL];

  return (
    <div
      onClick={() => !notif.leida && onLeer(notif.id)}
      className={`group relative flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer
        ${notif.leida
          ? "bg-white border-gray-100 opacity-75 hover:opacity-100"
          : "bg-blue-50/60 border-blue-100 hover:bg-blue-50"
        }`}
    >
      {/* Ícono tipo */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${meta.color}`}>
        {meta.icono}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{meta.label}</span>
            <p className={`text-sm font-semibold ${notif.leida ? "text-gray-600" : "text-azul-marino"} leading-snug`}>
              {notif.titulo}
            </p>
          </div>
          <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
            {tiempoRelativo(notif.fecha)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5 leading-snug">{notif.descripcion}</p>
        {notif.detalle && (
          <p className="text-xs text-gray-400 mt-1 italic">{notif.detalle}</p>
        )}
        {notif.accion && (
          <Link
            to={notif.accion.href}
            onClick={(e) => e.stopPropagation()}
            className="inline-block mt-2 text-xs font-semibold text-esmeralda hover:text-esmeralda-hover transition-colors"
          >
            {notif.accion.label} →
          </Link>
        )}
      </div>

      {/* Punto sin leer */}
      {!notif.leida && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-esmeralda" />
      )}

      {/* Botón eliminar — aparece en hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onEliminar(notif.id); }}
        className="absolute top-2 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 text-xs p-1"
        title="Eliminar"
      >
        ✕
      </button>
    </div>
  );
}
