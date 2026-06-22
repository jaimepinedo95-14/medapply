import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { PLANES_INFO, ORDEN_PLAN, LABEL_PLAN, LIMITE_VACANTES, formatPrecioPlan } from "../../config/planesEmpresa";

export default function MiPlan() {
  const { usuario } = useAuth();

  const [plan, setPlan]               = useState("gratuito");
  const [vacantesActivas, setVacantesActivas] = useState(0);
  const [fechaRenovacion, setFechaRenovacion]   = useState(null);
  const [cargando, setCargando]       = useState(true);
  const [mensaje, setMensaje]         = useState("");

  useEffect(() => {
    if (!usuario?.id) return;
    cargar();
  }, [usuario?.id]);

  async function cargar() {
    try {
      const [{ data: perfilEmpresa }, { data: ofertas }, { data: suscripcion }] = await Promise.all([
        supabase.from("perfiles_empresa").select("plan").eq("usuario_id", usuario.id).maybeSingle(),
        supabase.from("ofertas").select("id").eq("empresa_id", usuario.id).eq("estado", "activa"),
        supabase
          .from("suscripciones")
          .select("fecha_fin")
          .eq("usuario_id", usuario.id)
          .eq("activo", true)
          .order("fecha_inicio", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setPlan(perfilEmpresa?.plan || "gratuito");
      setVacantesActivas((ofertas || []).length);
      setFechaRenovacion(suscripcion?.fecha_fin || null);
    } catch (_) {
      // silencioso
    } finally {
      setCargando(false);
    }
  }

  function mejorarPlan() {
    setMensaje("Próximamente — escríbenos a hola@medapply.co");
    setTimeout(() => setMensaje(""), 5000);
  }

  const limite = LIMITE_VACANTES[plan] ?? 1;
  const limiteLabel = Number.isFinite(limite) ? limite : "∞";
  const indiceActual = ORDEN_PLAN.indexOf(plan);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Mi plan</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona tu plan de suscripción y compara beneficios.</p>
      </div>

      {/* Plan actual */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        {cargando ? (
          <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1">Plan actual</p>
              <p className="text-2xl font-bold text-azul-marino">{LABEL_PLAN[plan]}</p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1">Vacantes</p>
                <p className="text-lg font-bold text-azul-marino">{vacantesActivas} / {limiteLabel}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-1">Renovación</p>
                <p className="text-lg font-bold text-azul-marino">
                  {fechaRenovacion
                    ? new Date(fechaRenovacion).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
                    : "No aplica"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {mensaje && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 mb-6 text-center text-sm text-azul-marino font-semibold">
          {mensaje}
        </div>
      )}

      {/* Comparativa de planes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {PLANES_INFO.map((p, i) => {
          const esActual = p.key === plan;
          const esSuperior = i > indiceActual;
          return (
            <div key={p.key} className={`bg-white rounded-2xl border p-5 relative flex flex-col ${
              esActual ? "border-esmeralda ring-2 ring-esmeralda" : "border-gray-200"
            }`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {p.badge}
                </span>
              )}
              <h3 className="text-lg font-bold text-azul-marino mt-2">{p.nombre}</h3>
              <div className="my-3">
                <span className="text-2xl font-bold text-azul-marino">{formatPrecioPlan(p.precio)}</span>
                <span className="text-gray-400 text-xs"> COP/mes</span>
              </div>
              <p className="text-sm font-semibold text-esmeralda mb-3">{p.vacantesLabel}</p>
              <ul className="space-y-1.5 mb-5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-esmeralda mt-0.5 flex-shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              {esActual ? (
                <button disabled className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed">
                  Plan actual
                </button>
              ) : esSuperior ? (
                <button onClick={mejorarPlan} className="w-full py-2.5 text-sm font-semibold rounded-xl bg-azul-marino hover:bg-azul-hover text-white transition-colors">
                  Mejorar plan
                </button>
              ) : (
                <button disabled className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gray-50 text-gray-300 cursor-not-allowed">
                  Plan inferior
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-gray-400 text-xs mt-6">
        Todos los planes incluyen factura electrónica. Puedes cancelar en cualquier momento.
      </p>
    </div>
  );
}
