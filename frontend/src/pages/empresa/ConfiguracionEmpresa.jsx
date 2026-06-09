import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { InputCampo, SelectCampo } from "../../components/common/InputCampo";
import { REGION } from "../../config/region";

const TIPOS_EMPRESA = [
  "Clínica", "Hospital", "IPS", "EPS", "Empresa de ambulancias",
  "Laboratorio clínico", "Consultorio médico", "Hogar geriátrico",
  "Farmacia / Droguería", "Otro",
];

export default function ConfiguracionEmpresa() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const logoRef  = useRef();

  const [tab, setTab]                       = useState("perfil");
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [guardado, setGuardado]             = useState(false);
  const [cargando, setCargando]             = useState(true);
  const [guardando, setGuardando]           = useState(false);
  const [errorGuardar, setErrorGuardar]     = useState(null);
  const [logoFile, setLogoFile]             = useState(null);
  const [logoPreview, setLogoPreview]       = useState(null);

  const [perfil, setPerfil] = useState({
    nombre: "", nit: "", tipo: "", ciudad: "",
    telefono: "", descripcion: "", sitioWeb: "", logo: null,
  });

  const [acceso, setAcceso] = useState({
    passwordActual: "", passwordNuevo: "", confirmarPassword: "",
  });
  const [erroresAcceso, setErroresAcceso] = useState({});

  const [notis, setNotis] = useState({
    nuevosPostulados: true, recordatorioOfertas: true, novedades: false,
  });

  // Cargar perfil de empresa desde Supabase al montar
  useEffect(() => {
    if (!usuario?.id) { setCargando(false); return; }
    supabase
      .from("perfiles_empresa")
      .select("*")
      .eq("usuario_id", usuario.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setPerfil({
            nombre:      data.nombre_empresa || "",
            nit:         data.nit            || "",
            tipo:        data.tipo_empresa   || "",
            ciudad:      data.ciudad         || "",
            telefono:    data.telefono       || "",
            descripcion: data.descripcion    || "",
            sitioWeb:    data.sitio_web      || "",
            logo:        data.logo           || null,
          });
          if (data.logo) setLogoPreview(data.logo);
        }
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [usuario?.id]);

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const guardarPerfil = async () => {
    if (!usuario?.id) return;
    setGuardando(true);
    setErrorGuardar(null);
    try {
      let logoUrl = perfil.logo;

      // Subir nuevo logo si fue seleccionado
      if (logoFile) {
        const ext  = logoFile.name.split(".").pop();
        const path = `${usuario.id}/logo.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("logos")
          .upload(path, logoFile, { upsert: true });
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);
          logoUrl = publicUrl;
          setLogoFile(null);
          setPerfil((p) => ({ ...p, logo: publicUrl }));
          setLogoPreview(publicUrl);
        }
      }

      const { error } = await supabase
        .from("perfiles_empresa")
        .upsert(
          {
            usuario_id:    usuario.id,
            nombre_empresa: perfil.nombre,
            nit:           perfil.nit,
            tipo_empresa:  perfil.tipo,
            ciudad:        perfil.ciudad,
            telefono:      perfil.telefono,
            descripcion:   perfil.descripcion,
            sitio_web:     perfil.sitioWeb,
            logo:          logoUrl,
            updated_at:    new Date().toISOString(),
          },
          { onConflict: "usuario_id" }
        );

      if (error) throw error;
      mostrarGuardado();
    } catch (e) {
      setErrorGuardar(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const guardarAcceso = async () => {
    const err = {};
    if (!acceso.passwordActual)      err.passwordActual     = "Ingresa tu contraseña actual.";
    if (acceso.passwordNuevo && acceso.passwordNuevo.length < 8)
                                      err.passwordNuevo     = "Mínimo 8 caracteres.";
    if (acceso.passwordNuevo && acceso.passwordNuevo !== acceso.confirmarPassword)
                                      err.confirmarPassword = "Las contraseñas no coinciden.";
    if (Object.keys(err).length) { setErroresAcceso(err); return; }
    setErroresAcceso({});
    setGuardando(true);
    try {
      if (acceso.passwordNuevo) {
        const { error } = await supabase.auth.updateUser({ password: acceso.passwordNuevo });
        if (error) throw error;
      }
      setAcceso({ passwordActual: "", passwordNuevo: "", confirmarPassword: "" });
      mostrarGuardado();
    } catch (e) {
      setErroresAcceso({ passwordActual: e.message });
    } finally {
      setGuardando(false);
    }
  };

  const mostrarGuardado = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  const manejarLogout = () => { logout(); navigate("/"); };

  const TABS = [
    { key: "perfil",         label: "Perfil de empresa" },
    { key: "acceso",         label: "Acceso y seguridad" },
    { key: "notificaciones", label: "Notificaciones" },
  ];

  if (cargando) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestiona los datos de tu empresa y las preferencias de la cuenta.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-white text-azul-marino shadow-sm"
                : "text-gray-500 hover:text-azul-marino"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Alertas */}
      {guardado && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 text-green-700 text-sm font-semibold">
          ✅ Cambios guardados correctamente.
        </div>
      )}
      {errorGuardar && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-700 text-sm">
          ❌ {errorGuardar}
        </div>
      )}

      {/* ── TAB: Perfil de empresa ── */}
      {tab === "perfil" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
            <div
              className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => logoRef.current?.click()}
            >
              {logoPreview
                ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                : "🏥"}
            </div>
            <div>
              <p className="font-semibold text-azul-marino text-sm">Logo de la empresa</p>
              <p className="text-gray-400 text-xs mt-0.5">PNG o JPG · Máximo 2 MB</p>
              <button
                className="mt-2 text-xs text-esmeralda font-semibold hover:underline"
                onClick={() => logoRef.current?.click()}
              >
                {logoPreview ? "Cambiar logo" : "Subir logo"}
              </button>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InputCampo
                label="Nombre de la empresa"
                value={perfil.nombre}
                onChange={(e) => setPerfil((p) => ({ ...p, nombre: e.target.value }))}
                placeholder="Nombre de la institución"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">NIT</label>
              <input
                value={perfil.nit}
                onChange={(e) => setPerfil((p) => ({ ...p, nit: e.target.value }))}
                placeholder="900123456-7"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-esmeralda"
              />
            </div>
            <InputCampo
              label="Teléfono de contacto"
              value={perfil.telefono}
              onChange={(e) => setPerfil((p) => ({ ...p, telefono: e.target.value }))}
            />
            <SelectCampo
              label="Tipo de empresa"
              value={perfil.tipo}
              onChange={(e) => setPerfil((p) => ({ ...p, tipo: e.target.value }))}
            >
              <option value="">Selecciona el tipo</option>
              {TIPOS_EMPRESA.map((t) => <option key={t} value={t}>{t}</option>)}
            </SelectCampo>
            <SelectCampo
              label="Ciudad"
              value={perfil.ciudad}
              onChange={(e) => setPerfil((p) => ({ ...p, ciudad: e.target.value }))}
            >
              <option value="">Selecciona la ciudad</option>
              {REGION.ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectCampo>
            <div className="md:col-span-2">
              <InputCampo
                label="Sitio web"
                value={perfil.sitioWeb}
                onChange={(e) => setPerfil((p) => ({ ...p, sitioWeb: e.target.value }))}
                placeholder="www.ejemplo.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Descripción de la empresa
              </label>
              <textarea
                value={perfil.descripcion}
                onChange={(e) => setPerfil((p) => ({ ...p, descripcion: e.target.value }))}
                rows={4}
                placeholder="Cuéntales a los candidatos sobre tu empresa, misión y cultura..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-esmeralda resize-none"
              />
            </div>
          </div>
          <button
            onClick={guardarPerfil}
            disabled={guardando}
            className="btn-secundario mt-5 py-3 px-6 text-sm disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios del perfil"}
          </button>
        </div>
      )}

      {/* ── TAB: Acceso y seguridad ── */}
      {tab === "acceso" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-azul-marino mb-1">Cambiar contraseña</h2>
          <p className="text-gray-400 text-sm mb-5">
            Correo actual: <strong>{usuario?.email}</strong>
          </p>
          <div className="space-y-4">
            <InputCampo
              label="Contraseña actual"
              type="password"
              value={acceso.passwordActual}
              onChange={(e) => setAcceso((p) => ({ ...p, passwordActual: e.target.value }))}
              error={erroresAcceso.passwordActual}
            />
            <InputCampo
              label="Nueva contraseña (opcional)"
              type="password"
              value={acceso.passwordNuevo}
              onChange={(e) => setAcceso((p) => ({ ...p, passwordNuevo: e.target.value }))}
              error={erroresAcceso.passwordNuevo}
              placeholder="Mínimo 8 caracteres"
            />
            <InputCampo
              label="Confirmar nueva contraseña"
              type="password"
              value={acceso.confirmarPassword}
              onChange={(e) => setAcceso((p) => ({ ...p, confirmarPassword: e.target.value }))}
              error={erroresAcceso.confirmarPassword}
              placeholder="Repite la contraseña"
            />
          </div>
          <button
            onClick={guardarAcceso}
            disabled={guardando}
            className="btn-secundario mt-5 py-3 px-6 text-sm disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}

      {/* ── TAB: Notificaciones ── */}
      {tab === "notificaciones" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-azul-marino mb-5">Notificaciones por correo</h2>
          <div className="space-y-4">
            {[
              { key: "nuevosPostulados",    label: "Nuevos candidatos postulados a mis ofertas" },
              { key: "recordatorioOfertas", label: "Recordatorio de ofertas próximas a vencer" },
              { key: "novedades",           label: "Novedades y consejos de MedApply" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">{label}</span>
                <div
                  onClick={() => setNotis((p) => ({ ...p, [key]: !p[key] }))}
                  className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${
                    notis[key] ? "bg-esmeralda" : "bg-gray-200"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notis[key] ? "translate-x-5" : ""
                  }`} />
                </div>
              </label>
            ))}
          </div>
          <button onClick={mostrarGuardado} className="btn-secundario mt-6 py-3 px-6 text-sm">
            Guardar preferencias
          </button>
        </div>
      )}

      {/* Zona de riesgo */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm mt-5">
        <h2 className="text-lg font-bold text-red-600 mb-2">Zona de riesgo</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={manejarLogout}
            className="px-5 py-2 text-sm border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
          >
            Cerrar sesión
          </button>
          {!confirmarEliminar ? (
            <button
              onClick={() => setConfirmarEliminar(true)}
              className="px-5 py-2 text-sm border border-red-300 rounded-xl text-red-600 hover:bg-red-50"
            >
              Eliminar cuenta de empresa
            </button>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-red-600 font-semibold">¿Eliminar cuenta y todas las ofertas?</p>
              <button className="px-4 py-2 text-xs bg-red-600 text-white rounded-xl">Sí, eliminar</button>
              <button
                onClick={() => setConfirmarEliminar(false)}
                className="px-4 py-2 text-xs border border-gray-300 rounded-xl"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
