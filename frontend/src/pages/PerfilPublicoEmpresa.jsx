// Perfil público de empresa — visible para todos los usuarios
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const COLORES_TIPO = {
  "Clínica":     "bg-blue-100 text-blue-700",
  "Hospital":    "bg-esmeralda/10 text-esmeralda",
  "EPS":         "bg-purple-100 text-purple-700",
  "IPS":         "bg-yellow-100 text-yellow-700",
  "Laboratorio": "bg-pink-100 text-pink-700",
};

export default function PerfilPublicoEmpresa() {
  const { id } = useParams();
  const [empresa, setEmpresa]     = useState(null);
  const [ofertas, setOfertas]     = useState([]);
  const [cargando, setCargando]   = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("perfiles_empresa").select("*, usuarios!inner(email)").eq("usuario_id", id).single(),
      supabase.from("ofertas_con_empresa").select("id, titulo, ciudad, tipo_contrato, salario_min, salario_max, urgente")
        .eq("empresa_id", id).eq("estado", "activa").order("fecha_publicacion", { ascending: false }),
    ]).then(([{ data: e }, { data: o }]) => {
      setEmpresa(e || null);
      setOfertas(o || []);
      setCargando(false);
    }).catch(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-esmeralda border-t-transparent rounded-full animate-spin" />
          Cargando empresa...
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h1 className="text-2xl font-bold text-azul-marino mb-2">Empresa no encontrada</h1>
          <p className="text-gray-500 mb-6">No existe ninguna empresa con ese identificador.</p>
          <Link to="/empleos" className="btn-primario">Ver ofertas disponibles</Link>
        </div>
      </div>
    );
  }

  const colorTipo = COLORES_TIPO[empresa.tipo_empresa] || "bg-gray-100 text-gray-700";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-azul-marino text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg text-4xl flex-shrink-0 overflow-hidden">
              {empresa.logo
                ? <img src={empresa.logo} alt="" className="w-full h-full object-cover" />
                : "🏥"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{empresa.nombre_empresa}</h1>
                {empresa.tipo_empresa && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorTipo}`}>
                    {empresa.tipo_empresa}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-blue-200 text-sm">
                {empresa.ciudad && <span>📍 {empresa.ciudad}</span>}
                {empresa.telefono && <span>📞 {empresa.telefono}</span>}
                {empresa.nit && <span>NIT: {empresa.nit}</span>}
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl px-5 py-3 text-center flex-shrink-0">
              <p className="text-2xl font-bold">{ofertas.length}</p>
              <p className="text-blue-200 text-xs">ofertas activas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-azul-marino mb-4">Información de contacto</h2>
              <ul className="space-y-3 text-sm">
                {empresa.usuarios?.email && (
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">📧</span>
                    <div className="min-w-0">
                      <p className="text-gray-400 text-xs">Correo</p>
                      <p className="text-gray-700 font-medium truncate">{empresa.usuarios.email}</p>
                    </div>
                  </li>
                )}
                {empresa.telefono && (
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">📞</span>
                    <div>
                      <p className="text-gray-400 text-xs">Teléfono</p>
                      <p className="text-gray-700 font-medium">{empresa.telefono}</p>
                    </div>
                  </li>
                )}
                {empresa.nit && (
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">🪪</span>
                    <div>
                      <p className="text-gray-400 text-xs">NIT</p>
                      <p className="text-gray-700 font-medium">{empresa.nit}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <Link to="/empleos"
              className="block bg-esmeralda text-white text-center rounded-2xl px-5 py-3 font-semibold hover:bg-esmeralda-hover transition-colors">
              Ver todas las ofertas del sector salud
            </Link>
          </div>

          <div className="lg:col-span-2 space-y-5">
            {empresa.descripcion && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-azul-marino mb-3 text-lg">Sobre {empresa.nombre_empresa}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{empresa.descripcion}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-azul-marino mb-4 text-lg">
                Ofertas activas
                {ofertas.length > 0 && (
                  <span className="ml-2 bg-esmeralda text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {ofertas.length}
                  </span>
                )}
              </h2>
              {ofertas.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm">No hay ofertas activas en este momento.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ofertas.map((oferta) => (
                    <div key={oferta.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-esmeralda transition-colors group">
                      <div className="min-w-0">
                        <p className="font-semibold text-azul-marino text-sm group-hover:text-esmeralda transition-colors truncate">
                          {oferta.titulo}
                          {oferta.urgente && <span className="ml-2 text-xs text-red-500">(Urgente)</span>}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                          <span>📍 {oferta.ciudad}</span>
                          <span>📄 {oferta.tipo_contrato}</span>
                        </div>
                      </div>
                      <Link to={`/empleos/${oferta.id}`}
                        className="ml-3 flex-shrink-0 bg-white border border-esmeralda text-esmeralda text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-esmeralda hover:text-white transition-colors">
                        Ver oferta
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
