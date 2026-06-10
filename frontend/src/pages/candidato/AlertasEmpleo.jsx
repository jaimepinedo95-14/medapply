import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { CATEGORIAS_FILTRO, CIUDADES_FILTRO, TIPOS_CONTRATO_FILTRO } from "../../data/ofertasDemo";

const FRECUENCIAS = [
  { value: "diaria",  label: "Diaria",  desc: "Recibes un resumen cada día" },
  { value: "semanal", label: "Semanal", desc: "Recibes un resumen cada lunes" },
];

function etiquetaAlerta(alerta) {
  const partes = [alerta.categoria, alerta.ciudad, alerta.tipo_contrato].filter(Boolean);
  return partes.length > 0 ? partes.join(" · ") : "Todas las ofertas";
}

export default function AlertasEmpleo() {
  const { usuario } = useAuth();

  const [alertas, setAlertas]       = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [guardando, setGuardando]   = useState(false);
  const [eliminando, setEliminando] = useState(null);
  const [error, setError]           = useState("");
  const [exito, setExito]           = useState("");

  const [form, setForm] = useState({
    categoria:     "",
    ciudad:        "",
    tipo_contrato: "",
    frecuencia:    "semanal",
  });

  useEffect(() => { cargar(); }, [usuario?.id]);

  async function cargar() {
    if (!usuario?.id) return;
    setCargando(true);
    const { data } = await supabase
      .from("alertas_empleo")
      .select("*")
      .eq("candidato_id", usuario.id)
      .order("created_at", { ascending: false });
    setAlertas(data || []);
    setCargando(false);
  }

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function crearAlerta(e) {
    e.preventDefault();
    if (!form.categoria && !form.ciudad && !form.tipo_contrato) {
      setError("Selecciona al menos una categoría, ciudad o tipo de contrato.");
      return;
    }
    setGuardando(true);
    setError("");
    const { error: err } = await supabase.from("alertas_empleo").insert({
      candidato_id:  usuario.id,
      categoria:     form.categoria  || null,
      ciudad:        form.ciudad     || null,
      tipo_contrato: form.tipo_contrato || null,
      frecuencia:    form.frecuencia,
    });
    if (err) {
      setError(err.message);
    } else {
      setExito("¡Alerta creada! Te avisaremos cuando haya nuevas ofertas.");
      setForm({ categoria: "", ciudad: "", tipo_contrato: "", frecuencia: "semanal" });
      await cargar();
      setTimeout(() => setExito(""), 4000);
    }
    setGuardando(false);
  }

  async function eliminarAlerta(id) {
    setEliminando(id);
    await supabase.from("alertas_empleo").delete().eq("id", id);
    setAlertas((prev) => prev.filter((a) => a.id !== id));
    setEliminando(null);
  }

  async function toggleActiva(alerta) {
    await supabase
      .from("alertas_empleo")
      .update({ activa: !alerta.activa })
      .eq("id", alerta.id);
    setAlertas((prev) =>
      prev.map((a) => a.id === alerta.id ? { ...a, activa: !a.activa } : a)
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-azul-marino">Alertas de empleo</h1>
        <p className="text-gray-500 text-sm mt-1">
          Te avisamos por email cuando aparezcan nuevas ofertas que coincidan con tu búsqueda.
        </p>
      </div>

      {/* Toasts */}
      {exito && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <span>✅</span>{exito}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <span>⚠️</span>{error}
        </div>
      )}

      {/* Formulario nueva alerta */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-azul-marino mb-4">Nueva alerta</h2>
        <form onSubmit={crearAlerta} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Categoría profesional
              </label>
              <select name="categoria" value={form.categoria} onChange={cambiar}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-azul-claro bg-white">
                <option value="">Cualquiera</option>
                {CATEGORIAS_FILTRO.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Ciudad
              </label>
              <select name="ciudad" value={form.ciudad} onChange={cambiar}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-azul-claro bg-white">
                <option value="">Cualquiera</option>
                {CIUDADES_FILTRO.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Tipo de contrato
              </label>
              <select name="tipo_contrato" value={form.tipo_contrato} onChange={cambiar}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-azul-claro bg-white">
                <option value="">Cualquiera</option>
                {TIPOS_CONTRATO_FILTRO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Frecuencia del email
            </label>
            <div className="flex gap-3">
              {FRECUENCIAS.map((f) => (
                <label key={f.value}
                  className={`flex-1 flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                    form.frecuencia === f.value
                      ? "border-azul-marino bg-azul-marino/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <input type="radio" name="frecuencia" value={f.value}
                    checked={form.frecuencia === f.value} onChange={cambiar}
                    className="accent-azul-marino" />
                  <div>
                    <p className="text-sm font-semibold text-azul-marino">{f.label}</p>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={guardando}
            className="w-full bg-esmeralda hover:bg-esmeralda-hover text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm">
            {guardando ? "Guardando..." : "🔔 Crear alerta"}
          </button>
        </form>
      </div>

      {/* Lista de alertas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-azul-marino">
            Mis alertas activas{alertas.length > 0 && <span className="ml-2 text-sm text-gray-400 font-normal">({alertas.length})</span>}
          </h2>
        </div>

        {cargando ? (
          <div className="p-6 space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : alertas.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">🔔</p>
            <p className="text-sm">No tienes alertas todavía.</p>
            <p className="text-xs mt-1">Crea una arriba para empezar a recibir notificaciones.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {alertas.map((alerta) => (
              <li key={alerta.id} className="px-6 py-4 flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${alerta.activa ? "bg-esmeralda" : "bg-gray-300"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-azul-marino truncate">
                    {etiquetaAlerta(alerta)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Email {alerta.frecuencia} · {alerta.activa ? "Activa" : "Pausada"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActiva(alerta)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      alerta.activa
                        ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                    title={alerta.activa ? "Pausar alerta" : "Reactivar alerta"}
                  >
                    {alerta.activa ? "Pausar" : "Activar"}
                  </button>
                  <button
                    onClick={() => eliminarAlerta(alerta.id)}
                    disabled={eliminando === alerta.id}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                    title="Eliminar alerta"
                  >
                    {eliminando === alerta.id ? "..." : "Eliminar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
        <p className="text-xs text-azul-marino leading-relaxed">
          Los emails se envían a <strong>{usuario?.email}</strong>.
          Puedes pausar o eliminar cualquier alerta en cualquier momento.
        </p>
        <Link to="/empleos" className="inline-block mt-2 text-xs text-esmeralda font-semibold hover:underline">
          Explorar ofertas disponibles →
        </Link>
      </div>
    </div>
  );
}
