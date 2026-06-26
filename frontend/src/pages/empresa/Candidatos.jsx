import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { notificarCambioEstadoPostulacion } from "../../lib/notificacionesEmail";

const ESTADOS = [
  { value: "pendiente",       label: "Nuevo",          color: "bg-blue-100 text-blue-700" },
  { value: "vista",           label: "Revisado",       color: "bg-yellow-100 text-yellow-700" },
  { value: "preseleccionada", label: "Preseleccionado", color: "bg-green-100 text-green-700" },
  { value: "rechazada",       label: "Descartado",     color: "bg-gray-100 text-gray-500" },
];

const ESTADO_INFO = Object.fromEntries(ESTADOS.map((e) => [e.value, e]));

function ModalContacto({ candidato, onCerrar }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
        <h3 className="font-bold text-azul-marino mb-1">{candidato.nombre}</h3>
        <p className="text-gray-400 text-xs mb-4">Información de contacto</p>
        {candidato.email && (
          <a href={`mailto:${candidato.email}`}
            className="block bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-azul-marino font-semibold mb-3 hover:bg-gray-100 transition-colors break-all">
            ✉️ {candidato.email}
          </a>
        )}
        {candidato.telefono && (
          <a href={`tel:${candidato.telefono}`}
            className="block bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-azul-marino font-semibold mb-4 hover:bg-gray-100 transition-colors">
            📞 {candidato.telefono}
          </a>
        )}
        {!candidato.email && !candidato.telefono && (
          <p className="text-gray-400 text-sm mb-4">Este candidato no registró datos de contacto.</p>
        )}
        <button onClick={onCerrar} className="btn-outline w-full text-sm py-2.5">Cerrar</button>
      </div>
    </div>
  );
}

export default function Candidatos() {
  const { usuario } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const ofertaSeleccionada = searchParams.get("oferta") || "";

  const [misOfertas, setMisOfertas]   = useState([]);
  const [postulantes, setPostulantes] = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState(null);
  const [contactoAbierto, setContactoAbierto] = useState(null);
  const [mensajeCV, setMensajeCV]     = useState("");

  const cargar = useCallback(async () => {
    if (!usuario?.id) return;
    setCargando(true);
    setError(null);
    try {
      const { data: ofertas } = await supabase
        .from("ofertas")
        .select("id, titulo")
        .eq("empresa_id", usuario.id)
        .order("fecha_publicacion", { ascending: false });

      setMisOfertas(ofertas || []);

      const ofertaIds = (ofertas || []).map((o) => o.id);
      if (ofertaIds.length === 0) {
        setPostulantes([]);
        return;
      }

      let query = supabase
        .from("postulaciones")
        .select("id, estado, fecha_postulacion, candidato_id, oferta_id")
        .in("oferta_id", ofertaIds)
        .order("fecha_postulacion", { ascending: false });
      if (ofertaSeleccionada) query = query.eq("oferta_id", ofertaSeleccionada);

      const { data: posts, error: errPosts } = await query;
      if (errPosts) throw errPosts;

      const lista = posts || [];
      const candidatoIds = [...new Set(lista.map((p) => p.candidato_id))];
      const ofertasMap = Object.fromEntries((ofertas || []).map((o) => [o.id, o.titulo]));

      let perfilesMap = {};
      if (candidatoIds.length > 0) {
        const { data: perfiles } = await supabase
          .from("perfiles_candidato")
          .select("usuario_id, categoria_profesional, ciudad, telefono, hoja_de_vida_url, usuarios(nombre, email)")
          .in("usuario_id", candidatoIds);
        perfilesMap = Object.fromEntries((perfiles || []).map((p) => [p.usuario_id, p]));
      }

      setPostulantes(
        lista.map((p) => {
          const perfil = perfilesMap[p.candidato_id];
          return {
            ...p,
            ofertaTitulo: ofertasMap[p.oferta_id] || "Vacante",
            nombre: perfil?.usuarios?.nombre || "Candidato",
            email: perfil?.usuarios?.email || null,
            telefono: perfil?.telefono || null,
            categoria: perfil?.categoria_profesional || "Sin especialidad",
            ciudad: perfil?.ciudad || "",
            hojaDeVidaPath: perfil?.hoja_de_vida_url || null, // path en bucket privado 'cvs', no una URL
          };
        })
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [usuario?.id, ofertaSeleccionada]);

  useEffect(() => { cargar(); }, [cargar]);

  async function cambiarEstado(postulacionId, nuevoEstado) {
    const postulante = postulantes.find((p) => p.id === postulacionId);
    setPostulantes((p) => p.map((x) => x.id === postulacionId ? { ...x, estado: nuevoEstado } : x));
    const { error: err } = await supabase
      .from("postulaciones")
      .update({ estado: nuevoEstado })
      .eq("id", postulacionId);
    if (err) { cargar(); return; } // revertir recargando si falla

    notificarCambioEstadoPostulacion({
      candidatoEmail:  postulante?.email,
      candidatoNombre: postulante?.nombre,
      cargo:           postulante?.ofertaTitulo,
      empresaNombre:   usuario?.nombre,
      nuevoEstado,
    });
  }

  function manejarFiltroOferta(id) {
    if (id) setSearchParams({ oferta: id });
    else setSearchParams({});
  }

  // El bucket 'cvs' es privado: hojaDeVidaPath es solo el path guardado en
  // perfiles_candidato.hoja_de_vida_url (ej. "abc-123/cv.pdf"), no una URL
  // abrible directamente. Hay que pedirle a Supabase Storage una signed URL.
  async function verHojaDeVida(p) {
    if (!p.hojaDeVidaPath) {
      mostrarMensajeCV("Este candidato aún no ha subido su hoja de vida.");
      return;
    }
    const { data, error: errSigned } = await supabase.storage
      .from("cvs")
      .createSignedUrl(p.hojaDeVidaPath, 60);

    if (errSigned || !data?.signedUrl) {
      mostrarMensajeCV("No se pudo abrir la hoja de vida. Intenta de nuevo.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  function mostrarMensajeCV(msg) {
    setMensajeCV(msg);
    setTimeout(() => setMensajeCV(""), 4000);
  }

  function contactar(p) {
    setContactoAbierto(p);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Candidatos</h1>
        <p className="text-gray-500 text-sm mt-1">Postulantes a tus vacantes publicadas.</p>
      </div>

      {/* Filtro por vacante */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
          Filtrar por vacante
        </label>
        <select
          value={ofertaSeleccionada}
          onChange={(e) => manejarFiltroOferta(e.target.value)}
          className="w-full sm:w-80 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-azul-claro bg-white"
        >
          <option value="">Todas las vacantes</option>
          {misOfertas.map((o) => (
            <option key={o.id} value={o.id}>{o.titulo}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
          <p className="text-red-500 font-semibold mb-2">Error al cargar candidatos</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      ) : postulantes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-bold text-azul-marino text-lg mb-2">Aún no hay postulantes</h3>
          <p className="text-gray-400 text-sm mb-5">
            {ofertaSeleccionada
              ? "Nadie se ha postulado a esta vacante todavía."
              : "Cuando alguien se postule a tus vacantes, aparecerá aquí."}
          </p>
          <Link to="/empresa/ofertas" className="btn-primario text-sm py-2.5 px-6">
            Ver mis vacantes
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {postulantes.map((p) => {
            const info = ESTADO_INFO[p.estado] || ESTADO_INFO.pendiente;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 bg-azul-claro">
                    {p.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-azul-marino">{p.nombre}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${info.color}`}>
                        {info.label}
                      </span>
                    </div>
                    <p className="text-esmeralda font-semibold text-sm mt-0.5">{p.categoria}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {p.ciudad && `📍 ${p.ciudad} · `}
                      Postulado a <strong>{p.ofertaTitulo}</strong> ·{" "}
                      {new Date(p.fecha_postulacion).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                  {/* Ver hoja de vida — sin restricción de plan: es un postulante a tu propia vacante */}
                  <button
                    onClick={() => verHojaDeVida(p)}
                    className="text-sm border border-azul-marino text-azul-marino rounded-xl px-4 py-2 hover:bg-azul-marino hover:text-white transition-colors font-semibold"
                  >
                    📄 Ver hoja de vida completa
                  </button>

                  {/* Contactar — sin restricción de plan */}
                  <button
                    onClick={() => contactar(p)}
                    className="btn-primario text-sm py-2 px-4"
                  >
                    ✉️ Contactar
                  </button>

                  {/* Cambiar estado */}
                  <select
                    value={p.estado}
                    onChange={(e) => cambiarEstado(p.id, e.target.value)}
                    className="ml-auto text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-azul-claro bg-white text-gray-700"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {contactoAbierto && (
        <ModalContacto candidato={contactoAbierto} onCerrar={() => setContactoAbierto(null)} />
      )}

      {mensajeCV && (
        <div className="fixed bottom-6 right-6 bg-azul-marino text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50 max-w-sm">
          {mensajeCV}
        </div>
      )}
    </div>
  );
}
