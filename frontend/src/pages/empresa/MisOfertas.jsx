import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function MisOfertas() {
  const { usuario } = useAuth();
  const [ofertas, setOfertas]   = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);
  const [toast, setToast]       = useState("");

  useEffect(() => {
    if (usuario?.id) cargar();
  }, [usuario?.id]);

  async function cargar() {
    setCargando(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("ofertas")
        .select("*, postulaciones(count)")
        .eq("empresa_id", usuario.id)
        .order("fecha_publicacion", { ascending: false });
      if (err) throw err;
      setOfertas(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  async function cerrarOferta(id) {
    setOfertas((p) => p.map((o) => o.id === id ? { ...o, estado: "cerrada" } : o));
    const { error: err } = await supabase.from("ofertas").update({ estado: "cerrada" }).eq("id", id);
    if (err) {
      setOfertas((p) => p.map((o) => o.id === id ? { ...o, estado: "activa" } : o));
      mostrarToast("❌ Error al cerrar la oferta");
    } else {
      mostrarToast("✅ Oferta cerrada");
    }
  }

  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const activas   = ofertas.filter(o => o.estado === "activa").length;
  const totalPost = ofertas.reduce((s, o) => s + (o.postulaciones?.[0]?.count || 0), 0);
  const cerradas  = ofertas.filter(o => o.estado !== "activa").length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Mis ofertas</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona las ofertas de empleo publicadas.</p>
        </div>
        <Link to="/empresa/publicar-oferta" className="btn-primario text-sm py-2 px-4 whitespace-nowrap">
          + Publicar oferta
        </Link>
      </div>

      {/* Resumen */}
      {!cargando && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Activas",          valor: activas,    color: "text-green-600" },
            { label: "Total postulados", valor: totalPost,  color: "text-azul-marino" },
            { label: "Cerradas",         valor: cerradas,   color: "text-gray-400" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Lista */}
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
          <h3 className="font-bold text-azul-marino text-lg mb-2">Aún no has publicado ofertas</h3>
          <p className="text-gray-400 text-sm mb-5">Publica tu primera oferta y empieza a recibir postulaciones hoy mismo.</p>
          <Link to="/empresa/publicar-oferta" className="btn-primario text-sm py-2.5 px-6">
            Publicar primera oferta
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ofertas.map((o) => {
            const postulados = o.postulaciones?.[0]?.count || 0;
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-azul-marino">{o.titulo}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        o.estado === "activa" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>{o.estado}</span>
                      {o.urgente && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">Urgente</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {o.ciudad} · {o.tipo_contrato} · {o.categoria_profesional}
                    </p>
                    {o.fecha_limite && (
                      <p className="text-gray-400 text-xs mt-1">
                        Fecha límite: {new Date(o.fecha_limite).toLocaleDateString("es-CO")}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <p className="text-2xl font-bold text-azul-marino">{postulados}</p>
                    <p className="text-xs text-gray-400">postulados</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                  <Link to={`/empleos/${o.id}`} className="text-sm text-esmeralda font-semibold hover:underline">
                    Ver oferta pública
                  </Link>
                  {o.estado === "activa" && (
                    <button onClick={() => cerrarOferta(o.id)} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Cerrar oferta
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-azul-marino text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
