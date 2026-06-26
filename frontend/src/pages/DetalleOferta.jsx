import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { notificarNuevaPostulacionAEmpresa, notificarPostulacionEnviadaACandidato } from "../lib/notificacionesEmail";

function diasDesde(fechaStr) {
  if (!fechaStr) return "";
  const diff = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return `Hace ${diff} días`;
}

function formatSalario(min, max) {
  const fmt = (v) => new Intl.NumberFormat("es-CO").format(v);
  if (min && max) return `$${fmt(min)} – $${fmt(max)} COP`;
  if (min) return `Desde $${fmt(min)} COP`;
  if (max) return `Hasta $${fmt(max)} COP`;
  return null;
}

export default function DetalleOferta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [oferta, setOferta]           = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [postulando, setPostulando]   = useState(false);
  const [postulado, setPostulado]     = useState(false);
  const [errorPost, setErrorPost]     = useState("");
  const [copiado, setCopiado]         = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("ofertas_con_empresa")
      .select("*")
      .eq("id", id)
      .eq("estado", "activa")
      .single()
      .then(({ data }) => {
        setOferta(data || null);
        // Registrar visita (fire & forget, una sola vez por sesión)
        if (data?.id) {
          const key = `visita_${data.id}`;
          if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, "1");
            supabase.from("visitas_ofertas").insert({
              oferta_id:  data.id,
              usuario_id: usuario?.id || null,
            }).then(() => {});
          }
        }
        // Cargar relacionadas por categoría
        if (data?.categoria_profesional) {
          supabase
            .from("ofertas_con_empresa")
            .select("id, titulo, nombre_empresa, ciudad")
            .eq("estado", "activa")
            .eq("categoria_profesional", data.categoria_profesional)
            .neq("id", id)
            .limit(3)
            .then(({ data: rel }) => setRelacionadas(rel || []));
        }
        setCargando(false);
      })
      .catch(() => { setCargando(false); });

    // Verificar si ya se postuló
    if (usuario?.id) {
      supabase
        .from("postulaciones")
        .select("id")
        .eq("candidato_id", usuario.id)
        .eq("oferta_id", id)
        .maybeSingle()
        .then(({ data }) => { if (data) setPostulado(true); });
    }
  }, [id, usuario?.id]);

  const manejarPostulacion = async () => {
    if (!usuario) { navigate("/login"); return; }
    if (usuario.rol !== "candidato") {
      setErrorPost("Solo los candidatos pueden postularse a ofertas.");
      return;
    }
    setPostulando(true);
    setErrorPost("");
    try {
      const { error } = await supabase.from("postulaciones").insert({
        candidato_id: usuario.id,
        oferta_id:    id,
        estado:       "pendiente",
      });
      if (error) {
        if (error.code === "23505") { setPostulado(true); return; } // ya postulado
        throw error;
      }
      setPostulado(true);

      // Notificaciones por email (fire-and-forget, nunca rompen el flujo)
      supabase
        .from("usuarios")
        .select("email")
        .eq("id", oferta.empresa_id)
        .maybeSingle()
        .then(({ data: empresaUsuario }) => {
          notificarNuevaPostulacionAEmpresa({
            empresaEmail:     empresaUsuario?.email,
            empresaNombre:    oferta.nombre_empresa,
            candidatoNombre:  usuario.nombre,
            cargo:            oferta.titulo,
          });
        });
      notificarPostulacionEnviadaACandidato({
        candidatoEmail:   usuario.email,
        candidatoNombre:  usuario.nombre,
        cargo:            oferta.titulo,
        empresaNombre:    oferta.nombre_empresa,
      });
    } catch (err) {
      setErrorPost(err.message || "No se pudo enviar la postulación. Intenta de nuevo.");
    } finally {
      setPostulando(false);
    }
  };

  const compartir = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-esmeralda border-t-transparent rounded-full animate-spin" />
          Cargando oferta...
        </div>
      </div>
    );
  }

  if (!oferta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-3">🔍</p>
          <h2 className="text-xl font-bold text-azul-marino mb-2">Oferta no encontrada</h2>
          <p className="text-gray-400 text-sm mb-4">Es posible que ya no esté disponible.</p>
          <Link to="/empleos" className="btn-primario text-sm py-2.5 px-6">
            Ver todas las ofertas
          </Link>
        </div>
      </div>
    );
  }

  const salario = formatSalario(oferta.salario_min, oferta.salario_max);

  const renderTexto = (texto) =>
    (texto || "").split("\n").filter(Boolean).map((l, i) => (
      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
        <span className="text-esmeralda mt-0.5 flex-shrink-0">•</span>
        {l.replace(/^[-•]\s*/, "")}
      </li>
    ));

  const BotoneraPostulacion = ({ bloque }) => (
    <div className={bloque ? "" : "mt-5 lg:hidden"}>
      {errorPost && (
        <p className="text-red-500 text-xs mb-2 text-center">⚠️ {errorPost}</p>
      )}
      {postulado ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-bold">✅ ¡Postulación enviada!</p>
          <p className="text-green-600 text-sm mt-1">La empresa revisará tu perfil pronto.</p>
          <Link to="/candidato/postulaciones" className="block mt-3 text-sm text-esmeralda hover:underline">
            Ver mis postulaciones →
          </Link>
        </div>
      ) : usuario?.rol === "candidato" ? (
        <button onClick={manejarPostulacion} disabled={postulando}
          className="w-full btn-primario py-4 text-base disabled:opacity-60">
          {postulando ? "Enviando..." : "✅ Postularme a esta oferta"}
        </button>
      ) : usuario ? (
        <p className="text-center text-sm text-gray-400 py-4">
          Solo los candidatos pueden postularse a esta oferta.
        </p>
      ) : (
        <>
          <Link to="/login"
            className="block w-full text-center bg-gray-100 hover:bg-azul-marino hover:text-white text-gray-700 font-bold py-4 rounded-xl transition-colors text-base">
            🔑 Inicia sesión para postularte
          </Link>
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿No tienes cuenta?{" "}
            <Link to="/registro/candidato" className="text-esmeralda underline">Regístrate gratis</Link>
          </p>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-azul-marino">Inicio</Link>
            <span>›</span>
            <Link to="/empleos" className="hover:text-azul-marino">Empleos</Link>
            <span>›</span>
            <span className="text-azul-marino font-medium truncate">{oferta.titulo}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Columna principal ── */}
          <div className="flex-1 min-w-0">

            {/* Encabezado */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                  {oferta.logo_empresa
                    ? <img src={oferta.logo_empresa} alt="" className="w-full h-full object-cover" />
                    : "🏥"}
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <h1 className="text-2xl font-bold text-azul-marino leading-snug flex-1">{oferta.titulo}</h1>
                    {oferta.urgente && (
                      <span className="text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 mt-1 font-medium">{oferta.nombre_empresa || "Empresa confidencial"}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full">📍 {oferta.ciudad}</span>
                    <span className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full">📄 {oferta.tipo_contrato}</span>
                    {oferta.categoria_profesional && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        🩺 {oferta.categoria_profesional}
                      </span>
                    )}
                    <span className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full">
                      ⏰ {diasDesde(oferta.fecha_publicacion)}
                    </span>
                  </div>
                </div>
              </div>

              {salario && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-sm text-gray-400">Salario mensual</p>
                  <p className="text-2xl font-bold text-esmeralda">{salario}</p>
                </div>
              )}

              <BotoneraPostulacion />
            </div>

            {/* Descripción */}
            {oferta.descripcion && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
                <h2 className="text-lg font-bold text-azul-marino mb-4">Descripción del cargo</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{oferta.descripcion}</p>
              </div>
            )}

            {/* Requisitos */}
            {oferta.requisitos && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 shadow-sm">
                <h2 className="text-lg font-bold text-azul-marino mb-4">Requisitos</h2>
                <ul className="space-y-2">{renderTexto(oferta.requisitos)}</ul>
              </div>
            )}

            {/* Fecha límite */}
            {oferta.fecha_limite && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-5">
                <p className="text-yellow-800 text-sm">
                  ⏰ <strong>Fecha límite:</strong>{" "}
                  {new Date(oferta.fecha_limite).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}

            {/* Ofertas relacionadas */}
            {relacionadas.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-azul-marino mb-4">Ofertas similares</h2>
                <div className="space-y-3">
                  {relacionadas.map((rel) => (
                    <Link key={rel.id} to={`/empleos/${rel.id}`}
                      className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:border-gray-200 transition-all">
                      <p className="font-semibold text-azul-marino text-sm">{rel.titulo}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{rel.nombre_empresa} · {rel.ciudad}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar desktop ── */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-5 hidden lg:block">

            {/* Postulación */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-20">
              <BotoneraPostulacion bloque />
            </div>

            {/* Info empresa */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-azul-marino mb-3">Sobre la empresa</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl overflow-hidden">
                  {oferta.logo_empresa
                    ? <img src={oferta.logo_empresa} alt="" className="w-full h-full object-cover" />
                    : "🏥"}
                </div>
                <p className="font-semibold text-sm text-azul-marino">{oferta.nombre_empresa}</p>
              </div>
              <p className="text-xs text-gray-400">
                Publicó esta oferta {diasDesde(oferta.fecha_publicacion).toLowerCase()}.
              </p>
            </div>

            {/* Compartir */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-2">¿Conoces a alguien que encaje?</p>
              <button onClick={compartir} className="text-xs text-esmeralda font-semibold hover:underline">
                {copiado ? "✅ ¡Link copiado!" : "Compartir esta oferta →"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
