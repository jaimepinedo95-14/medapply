import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { LIMITE_VACANTES, LABEL_PLAN } from "../../config/planesEmpresa";

const DIAS_VIGENCIA = 30;

function diasDesde(fechaStr) {
  return Math.floor((Date.now() - new Date(fechaStr).getTime()) / 86400000);
}

function ModalConfirmarRetiro({ oferta, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
        <h3 className="font-bold text-azul-marino mb-2">Retirar oferta</h3>
        <p className="text-gray-600 text-sm mb-5">
          ¿Seguro que quieres retirar <strong>{oferta.titulo}</strong>? Los candidatos ya no podrán verla.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancelar} className="flex-1 btn-outline text-sm py-2.5">Cancelar</button>
          <button onClick={onConfirmar} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">
            Sí, retirar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MisOfertas() {
  const { usuario } = useAuth();
  const [ofertas, setOfertas]   = useState([]);
  const [plan, setPlan]         = useState("gratuito");
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);
  const [toast, setToast]       = useState("");
  const [retiroPendiente, setRetiroPendiente] = useState(null);
  const [renovando, setRenovando] = useState(null);

  useEffect(() => {
    if (usuario?.id) cargar();
  }, [usuario?.id]);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const [{ data: perfilEmpresa }, { data, error: err }] = await Promise.all([
        supabase.from("perfiles_empresa").select("plan").eq("usuario_id", usuario.id).maybeSingle(),
        supabase
          .from("ofertas")
          .select("*, postulaciones(count)")
          .eq("empresa_id", usuario.id)
          .order("fecha_publicacion", { ascending: false }),
      ]);
      if (err) throw err;

      setPlan(perfilEmpresa?.plan || "gratuito");

      let lista = data || [];

      // Expiración automática: vacantes "activa" con más de 30 días desde
      // fecha_publicacion pasan a "expirada". Se verifica al cargar, sin cron.
      const idsExpirar = lista
        .filter((o) => o.estado === "activa" && diasDesde(o.fecha_publicacion) >= DIAS_VIGENCIA)
        .map((o) => o.id);

      if (idsExpirar.length > 0) {
        const { error: errExpirar } = await supabase
          .from("ofertas")
          .update({ estado: "expirada" })
          .in("id", idsExpirar);
        if (!errExpirar) {
          lista = lista.map((o) => idsExpirar.includes(o.id) ? { ...o, estado: "expirada" } : o);
        }
      }

      setOfertas(lista);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  async function confirmarRetiro() {
    const id = retiroPendiente.id;
    setRetiroPendiente(null);
    setOfertas((p) => p.map((o) => o.id === id ? { ...o, estado: "cerrada" } : o));
    const { error: err } = await supabase.from("ofertas").update({ estado: "cerrada" }).eq("id", id);
    if (err) {
      setOfertas((p) => p.map((o) => o.id === id ? { ...o, estado: "activa" } : o));
      mostrarToast("❌ Error al retirar la oferta");
    } else {
      mostrarToast("✅ Oferta retirada");
    }
  }

  async function renovarOferta(oferta) {
    const limite = LIMITE_VACANTES[plan] ?? 1;
    const activasActuales = ofertas.filter((o) => o.estado === "activa").length;
    if (Number.isFinite(limite) && activasActuales >= limite) {
      mostrarToast(`❌ Ya tienes ${activasActuales}/${limite} vacantes activas en tu plan ${LABEL_PLAN[plan]}. Cierra una o mejora tu plan para renovar.`);
      return;
    }

    setRenovando(oferta.id);
    const ahora = new Date().toISOString();
    const { error: err } = await supabase
      .from("ofertas")
      .update({ estado: "activa", fecha_publicacion: ahora })
      .eq("id", oferta.id);

    if (err) {
      mostrarToast("❌ Error al renovar la oferta");
    } else {
      setOfertas((p) => p.map((o) => o.id === oferta.id ? { ...o, estado: "activa", fecha_publicacion: ahora } : o));
      mostrarToast("✅ Oferta renovada por 30 días más");
    }
    setRenovando(null);
  }

  const activas   = ofertas.filter((o) => o.estado === "activa");
  const cerradas  = ofertas.filter((o) => o.estado === "cerrada");
  const expiradas = ofertas.filter((o) => o.estado === "expirada");
  const totalPost = ofertas.reduce((s, o) => s + (o.postulaciones?.[0]?.count || 0), 0);

  function TarjetaOferta({ o, tipo }) {
    const postulados = o.postulaciones?.[0]?.count || 0;
    const diasTranscurridos = diasDesde(o.fecha_publicacion);
    const diasParaExpirar = DIAS_VIGENCIA - diasTranscurridos;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-azul-marino">{o.titulo}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                tipo === "activa" ? "bg-green-100 text-green-700"
                : tipo === "expirada" ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-500"
              }`}>
                {tipo === "activa" ? "Activa" : tipo === "expirada" ? "Expirada" : "Cerrada"}
              </span>
              {o.urgente && tipo === "activa" && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">Urgente</span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {o.ciudad} · {o.tipo_contrato} · {o.categoria_profesional}
            </p>
            {tipo === "activa" && (
              <p className="text-gray-400 text-xs mt-1">
                {diasParaExpirar > 0 ? `Expira en ${diasParaExpirar} días` : "Expira hoy"}
              </p>
            )}
            {tipo === "expirada" && (
              <p className="text-gray-400 text-xs mt-1">
                Expiró hace {diasTranscurridos - DIAS_VIGENCIA} días
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-center">
            <p className="text-2xl font-bold text-azul-marino">{postulados}</p>
            <p className="text-xs text-gray-400">postulados</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50 flex-wrap">
          <Link to={`/empresa/candidatos?oferta=${o.id}`} className="btn-outline text-sm py-2 px-4">
            👥 Ver candidatos
          </Link>
          {tipo === "activa" && (
            <Link to={`/empleos/${o.id}`} className="text-sm text-esmeralda font-semibold hover:underline self-center">
              Ver vacante pública
            </Link>
          )}
          {tipo === "activa" && (
            <button onClick={() => setRetiroPendiente(o)}
              className="text-sm font-semibold text-white px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] transition-colors self-center ml-auto">
              Retirar oferta
            </button>
          )}
          {tipo === "expirada" && (
            <button onClick={() => renovarOferta(o)} disabled={renovando === o.id}
              className="btn-primario text-sm py-2 px-4 ml-auto disabled:opacity-60">
              {renovando === o.id ? "Renovando..." : "🔄 Renovar por 30 días más"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Mis vacantes</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona las vacantes publicadas por tu empresa.</p>
        </div>
        <Link to="/empresa/publicar-oferta" className="btn-primario text-sm py-2 px-4 whitespace-nowrap">
          + Publicar nueva vacante
        </Link>
      </div>

      {/* Resumen */}
      {!cargando && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Activas",          valor: activas.length,    color: "text-green-600" },
            { label: "Total postulados", valor: totalPost,         color: "text-azul-marino" },
            { label: "Expiradas",        valor: expiradas.length,  color: "text-yellow-600" },
            { label: "Cerradas",         valor: cerradas.length,   color: "text-gray-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {cargando ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
          <p className="text-red-500 font-semibold mb-2">Error al cargar ofertas</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button onClick={cargar} className="btn-primario text-sm py-2 px-5">Reintentar</button>
        </div>
      ) : ofertas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-bold text-azul-marino text-lg mb-2">Aún no has publicado vacantes</h3>
          <p className="text-gray-400 text-sm mb-5">Publica tu primera vacante y empieza a recibir postulaciones hoy mismo.</p>
          <Link to="/empresa/publicar-oferta" className="btn-primario text-sm py-2.5 px-6">
            Publicar primera vacante
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Vacantes activas */}
          {activas.length > 0 && (
            <div className="space-y-3">
              {activas.map((o) => <TarjetaOferta key={o.id} o={o} tipo="activa" />)}
            </div>
          )}

          {/* Vacantes expiradas */}
          {expiradas.length > 0 && (
            <div>
              <h2 className="font-bold text-azul-marino mb-3">Vacantes expiradas</h2>
              <div className="space-y-3">
                {expiradas.map((o) => <TarjetaOferta key={o.id} o={o} tipo="expirada" />)}
              </div>
            </div>
          )}

          {/* Vacantes cerradas */}
          {cerradas.length > 0 && (
            <div>
              <h2 className="font-bold text-azul-marino mb-3">Vacantes cerradas</h2>
              <div className="space-y-3">
                {cerradas.map((o) => <TarjetaOferta key={o.id} o={o} tipo="cerrada" />)}
              </div>
            </div>
          )}
        </div>
      )}

      {retiroPendiente && (
        <ModalConfirmarRetiro
          oferta={retiroPendiente}
          onConfirmar={confirmarRetiro}
          onCancelar={() => setRetiroPendiente(null)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-azul-marino text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50 max-w-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
