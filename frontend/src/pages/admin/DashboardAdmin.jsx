import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

const COLOR_ROL = {
  candidato:  "bg-blue-100 text-blue-700",
  empresa:    "bg-teal-100 text-teal-700",
  moderador:  "bg-purple-100 text-purple-700",
  admin:      "bg-orange-100 text-orange-700",
  superadmin: "bg-yellow-100 text-yellow-700",
};
const COLOR_PLAN = {
  premium: "bg-esmeralda text-white", basico: "bg-blue-100 text-blue-700",
  gratuito: "bg-gray-100 text-gray-500", destacado: "bg-yellow-100 text-yellow-700",
};
const LABEL_PLAN_ADMIN = { premium: "Premium", basico: "Básico", gratuito: "Gratuito", destacado: "Destacado" };
const COLOR_PAGO = {
  activo: "bg-green-100 text-green-700", vencido: "bg-red-100 text-red-600", pendiente: "bg-yellow-100 text-yellow-700",
};

function BarraPlan({ label, cantidad, total, color }) {
  const pct = total > 0 ? Math.round((cantidad / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="font-semibold text-azul-marino">{cantidad} ({pct}%)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardAdmin() {
  const { tienePermiso, usuario } = useAuth();
  const esSuperAdmin = usuario?.rol === "superadmin";

  const [stats, setStats]                     = useState({ candidatos: 0, empresas: 0, ofertas: 0, ingresos: 0 });
  const [planesEmpresas, setPlanesEmpresas]   = useState({ gratuito: 0, basico: 0, premium: 0 });
  const [usuariosRecientes, setUsuariosRecientes] = useState([]);
  const [empresasRecientes, setEmpresasRecientes] = useState([]);
  const [pagosRecientes, setPagosRecientes]   = useState([]);
  const [cargando, setCargando]               = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

        const [
          { count: candidatos },
          { count: empresas },
          { count: ofertas },
          { data: suscripciones },
          { data: ultimosCandidatos },
          { data: ultimasEmpresas },
          { data: ultimosPagos },
          { data: planesData },
        ] = await Promise.all([
          supabase.from("perfiles_candidato").select("*", { count: "exact", head: true }),
          supabase.from("perfiles_empresa").select("*", { count: "exact", head: true }),
          supabase.from("ofertas").select("*", { count: "exact", head: true }).eq("estado", "activa"),
          supabase.from("suscripciones").select("precio").eq("activo", true).gte("fecha_inicio", primerDiaMes),
          supabase.from("usuarios").select("id, nombre, email, rol, created_at")
            .eq("rol", "candidato").order("created_at", { ascending: false }).limit(5),
          supabase.from("perfiles_empresa").select("nombre_empresa, ciudad, plan, usuario_id, usuarios!inner(created_at)")
            .order("usuarios(created_at)", { ascending: false }).limit(5),
          supabase.from("suscripciones").select("id, plan, precio, activo, created_at, usuarios!inner(nombre, rol)")
            .order("created_at", { ascending: false }).limit(5),
          supabase.from("perfiles_empresa").select("plan"),
        ]);

        const ingresos = (suscripciones || []).reduce((s, r) => s + (r.precio || 0), 0);

        const planes = { gratuito: 0, basico: 0, premium: 0 };
        (planesData || []).forEach((e) => { if (e.plan in planes) planes[e.plan]++; });

        setStats({ candidatos: candidatos ?? 0, empresas: empresas ?? 0, ofertas: ofertas ?? 0, ingresos });
        setPlanesEmpresas(planes);
        setUsuariosRecientes(ultimosCandidatos || []);
        setEmpresasRecientes(ultimasEmpresas || []);
        setPagosRecientes(ultimosPagos || []);
      } catch (e) {
        console.error("DashboardAdmin:", e);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const statsCards = [
    { label: "Total candidatos", valor: stats.candidatos, icono: "👤", color: "bg-blue-50 border-blue-100",    texto: "text-blue-700",   permiso: null },
    { label: "Empresas activas", valor: stats.empresas,   icono: "🏥", color: "bg-green-50 border-green-100",  texto: "text-green-700",  permiso: null },
    { label: "Ofertas activas",  valor: stats.ofertas,    icono: "📋", color: "bg-purple-50 border-purple-100", texto: "text-purple-700", permiso: null },
    { label: "Ingresos del mes", valor: `$${stats.ingresos.toLocaleString("es-CO")}`, icono: "💰",
      color: "bg-yellow-50 border-yellow-100", texto: "text-yellow-700", permiso: "ver_pagos" },
  ].filter((s) => !s.permiso || tienePermiso(s.permiso));

  const totalEmpresas = planesEmpresas.premium + planesEmpresas.basico + planesEmpresas.gratuito;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-marino">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen general de la plataforma MedApply.</p>
        </div>
        {esSuperAdmin && (
          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full">
            👑 Super Admin
          </span>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cargando
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-5 bg-gray-50 animate-pulse h-28" />
            ))
          : statsCards.map((s) => (
              <div key={s.label} className={`rounded-2xl border p-5 ${s.color}`}>
                <div className="text-2xl mb-2">{s.icono}</div>
                <p className={`text-3xl font-bold ${s.texto}`}>{s.valor}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))
        }
      </div>

      {/* Distribución de planes */}
      {!cargando && totalEmpresas > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm max-w-md">
          <h3 className="font-bold text-azul-marino mb-4">Distribución de planes — Empresas</h3>
          <BarraPlan label="Premium"  cantidad={planesEmpresas.premium}  total={totalEmpresas} color="bg-esmeralda" />
          <BarraPlan label="Básico"   cantidad={planesEmpresas.basico}   total={totalEmpresas} color="bg-blue-400"  />
          <BarraPlan label="Gratuito" cantidad={planesEmpresas.gratuito} total={totalEmpresas} color="bg-gray-300"  />
        </div>
      )}

      {/* Candidatos recientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-azul-marino">Candidatos recientes</h3>
          <Link to="/admin/usuarios" className="text-esmeralda text-xs font-semibold hover:underline">Ver todos →</Link>
        </div>
        {cargando ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : usuariosRecientes.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-sm">Aún no hay usuarios registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">Candidato</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Rol</th>
                  <th className="px-5 py-3 text-right font-semibold text-azul-marino hidden md:table-cell">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuariosRecientes.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-azul-marino">{u.nombre}</p>
                      <p className="text-gray-400 text-xs">{u.email}</p>
                    </td>
                    <td className="px-5 py-3 text-center hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_ROL[u.rol] || "bg-gray-100 text-gray-500"}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400 text-xs hidden md:table-cell">
                      {new Date(u.created_at).toLocaleDateString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Empresas recientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-azul-marino">Empresas recientes</h3>
          <Link to="/admin/empresas" className="text-esmeralda text-xs font-semibold hover:underline">Ver todas →</Link>
        </div>
        {cargando ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : empresasRecientes.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-3xl mb-2">🏥</p>
            <p className="text-sm">Aún no hay empresas registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">Empresa</th>
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden md:table-cell">Ciudad</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {empresasRecientes.map((e, i) => (
                  <tr key={e.usuario_id || i} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-azul-marino">{e.nombre_empresa}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{e.ciudad || "—"}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_PLAN[e.plan] || "bg-gray-100 text-gray-500"}`}>
                        {LABEL_PLAN_ADMIN[e.plan] || "Gratuito"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagos recientes — solo superadmin */}
      {tienePermiso("ver_pagos") && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-azul-marino">Suscripciones recientes</h3>
            <Link to="/admin/suscripciones" className="text-esmeralda text-xs font-semibold hover:underline">Ver todas →</Link>
          </div>
          {cargando ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : pagosRecientes.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-3xl mb-2">💰</p>
              <p className="text-sm">Aún no hay suscripciones registradas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-5 py-3 text-left font-semibold text-azul-marino">Usuario</th>
                    <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
                    <th className="px-5 py-3 text-right font-semibold text-azul-marino">Monto</th>
                    <th className="px-5 py-3 text-center font-semibold text-azul-marino hidden sm:table-cell">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pagosRecientes.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-azul-marino">{p.usuarios?.nombre || "—"}</p>
                        <p className="text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString("es-CO")}</p>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_PLAN[p.plan] || "bg-gray-100 text-gray-500"}`}>
                          {LABEL_PLAN_ADMIN[p.plan] || p.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-azul-marino">
                        ${(p.precio || 0).toLocaleString("es-CO")}
                      </td>
                      <td className="px-5 py-3 text-center hidden sm:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_PAGO[p.activo ? "activo" : "vencido"]}`}>
                          {p.activo ? "Activo" : "Vencido"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
