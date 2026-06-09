import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { REGION } from "../../config/region";

const CATEGORIAS = [
  "Médico general", "Médico especialista", "Enfermero/a",
  "Auxiliar de enfermería", "Bacteriólogo/a", "Fisioterapeuta",
  "Psicólogo/a", "Odontólogo/a", "Ingeniero biomédico",
  "Farmacéutico/a", "Terapeuta ocupacional", "Fonoaudiólogo/a",
  "Nutricionista", "Conductor de ambulancia", "Camillero/a",
  "Personal administrativo", "Tecnólogo en Radiología", "Otro",
];

const CIUDADES = [...REGION.ciudades, "Otra"];

const SECCIONES_CONFIG = [
  { key: "foto",        pts: 10, label: "Foto de perfil",       icono: "📷" },
  { key: "basicos",     pts: 20, label: "Información básica",   icono: "📋" },
  { key: "telefono",    pts:  5, label: "Teléfono de contacto", icono: "📞" },
  { key: "rethus",      pts: 15, label: "Verificación ReTHUS",  icono: "🏅" },
  { key: "experiencia", pts: 20, label: "Experiencia laboral",  icono: "💼" },
  { key: "educacion",   pts: 15, label: "Educación",            icono: "🎓" },
  { key: "cv",          pts: 10, label: "Hoja de vida PDF",     icono: "📄" },
  { key: "video",       pts:  5, label: "Video presentación",   icono: "🎥" },
];

function calcularProgreso(p) {
  let pts = 0;
  if (p.fotoPreview)              pts += 10;
  if (p.categoria && p.ciudad)    pts += 20;
  if (p.telefono)                 pts +=  5;
  if (p.tarjetaReTHUS)            pts += 15;
  if (p.experiencias.length > 0)  pts += 20;
  if (p.educaciones.length > 0)   pts += 15;
  if (p.cvNombre)                 pts += 10;
  if (p.videoNombre)              pts +=  5;
  return pts;
}

function ProgressRing({ pct }) {
  const r    = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="flex-shrink-0">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="11" />
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke={pct === 100 ? "#34d399" : "#10b981"}
        strokeWidth="11"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 0.7s ease-in-out" }}
      />
      <text x="70" y="62" textAnchor="middle" fill="white" fontSize="30" fontWeight="bold" fontFamily="sans-serif">
        {pct}%
      </text>
      <text x="70" y="82" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="sans-serif">
        completado
      </text>
    </svg>
  );
}

function TarjetaSeccion({ icono, titulo, puntos, completada, hint, abierta, onToggle, opcional, children }) {
  return (
    <div className={`rounded-2xl border-2 bg-white shadow-sm overflow-hidden transition-colors ${
      completada ? "border-esmeralda/40" : abierta ? "border-azul-claro/50" : "border-gray-100 hover:border-gray-200"
    }`}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-5 py-4 text-left group">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors ${
          completada ? "bg-esmeralda/15" : "bg-gray-50 group-hover:bg-gray-100"
        }`}>
          {completada ? "✅" : icono}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-semibold text-sm ${completada ? "text-azul-marino" : "text-gray-700"}`}>{titulo}</p>
            {opcional && (
              <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">Opcional</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {completada
              ? (hint || "Completado · toca para editar")
              : `Añade +${puntos}% a tu perfil`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!completada && (
            <span className="text-xs bg-esmeralda/10 text-esmeralda font-bold px-2 py-0.5 rounded-full">
              +{puntos}%
            </span>
          )}
          <span className={`text-gray-300 text-sm transition-transform duration-200 ${abierta ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>

      {abierta && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default function PerfilCandidato() {
  const { usuario } = useAuth();

  const [perfil, setPerfil] = useState({
    fotoPreview:   null,   // base64 o URL pública desde Storage
    fotoStoredUrl: null,   // URL actualmente guardada en DB
    categoria:     "",
    ciudad:        "",
    telefono:      "",
    tarjetaReTHUS: "",
    experiencias:  [],
    educaciones:   [],
    cvNombre:      null,   // nombre para mostrar
    cvStoredPath:  null,   // path en bucket 'cvs'
    videoNombre:   null,
    videoStoredPath: null,
  });

  const [seccion, setSeccion]           = useState(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  const [formExp, setFormExp] = useState({
    cargo: "", empresa: "", ciudadExp: "",
    inicio: "", fin: "", esActual: false, descripcion: "",
  });
  const [errExp, setErrExp] = useState({});

  const [formEdu, setFormEdu] = useState({ titulo: "", institucion: "", año: "" });
  const [errEdu, setErrEdu]   = useState({});

  const [videoError, setVideoError] = useState(null);
  const [guardando, setGuardando]   = useState(false);
  const [guardado, setGuardado]     = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  // Refs para archivos pendientes de subir
  const fotoRef      = useRef();
  const cvRef        = useRef();
  const videoRef     = useRef();
  const fotoFileRef  = useRef(null);
  const cvFileRef    = useRef(null);
  const videoFileRef = useRef(null);

  const pct    = calcularProgreso(perfil);
  const toggle = (nombre) => setSeccion((s) => (s === nombre ? null : nombre));

  // Cargar perfil existente desde Supabase
  useEffect(() => {
    if (!usuario?.id) { setCargandoPerfil(false); return; }
    supabase
      .from("perfiles_candidato")
      .select("*")
      .eq("usuario_id", usuario.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const exps = Array.isArray(data.experiencias)
            ? data.experiencias.map((e, i) => ({ ...e, id: e.id || Date.now() + i }))
            : [];
          const edus = Array.isArray(data.educaciones)
            ? data.educaciones.map((e, i) => ({ ...e, id: e.id || Date.now() + i + 1000 }))
            : [];

          setPerfil((p) => ({
            ...p,
            fotoPreview:    data.foto || null,
            fotoStoredUrl:  data.foto || null,
            categoria:      data.categoria_profesional     || "",
            ciudad:         data.ciudad                    || "",
            telefono:       data.telefono                  || "",
            tarjetaReTHUS:  data.numero_tarjeta_profesional || "",
            experiencias:   exps,
            educaciones:    edus,
            cvNombre:       data.hoja_de_vida_url
              ? decodeURIComponent(data.hoja_de_vida_url.split("/").pop().split("?")[0])
              : null,
            cvStoredPath:   data.hoja_de_vida_url || null,
            videoNombre:    data.video_presentacion_url
              ? decodeURIComponent(data.video_presentacion_url.split("/").pop().split("?")[0])
              : null,
            videoStoredPath: data.video_presentacion_url || null,
          }));
        }
        setCargandoPerfil(false);
      })
      .catch(() => setCargandoPerfil(false));
  }, [usuario?.id]);

  // ── Handlers de archivos ──────────────────────────────────────────────────

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    fotoFileRef.current = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPerfil((p) => ({ ...p, fotoPreview: ev.target.result }));
      setSeccion(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") return;
    if (file.size > 5 * 1024 * 1024) return;
    cvFileRef.current = file;
    setPerfil((p) => ({ ...p, cvNombre: file.name }));
    setSeccion(null);
  };

  const handleVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("video/")) return;
    setVideoError(null);
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (vid.duration > 60) {
        setVideoError("El video supera los 60 segundos. Por favor usa un video más corto.");
        return;
      }
      videoFileRef.current = file;
      setPerfil((p) => ({ ...p, videoNombre: file.name }));
      setSeccion(null);
    };
    vid.src = url;
  };

  // ── Guardar sección básicos / ReTHUS ──────────────────────────────────────

  const guardarBasicos  = () => { if (perfil.categoria && perfil.ciudad) setSeccion(null); };
  const guardarReTHUS   = () => { if (perfil.tarjetaReTHUS.trim()) setSeccion(null); };

  // ── Experiencias ─────────────────────────────────────────────────────────

  const agregarExperiencia = () => {
    const e = {};
    if (!formExp.cargo.trim())   e.cargo   = "Campo obligatorio";
    if (!formExp.empresa.trim()) e.empresa = "Campo obligatorio";
    if (!formExp.inicio.trim())  e.inicio  = "Campo obligatorio";
    if (Object.keys(e).length) { setErrExp(e); return; }
    setPerfil((p) => ({
      ...p,
      experiencias: [...p.experiencias, { ...formExp, id: Date.now() }],
    }));
    setFormExp({ cargo: "", empresa: "", ciudadExp: "", inicio: "", fin: "", esActual: false, descripcion: "" });
    setErrExp({});
  };

  const quitarExperiencia = (id) =>
    setPerfil((p) => ({ ...p, experiencias: p.experiencias.filter((x) => x.id !== id) }));

  // ── Educaciones ───────────────────────────────────────────────────────────

  const agregarEducacion = () => {
    const e = {};
    if (!formEdu.titulo.trim())      e.titulo      = "Campo obligatorio";
    if (!formEdu.institucion.trim()) e.institucion = "Campo obligatorio";
    if (Object.keys(e).length) { setErrEdu(e); return; }
    setPerfil((p) => ({
      ...p,
      educaciones: [...p.educaciones, { ...formEdu, id: Date.now() }],
    }));
    setFormEdu({ titulo: "", institucion: "", año: "" });
    setErrEdu({});
  };

  const quitarEducacion = (id) =>
    setPerfil((p) => ({ ...p, educaciones: p.educaciones.filter((x) => x.id !== id) }));

  // ── Guardar todo en Supabase ──────────────────────────────────────────────

  const guardarPerfil = async () => {
    if (!usuario?.id) return;
    setGuardando(true);
    setErrorGuardar(null);

    let fotoUrl   = perfil.fotoStoredUrl;
    let cvPath    = perfil.cvStoredPath;
    let videoPath = perfil.videoStoredPath;

    try {
      // 1. Subir nueva foto de perfil
      if (fotoFileRef.current) {
        const file = fotoFileRef.current;
        const ext  = file.name.split(".").pop();
        const path = `${usuario.id}/foto.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("fotos-perfil")
          .upload(path, file, { upsert: true });
        if (!upErr) {
          const { data: { publicUrl } } = supabase.storage
            .from("fotos-perfil")
            .getPublicUrl(path);
          fotoUrl = publicUrl;
          fotoFileRef.current = null;
          setPerfil((p) => ({ ...p, fotoPreview: publicUrl, fotoStoredUrl: publicUrl }));
        }
      }

      // 2. Subir nueva hoja de vida (PDF)
      if (cvFileRef.current) {
        const file = cvFileRef.current;
        const path = `${usuario.id}/cv.pdf`;
        const { error: upErr } = await supabase.storage
          .from("cvs")
          .upload(path, file, { upsert: true });
        if (!upErr) {
          cvPath = path;
          cvFileRef.current = null;
          setPerfil((p) => ({ ...p, cvStoredPath: path }));
        }
      }

      // 3. Subir nuevo video de presentación
      if (videoFileRef.current) {
        const file = videoFileRef.current;
        const ext  = file.name.split(".").pop();
        const path = `${usuario.id}/video.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("videos")
          .upload(path, file, { upsert: true });
        if (!upErr) {
          videoPath = path;
          videoFileRef.current = null;
          setPerfil((p) => ({ ...p, videoStoredPath: path }));
        }
      }

      // 4. Guardar todos los datos del perfil
      const { error } = await supabase
        .from("perfiles_candidato")
        .upsert(
          {
            usuario_id:                 usuario.id,
            foto:                       fotoUrl,
            categoria_profesional:      perfil.categoria,
            ciudad:                     perfil.ciudad,
            telefono:                   perfil.telefono,
            numero_tarjeta_profesional: perfil.tarjetaReTHUS,
            porcentaje_perfil:          pct,
            experiencias:               perfil.experiencias,
            educaciones:                perfil.educaciones,
            hoja_de_vida_url:           cvPath,
            video_presentacion_url:     videoPath,
            updated_at:                 new Date().toISOString(),
          },
          { onConflict: "usuario_id" }
        );

      if (error) throw error;
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch (err) {
      setErrorGuardar(err.message);
    } finally {
      setGuardando(false);
    }
  };

  // ── Renderizado ───────────────────────────────────────────────────────────

  const mensajeProgreso =
    pct === 100 ? "🎉 ¡Perfil completo! Apareces primero en las búsquedas de empresas."
    : pct >= 80  ? "¡Casi listo! Solo un detalle más para estar al 100%."
    : pct >= 50  ? "¡Buen progreso! Cuanto más completo, más empresas te contactarán."
    : pct >= 20  ? "Completa tu perfil para que las empresas te encuentren más fácil."
    :              "Completa tu perfil a tu ritmo — todo es completamente opcional.";

  const nombreCorto = usuario?.nombre?.split(" ")[0] || "candidato";

  if (cargandoPerfil) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-44">

      {/* ── Hero de progreso ── */}
      <div className="bg-gradient-to-br from-azul-marino via-azul-claro to-azul-marino text-white rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing pct={pct} />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-xl font-bold mb-1">¡Hola, {nombreCorto}! 👋</h1>
          <p className="text-blue-200 text-sm mb-4 leading-relaxed">{mensajeProgreso}</p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {[
              { label: "Básico",      done: !!(perfil.categoria && perfil.ciudad) },
              { label: "Experiencia", done: perfil.experiencias.length > 0 },
              { label: "Educación",   done: perfil.educaciones.length > 0 },
              { label: "HV PDF",      done: !!perfil.cvNombre },
              { label: "ReTHUS",      done: !!perfil.tarjetaReTHUS },
              { label: "Video",       done: !!perfil.videoNombre },
            ].map((item) => (
              <span
                key={item.label}
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  item.done ? "bg-esmeralda text-white" : "bg-white/10 text-blue-200"
                }`}
              >
                {item.done ? "✓ " : ""}{item.label}
              </span>
            ))}
          </div>
          <p className="text-blue-300 text-xs mt-3">
            Los perfiles al 100% reciben <strong className="text-white">5× más visitas</strong> de empresas.
          </p>
        </div>
      </div>

      {/* Error de guardado */}
      {errorGuardar && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm">
          ❌ {errorGuardar}
        </div>
      )}

      {/* ── Secciones del perfil ── */}
      <div className="space-y-3">

        {/* 1. Foto de perfil */}
        <TarjetaSeccion
          icono="📷" titulo="Foto de perfil" puntos={10}
          completada={!!perfil.fotoPreview}
          hint="Foto cargada"
          abierta={seccion === "foto"}
          onToggle={() => toggle("foto")}
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
            <div
              className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              onClick={() => fotoRef.current?.click()}
            >
              {perfil.fotoPreview
                ? <img src={perfil.fotoPreview} alt="Foto" className="w-full h-full object-cover" />
                : "👤"}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Una foto profesional hace que los reclutadores confíen más en tu perfil.
              </p>
              <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
              <button
                onClick={() => fotoRef.current?.click()}
                className="bg-azul-marino text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-azul-claro transition-colors"
              >
                {perfil.fotoPreview ? "Cambiar foto" : "Elegir foto"}
              </button>
              <p className="text-xs text-gray-400 mt-2">JPG, PNG o WebP · máx. 5 MB</p>
            </div>
          </div>
        </TarjetaSeccion>

        {/* 2. Información básica */}
        <TarjetaSeccion
          icono="📋" titulo="Información básica" puntos={20}
          completada={!!(perfil.categoria && perfil.ciudad)}
          hint={perfil.categoria && perfil.ciudad
            ? `${perfil.categoria} · ${perfil.ciudad}${perfil.telefono ? " · " + perfil.telefono : ""}`
            : undefined}
          abierta={seccion === "basicos"}
          onToggle={() => toggle("basicos")}
        >
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-azul-marino mb-1.5">
                Categoría profesional <span className="text-red-400">*</span>
              </label>
              <select
                value={perfil.categoria}
                onChange={(e) => setPerfil((p) => ({ ...p, categoria: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro"
              >
                <option value="">Selecciona tu especialidad</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-azul-marino mb-1.5">
                Ciudad <span className="text-red-400">*</span>
              </label>
              <select
                value={perfil.ciudad}
                onChange={(e) => setPerfil((p) => ({ ...p, ciudad: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro"
              >
                <option value="">Selecciona tu ciudad</option>
                {CIUDADES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-azul-marino mb-1.5">
                Teléfono <span className="text-gray-400 font-normal">(opcional · +5% al perfil)</span>
              </label>
              <input
                type="tel"
                value={perfil.telefono}
                onChange={(e) => setPerfil((p) => ({ ...p, telefono: e.target.value }))}
                placeholder="3XX XXX XXXX"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro"
              />
            </div>
            <button
              onClick={guardarBasicos}
              disabled={!(perfil.categoria && perfil.ciudad)}
              className="w-full bg-esmeralda text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-esmeralda-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </TarjetaSeccion>

        {/* 3. Verificación ReTHUS */}
        <TarjetaSeccion
          icono="🏅" titulo={`Verificación ${REGION.registroProfesional.nombre}`} puntos={15}
          completada={!!perfil.tarjetaReTHUS}
          hint={perfil.tarjetaReTHUS ? `✅ Verificado ${REGION.registroProfesional.nombre} · toca para editar` : undefined}
          abierta={seccion === "rethus"}
          onToggle={() => toggle("rethus")}
        >
          <div className="space-y-4 pt-1">
            <div className="bg-green-50 border border-green-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-green-800 mb-1">
                ¿Qué es el badge Verificado {REGION.registroProfesional.nombre}?
              </p>
              <p className="text-xs text-green-700 leading-relaxed">
                {REGION.registroProfesional.nombreCompleto} de la {REGION.registroProfesional.entidad}.
                Añadir tu número activa un badge verde en tu perfil.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-azul-marino mb-1.5">
                {REGION.registroProfesional.campoCodigo}
              </label>
              <input
                type="text"
                value={perfil.tarjetaReTHUS}
                onChange={(e) => setPerfil((p) => ({ ...p, tarjetaReTHUS: e.target.value }))}
                placeholder={REGION.registroProfesional.placeholder}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-azul-claro"
              />
              <p className="text-xs text-gray-400 mt-1">
                Consúltalo en: {REGION.registroProfesional.url}
              </p>
            </div>
            {perfil.tarjetaReTHUS && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="text-sm font-bold text-green-800">Verificado {REGION.registroProfesional.nombre}</p>
                  <p className="text-xs text-green-600">Este badge aparecerá en tu perfil público.</p>
                </div>
              </div>
            )}
            <button
              onClick={guardarReTHUS}
              disabled={!perfil.tarjetaReTHUS.trim()}
              className="w-full bg-esmeralda text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-esmeralda-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Activar badge {REGION.registroProfesional.nombre}
            </button>
          </div>
        </TarjetaSeccion>

        {/* 4. Experiencia laboral */}
        <TarjetaSeccion
          icono="💼" titulo="Experiencia laboral" puntos={20}
          completada={perfil.experiencias.length > 0}
          hint={perfil.experiencias.length > 0
            ? `${perfil.experiencias.length} empresa${perfil.experiencias.length > 1 ? "s" : ""} registrada${perfil.experiencias.length > 1 ? "s" : ""}`
            : undefined}
          abierta={seccion === "experiencia"}
          onToggle={() => toggle("experiencia")}
        >
          <div className="space-y-4 pt-1">
            {perfil.experiencias.length > 0 && (
              <div className="space-y-2">
                {perfil.experiencias.map((exp) => (
                  <div key={exp.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-lg mt-0.5 flex-shrink-0">🏢</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-azul-marino text-sm">{exp.cargo}</p>
                      <p className="text-gray-500 text-xs">{exp.empresa}{exp.ciudadExp ? ` · ${exp.ciudadExp}` : ""}</p>
                      <p className="text-gray-400 text-xs">{exp.inicio} — {exp.esActual ? "Presente" : (exp.fin || "—")}</p>
                      {exp.descripcion && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{exp.descripcion}</p>
                      )}
                    </div>
                    <button
                      onClick={() => quitarExperiencia(exp.id)}
                      className="text-gray-300 hover:text-red-400 text-xl leading-none transition-colors flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <p className="text-xs font-semibold text-azul-marino mb-3 uppercase tracking-wide">+ Añadir experiencia</p>
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <input
                      value={formExp.cargo}
                      onChange={(e) => { setFormExp((f) => ({ ...f, cargo: e.target.value })); setErrExp((er) => ({ ...er, cargo: null })); }}
                      placeholder="Cargo / Puesto *"
                      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro ${errExp.cargo ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {errExp.cargo && <p className="text-red-500 text-xs mt-0.5">{errExp.cargo}</p>}
                  </div>
                  <div>
                    <input
                      value={formExp.empresa}
                      onChange={(e) => { setFormExp((f) => ({ ...f, empresa: e.target.value })); setErrExp((er) => ({ ...er, empresa: null })); }}
                      placeholder="Empresa / Institución *"
                      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro ${errExp.empresa ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {errExp.empresa && <p className="text-red-500 text-xs mt-0.5">{errExp.empresa}</p>}
                  </div>
                </div>
                <input
                  value={formExp.ciudadExp}
                  onChange={(e) => setFormExp((f) => ({ ...f, ciudadExp: e.target.value }))}
                  placeholder="Ciudad (opcional)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro"
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <input
                      value={formExp.inicio}
                      onChange={(e) => { setFormExp((f) => ({ ...f, inicio: e.target.value })); setErrExp((er) => ({ ...er, inicio: null })); }}
                      placeholder="Año inicio *" type="number" min="1970" max="2030"
                      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro ${errExp.inicio ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {errExp.inicio && <p className="text-red-500 text-xs mt-0.5">{errExp.inicio}</p>}
                  </div>
                  <input
                    value={formExp.fin}
                    onChange={(e) => setFormExp((f) => ({ ...f, fin: e.target.value }))}
                    placeholder="Año fin" type="number" min="1970" max="2030"
                    disabled={formExp.esActual}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={formExp.esActual}
                    onChange={(e) => setFormExp((f) => ({ ...f, esActual: e.target.checked, fin: e.target.checked ? "" : f.fin }))}
                    className="accent-esmeralda"
                  />
                  <span className="text-sm text-gray-600">Actualmente trabajo aquí</span>
                </label>
                <textarea
                  value={formExp.descripcion}
                  onChange={(e) => setFormExp((f) => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Describe tus funciones o logros (opcional)"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro resize-none"
                />
                <button
                  onClick={agregarExperiencia}
                  className="w-full bg-azul-marino hover:bg-azul-claro text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  + Añadir esta experiencia
                </button>
              </div>
            </div>
          </div>
        </TarjetaSeccion>

        {/* 5. Educación */}
        <TarjetaSeccion
          icono="🎓" titulo="Educación" puntos={15}
          completada={perfil.educaciones.length > 0}
          hint={perfil.educaciones.length > 0
            ? `${perfil.educaciones.length} título${perfil.educaciones.length > 1 ? "s" : ""} registrado${perfil.educaciones.length > 1 ? "s" : ""}`
            : undefined}
          abierta={seccion === "educacion"}
          onToggle={() => toggle("educacion")}
        >
          <div className="space-y-4 pt-1">
            {perfil.educaciones.length > 0 && (
              <div className="space-y-2">
                {perfil.educaciones.map((edu) => (
                  <div key={edu.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-lg mt-0.5 flex-shrink-0">📚</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-azul-marino text-sm">{edu.titulo}</p>
                      <p className="text-gray-500 text-xs">{edu.institucion}{edu.año ? ` · ${edu.año}` : ""}</p>
                    </div>
                    <button
                      onClick={() => quitarEducacion(edu.id)}
                      className="text-gray-300 hover:text-red-400 text-xl leading-none transition-colors flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <p className="text-xs font-semibold text-azul-marino mb-3 uppercase tracking-wide">+ Añadir estudio</p>
              <div className="space-y-2.5">
                <div>
                  <input
                    value={formEdu.titulo}
                    onChange={(e) => { setFormEdu((f) => ({ ...f, titulo: e.target.value })); setErrEdu((er) => ({ ...er, titulo: null })); }}
                    placeholder="Título obtenido *"
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro ${errEdu.titulo ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errEdu.titulo && <p className="text-red-500 text-xs mt-0.5">{errEdu.titulo}</p>}
                </div>
                <div>
                  <input
                    value={formEdu.institucion}
                    onChange={(e) => { setFormEdu((f) => ({ ...f, institucion: e.target.value })); setErrEdu((er) => ({ ...er, institucion: null })); }}
                    placeholder="Universidad / Institución *"
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro ${errEdu.institucion ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errEdu.institucion && <p className="text-red-500 text-xs mt-0.5">{errEdu.institucion}</p>}
                </div>
                <input
                  value={formEdu.año}
                  onChange={(e) => setFormEdu((f) => ({ ...f, año: e.target.value }))}
                  placeholder="Año de grado (opcional)" type="number" min="1970" max="2030"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-azul-claro"
                />
                <button
                  onClick={agregarEducacion}
                  className="w-full bg-azul-marino hover:bg-azul-claro text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  + Añadir estudio
                </button>
              </div>
            </div>
          </div>
        </TarjetaSeccion>

        {/* 6. Hoja de vida PDF */}
        <TarjetaSeccion
          icono="📄" titulo="Hoja de vida PDF" puntos={10}
          completada={!!perfil.cvNombre}
          hint={perfil.cvNombre || undefined}
          abierta={seccion === "cv"}
          onToggle={() => toggle("cv")}
        >
          <div className="pt-1">
            <div
              className="border-2 border-dashed border-gray-200 hover:border-esmeralda rounded-2xl p-7 text-center cursor-pointer transition-colors"
              onClick={() => cvRef.current?.click()}
            >
              {perfil.cvNombre ? (
                <>
                  <div className="text-4xl mb-2">📄</div>
                  <p className="font-semibold text-azul-marino text-sm">{perfil.cvNombre}</p>
                  <p className="text-gray-400 text-xs mt-1">Toca para reemplazar</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">📤</div>
                  <p className="font-semibold text-gray-700 text-sm">Arrastra tu HV o toca para subir</p>
                  <p className="text-gray-400 text-xs mt-1">PDF · máximo 5 MB</p>
                </>
              )}
            </div>
            <input ref={cvRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleCV} />
          </div>
        </TarjetaSeccion>

        {/* 7. Video de presentación */}
        <TarjetaSeccion
          icono="🎥" titulo="Video de presentación" puntos={5} opcional
          completada={!!perfil.videoNombre}
          hint={perfil.videoNombre || undefined}
          abierta={seccion === "video"}
          onToggle={() => toggle("video")}
        >
          <div className="space-y-3 pt-1">
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
              <p className="text-xs text-yellow-800 leading-relaxed">
                💡 <strong>Consejo:</strong> Un video de 30–60 segundos genera hasta 3× más interés de las empresas.
              </p>
            </div>
            <div
              className="border-2 border-dashed border-gray-200 hover:border-esmeralda rounded-2xl p-7 text-center cursor-pointer transition-colors"
              onClick={() => videoRef.current?.click()}
            >
              {perfil.videoNombre ? (
                <>
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="font-semibold text-azul-marino text-sm">{perfil.videoNombre}</p>
                  <p className="text-gray-400 text-xs mt-1">Toca para reemplazar</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">🎥</div>
                  <p className="font-semibold text-gray-700 text-sm">Sube tu video de presentación</p>
                  <p className="text-gray-400 text-xs mt-1">MP4, MOV, WebM · máximo 60 segundos</p>
                </>
              )}
            </div>
            {videoError && <p className="text-red-500 text-sm text-center">{videoError}</p>}
            <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />
          </div>
        </TarjetaSeccion>
      </div>

      {/* ── Botón guardar fijo ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-esmeralda rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {pct}% completado · {100 - pct > 0 ? `+${100 - pct}% disponible` : "¡Perfil completo!"}
            </p>
          </div>
          <button
            onClick={guardarPerfil}
            disabled={guardando}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0 ${
              guardado
                ? "bg-green-500 text-white"
                : "bg-azul-marino hover:bg-azul-claro text-white"
            } disabled:opacity-60`}
          >
            {guardando ? "Guardando..." : guardado ? "✅ Guardado" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
