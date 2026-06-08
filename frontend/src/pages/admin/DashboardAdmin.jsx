// Dashboard administrativo — ingresos visibles solo para superadmin
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const STATS_BASE = [
  { label: "Total candidatos", valor: "1.248", variacion: "+12 este mes", icono: "👤", color: "bg-blue-50 border-blue-100",   texto: "text-blue-700",   permiso: null },
  { label: "Empresas activas", valor: "87",    variacion: "+3 este mes",  icono: "🏥", color: "bg-green-50 border-green-100", texto: "text-green-700",  permiso: null },
  { label: "Ofertas activas",  valor: "312",   variacion: "+28 este mes", icono: "📋", color: "bg-purple-50 border-purple-100",texto: "text-purple-700", permiso: null },
  { label: "Ingresos del mes", valor: "$4.3M", variacion: "+8% vs. mayo", icono: "💰", color: "bg-yellow-50 border-yellow-100",texto: "text-yellow-700", permiso: "ver_pagos" },
];

const USUARIOS_RECIENTES = [
  { nombre: "María García",   email: "m.garcia@gmail.com",  categoria: "Médico General",      ciudad: "Bogotá",       plan: "Destacado", estado: "Activo" },
  { nombre: "Carlos Ruiz",    email: "c.ruiz@correo.co",    categoria: "Bacteriólogo",         ciudad: "Medellín",     plan: "Gratuito",  estado: "Activo" },
  { nombre: "Lucía Martínez", email: "lucia.m@gmail.com",   categoria: "Enfermera",            ciudad: "Cali",         plan: "Destacado", estado: "Activo" },
  { nombre: "Andrés Vargas",  email: "a.vargas@med.co",     categoria: "Médico Especialista",  ciudad: "Bogotá",       plan: "Gratuito",  estado: "Activo" },
  { nombre: "Sofía Rodríguez",email: "sofia.r@hotmail.com", categoria: "Aux. Enfermería",      ciudad: "Barranquilla", plan: "Gratuito",  estado: "Activo" },
];

const EMPRESAS_RECIENTES = [
  { nombre: "Clínica San Rafael",       nit: "800200543-2", ciudad: "Bogotá",   plan: "Premium",  ofertas: 4 },
  { nombre: "Hospital Univ. del Norte", nit: "890107487-1", ciudad: "B/quilla", plan: "Básico",   ofertas: 2 },
  { nombre: "IPS Salud Total",          nit: "830019309-3", ciudad: "B/quilla", plan: "Gratuito", ofertas: 1 },
  { nombre: "Lab. Clínico Baxter",      nit: "860068964-4", ciudad: "Bogotá",   plan: "Básico",   ofertas: 2 },
  { nombre: "Cruz Roja Colombiana",     nit: "899999128-1", ciudad: "Bogotá",   plan: "Premium",  ofertas: 3 },
];

const PAGOS_RECIENTES = [
  { id: "TXN-001", usuario: "Clínica San Rafael",     tipo: "Empresa",   plan: "Premium",   monto: 159900, fecha: "2026-06-07", estado: "Pagado" },
  { id: "TXN-002", usuario: "María Sofía Ruiz",       tipo: "Candidato", plan: "Destacado", monto:   9900, fecha: "2026-06-07", estado: "Pagado" },
  { id: "TXN-003", usuario: "EPS Sanitas",            tipo: "Empresa",   plan: "Premium",   monto: 159900, fecha: "2026-06-06", estado: "Pagado" },
  { id: "TXN-004", usuario: "Hospital Universitario", tipo: "Empresa",   plan: "Básico",    monto:  79900, fecha: "2026-06-06", estado: "Pagado" },
  { id: "TXN-005", usuario: "Paola Castro",           tipo: "Candidato", plan: "Destacado", monto:   9900, fecha: "2026-06-05", estado: "Pendiente" },
];

const COLOR_PLAN = {
  Premium: "bg-esmeralda text-white", Básico: "bg-blue-100 text-blue-700",
  Gratuito: "bg-gray-100 text-gray-500", Destacado: "bg-yellow-100 text-yellow-700",
};
const COLOR_PAGO = {
  Pagado: "bg-green-100 text-green-700", Pendiente: "bg-yellow-100 text-yellow-700", Fallido: "bg-red-100 text-red-600",
};

function BarraPlan({ label, cantidad, total, color }) {
  const pct = Math.round((cantidad / total) * 100);
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

  const stats = STATS_BASE.filter((s) => !s.permiso || tienePermiso(s.permiso));

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
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icono}</div>
            <p className={`text-3xl font-bold ${s.texto}`}>{s.valor}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.variacion}</p>
          </div>
        ))}
      </div>

      {/* Distribución de planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-azul-marino mb-4">Distribución de planes — Empresas</h3>
          <BarraPlan label="Premium"  cantidad={23} total={87} color="bg-esmeralda" />
          <BarraPlan label="Básico"   cantidad={31} total={87} color="bg-blue-400"  />
          <BarraPlan label="Gratuito" cantidad={33} total={87} color="bg-gray-300"  />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-azul-marino mb-4">Distribución de planes — Candidatos</h3>
          <BarraPlan label="Destacado" cantidad={187} total={1248} color="bg-yellow-400" />
          <BarraPlan label="Gratuito"  cantidad={1061} total={1248} color="bg-gray-300" />
        </div>
      </div>

      {/* Tabla de usuarios recientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-azul-marino">Candidatos recientes</h3>
          <Link to="/admin/usuarios" className="text-esmeralda text-xs font-semibold hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left font-semibold text-azul-marino">Candidato</th>
                <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden md:table-cell">Categoría</th>
                <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden lg:table-cell">Ciudad</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {USUARIOS_RECIENTES.map((u) => (
                <tr key={u.email} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-azul-marino">{u.nombre}</p>
                    <p className="text-gray-400 text-xs">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{u.categoria}</td>
                  <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{u.ciudad}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_PLAN[u.plan]}`}>{u.plan}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de empresas recientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-azul-marino">Empresas recientes</h3>
          <Link to="/admin/empresas" className="text-esmeralda text-xs font-semibold hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-5 py-3 text-left font-semibold text-azul-marino">Empresa</th>
                <th className="px-5 py-3 text-left font-semibold text-azul-marino hidden md:table-cell">Ciudad</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
                <th className="px-5 py-3 text-center font-semibold text-azul-marino">Ofertas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EMPRESAS_RECIENTES.map((e) => (
                <tr key={e.nit} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-azul-marino">{e.nombre}</p>
                    <p className="text-gray-400 text-xs">NIT {e.nit}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{e.ciudad}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_PLAN[e.plan]}`}>{e.plan}</span>
                  </td>
                  <td className="px-5 py-3 text-center text-gray-600">{e.ofertas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de pagos — solo superadmin */}
      {tienePermiso("ver_pagos") && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-azul-marino">Pagos recientes</h3>
            <Link to="/admin/suscripciones" className="text-esmeralda text-xs font-semibold hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">ID</th>
                  <th className="px-5 py-3 text-left font-semibold text-azul-marino">Usuario</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Plan</th>
                  <th className="px-5 py-3 text-right font-semibold text-azul-marino">Monto</th>
                  <th className="px-5 py-3 text-center font-semibold text-azul-marino">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PAGOS_RECIENTES.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-400 text-xs font-mono">{p.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-azul-marino">{p.usuario}</p>
                      <p className="text-gray-400 text-xs">{p.tipo} · {p.fecha}</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_PLAN[p.plan]}`}>{p.plan}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-azul-marino">
                      ${p.monto.toLocaleString("es-CO")}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${COLOR_PAGO[p.estado]}`}>{p.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
