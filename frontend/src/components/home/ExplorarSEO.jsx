import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { CIUDADES_SEO, PROFESIONES_SEO } from "../../config/seo";

export default function ExplorarSEO() {
  const [conteoCiudad, setConteoCiudad]       = useState({});
  const [conteoProfesion, setConteoProfesion] = useState({});
  const [listo, setListo]                     = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const { data } = await supabase
          .from("ofertas_con_empresa")
          .select("ciudad, categoria_profesional")
          .eq("estado", "activa")
          .limit(5000);

        if (!data) return;

        const cc = {};
        data.forEach(o => {
          const c = o.ciudad?.trim();
          if (c) cc[c] = (cc[c] || 0) + 1;
        });

        const cp = {};
        PROFESIONES_SEO.forEach(p => {
          cp[p.slug] = data.filter(o =>
            o.categoria_profesional?.toLowerCase().includes(p.busqueda.toLowerCase())
          ).length;
        });

        setConteoCiudad(cc);
        setConteoProfesion(cp);
      } catch {
        // chips aparecen igual sin número si hay error de red
      } finally {
        setListo(true);
      }
    }
    cargar();
  }, []);

  return (
    <section className="bg-gray-50 border-b border-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ── Empleos por ciudad ── */}
        <div>
          <h2 className="text-xl font-bold text-azul-marino mb-1">Empleos por ciudad</h2>
          <p className="text-gray-500 text-sm mb-4">
            Vacantes en salud en las principales ciudades de Colombia
          </p>
          <div className="flex flex-wrap gap-2">
            {CIUDADES_SEO.map(c => {
              const n = conteoCiudad[c.db] ?? 0;
              return (
                <Link
                  key={c.slug}
                  to={`/empleos/${c.slug}`}
                  className="group inline-flex items-center gap-1.5 border border-gray-200 hover:border-azul-marino hover:bg-azul-marino hover:text-white text-gray-700 bg-white rounded-xl px-3 py-1.5 text-sm transition-all"
                >
                  📍 {c.nombre}
                  {listo && n > 0 && (
                    <span className="text-xs font-medium bg-gray-100 text-gray-500 group-hover:bg-white/20 group-hover:text-white px-1.5 py-0.5 rounded-full transition-colors">
                      {n}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Empleos por profesión ── */}
        <div>
          <h2 className="text-xl font-bold text-azul-marino mb-1">Empleos por profesión</h2>
          <p className="text-gray-500 text-sm mb-4">
            Vacantes especializadas para cada área del sector salud
          </p>
          <div className="flex flex-wrap gap-2">
            {PROFESIONES_SEO.map(p => {
              const n = conteoProfesion[p.slug] ?? 0;
              return (
                <Link
                  key={p.slug}
                  to={`/empleos/profesion/${p.slug}`}
                  className="group inline-flex items-center gap-1.5 border border-gray-200 hover:border-esmeralda hover:bg-esmeralda hover:text-white text-gray-700 bg-white rounded-xl px-3 py-1.5 text-sm transition-all"
                >
                  {p.nombre}
                  {listo && n > 0 && (
                    <span className="text-xs font-medium bg-gray-100 text-gray-500 group-hover:bg-white/20 group-hover:text-white px-1.5 py-0.5 rounded-full transition-colors">
                      {n}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
