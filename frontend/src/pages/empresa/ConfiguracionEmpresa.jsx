import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { InputCampo, SelectCampo } from "../../components/common/InputCampo";
import { MUNICIPIOS_COLOMBIA } from "../../config/municipios";
import { DEPARTAMENTO_POR_MUNICIPIO } from "../../config/departamentosColombia";

const TIPOS_EMPRESA = [
  "Clínica", "Hospital", "IPS", "EPS", "Empresa de ambulancias",
  "Laboratorio clínico", "Consultorio médico", "Hogar geriátrico",
  "Farmacia / Droguería", "Otro",
];

const TABS = [
  { key: "perfil",   label: "Perfil de la empresa" },
  { key: "password", label: "Cambiar contraseña" },
  { key: "contacto", label: "Información de contacto" },
];

export default function ConfiguracionEmpresa() {
  const { usuario } = useAuth();
  const logoRef = useRef();

  const [tab, setTab]                   = useState("perfil");
  const [cargando, setCargando]         = useState(true);
  const [guardandoPerfil, setGuardandoPerfil]     = useState(false);
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [guardandoContacto, setGuardandoContacto]  = useState(false);
  const [mensaje, setMensaje]           = useState(null); // { tipo: "ok"|"error", texto }
  const [logoFile, setLogoFile]         = useState(null);
  const [logoPreview, setLogoPreview]   = useState(null);

  const [perfil, setPerfil] = useState({
    nombre: "", nit: "", tipo: "", ciudad: "",
    descripcion: "", sitioWeb: "", logo: null,
  });

  const [contacto, setContacto] = useState({ telefono: "" });

  const [password, setPassword] = useState({
    actual: "", nueva: "", confirmar: "",
  });
  const [erroresPassword, setErroresPassword] = useState({});

  // Cargar perfil real de la empresa desde Supabase
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
            descripcion: data.descripcion    || "",
            sitioWeb:    data.sitio_web      || "",
            logo:        data.logo           || null,
          });
          setContacto({ telefono: data.telefono || "" });
          if (data.logo) setLogoPreview(data.logo);
        }
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [usuario?.id]);

  function mostrarMensaje(tipo, texto) {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 4000);
  }

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── SECCIÓN 1: Perfil de la empresa ─────────────────────────────────────────
  const guardarPerfil = async () => {
    if (!usuario?.id) return;
    setGuardandoPerfil(true);
    try {
      let logoUrl = perfil.logo;

      if (logoFile) {
        const ext  = logoFile.name.split(".").pop();
        const path = `${usuario.id}/logo.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("logos")
          .upload(path, logoFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);
        logoUrl = publicUrl;
        setLogoFile(null);
        setPerfil((p) => ({ ...p, logo: publicUrl }));
        setLogoPreview(publicUrl);
      }

      const { error } = await supabase
        .from("perfiles_empresa")
        .upsert(
          {
            usuario_id:     usuario.id,
            nombre_empresa: perfil.nombre,
            nit:            perfil.nit,
            tipo_empresa:   perfil.tipo,
            ciudad:         perfil.ciudad,
            descripcion:    perfil.descripcion,
            sitio_web:      perfil.sitioWeb,
            logo:           logoUrl,
            updated_at:     new Date().toISOString(),
          },
          { onConflict: "usuario_id" }
        );

      if (error) throw error;
      mostrarMensaje("ok", "Perfil de la empresa actualizado.");
    } catch (e) {
      mostrarMensaje("error", e.message);
    } finally {
      setGuardandoPerfil(false);
    }
  };

  // ── SECCIÓN 2: Cambiar contraseña ───────────────────────────────────────────
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

  // ── SECCIÓN 3: Información de contacto ──────────────────────────────────────
  const guardarContacto = async () => {
    if (!usuario?.id) return;
    setGuardandoContacto(true);
    try {
      const { error } = await supabase
        .from("perfiles_empresa")
        .upsert(
          { usuario_id: usuario.id, telefono: contacto.telefono, updated_at: new Date().toISOString() },
          { onConflict: "usuario_id" }
        );
      if (error) throw error;
      mostrarMensaje("ok", "Información de contacto actualizada.");
    } catch (e) {
      mostrarMensaje("error", e.message);
    } finally {
      setGuardandoContacto(false);
    }
  };

  const departamentoActual = DEPARTAMENTO_POR_MUNICIPIO[perfil.ciudad] || "";

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
          Gestiona los datos de tu empresa, tu contraseña y tu información de contacto.
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

      {/* Mensaje de resultado */}
      {mensaje && (
        <div className={`rounded-xl px-4 py-3 mb-5 text-sm font-semibold ${
          mensaje.tipo === "ok"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {mensaje.tipo === "ok" ? "✅ " : "❌ "}{mensaje.texto}
        </div>
      )}

      {/* ── SECCIÓN 1: Perfil de la empresa ── */}
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
            <SelectCampo
              label="Tipo de empresa"
              value={perfil.tipo}
              onChange={(e) => setPerfil((p) => ({ ...p, tipo: e.target.value }))}
            >
              <option value="">Selecciona el tipo</option>
              {TIPOS_EMPRESA.map((t) => <option key={t} value={t}>{t}</option>)}
            </SelectCampo>
            <div>
              <SelectCampo
                label="Ciudad"
                value={perfil.ciudad}
                onChange={(e) => setPerfil((p) => ({ ...p, ciudad: e.target.value }))}
              >
                <option value="">Selecciona la ciudad</option>
                {MUNICIPIOS_COLOMBIA.map((c) => <option key={c} value={c}>{c}</option>)}
              </SelectCampo>
            </div>
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">Departamento</label>
              <input
                value={departamentoActual}
                readOnly
                placeholder="Se completa según la ciudad"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2">
              <InputCampo
                label="Sitio web (opcional)"
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
            disabled={guardandoPerfil}
            className="btn-secundario mt-5 py-3 px-6 text-sm disabled:opacity-50"
          >
            {guardandoPerfil ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}

      {/* ── SECCIÓN 2: Cambiar contraseña ── */}
      {tab === "password" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-azul-marino mb-5">Cambiar contraseña</h2>
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
            className="btn-secundario mt-5 py-3 px-6 text-sm disabled:opacity-50"
          >
            {guardandoPassword ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </div>
      )}

      {/* ── SECCIÓN 3: Información de contacto ── */}
      {tab === "contacto" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-azul-marino mb-5">Información de contacto</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Email de contacto
              </label>
              <input
                value={usuario?.email || ""}
                readOnly
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed"
              />
              <p className="text-gray-400 text-xs mt-1">
                El email no se puede cambiar desde aquí. Es el correo con el que iniciaste sesión.
              </p>
            </div>
            <InputCampo
              label="Teléfono de contacto"
              value={contacto.telefono}
              onChange={(e) => setContacto((p) => ({ ...p, telefono: e.target.value }))}
              placeholder="3XX XXX XXXX"
            />
          </div>
          <button
            onClick={guardarContacto}
            disabled={guardandoContacto}
            className="btn-secundario mt-5 py-3 px-6 text-sm disabled:opacity-50"
          >
            {guardandoContacto ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}
    </div>
  );
}
