import { useParams, Link, Navigate } from "react-router-dom";
import { DATOS_SALARIO, PROFESIONES_SEO } from "../../config/seo";
import SEOHead from "../../components/seo/SEOHead";
import SEOTextBlock from "../../components/seo/SEOTextBlock";

export default function SalarioProfesion() {
  const { profesion: slug } = useParams();
  const datos = DATOS_SALARIO[slug];
  const profConfig = PROFESIONES_SEO.find(p => p.slug === slug);

  // Si no hay datos de salario para esta profesión, redirigir a /salarios
  if (!datos) return <Navigate to="/salarios" replace />;

  return (
    <div className="bg-white min-h-screen">
      <SEOHead
        title={`Salario de ${datos.nombre} en Colombia 2026 — Rangos actualizados | MedApply`}
        description={`¿Cuánto gana un ${datos.nombre} en Colombia? Rangos salariales por ciudad e institución. Datos 2026 actualizados.`}
        canonical={`https://medapply.co/salarios/${slug}`}
      />

      {/* Hero */}
      <section className="bg-azul-marino text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-blue-300 mb-4 flex items-center gap-1.5">
            <Link to="/" className="hover:text-white">Inicio</Link>
            <span>›</span>
            <Link to="/salarios" className="hover:text-white">Salarios</Link>
            <span>›</span>
            <span className="text-white font-medium">{datos.nombre}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Salario de {datos.nombre} en Colombia 2026
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">{datos.intro}</p>
        </div>
      </section>

      {/* Rangos generales */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-azul-marino mb-6">Rangos salariales por experiencia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {datos.rangos.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{r.nivel}</p>
                <p className="text-2xl font-bold text-esmeralda">${r.min}</p>
                <p className="text-sm text-gray-400">hasta ${r.max} COP/mes</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * Valores brutos de referencia en COP/mes. No incluyen prestaciones sociales. Actualizado junio 2026.
          </p>
        </div>
      </section>

      {/* Salarios por ciudad */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-azul-marino mb-6">
            Salario de {datos.nombre} por ciudad
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-azul-marino text-white">
                    <th className="px-5 py-4 text-left font-semibold">Ciudad</th>
                    <th className="px-4 py-4 text-center font-semibold">Rango salarial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {datos.porCiudad.map((c, i) => (
                    <tr key={c.ciudad} className={`hover:bg-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                      <td className="px-5 py-3.5 font-medium text-azul-marino">{c.ciudad}</td>
                      <td className="px-4 py-3.5 text-center text-gray-600">
                        ${c.min} – ${c.max} COP/mes
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Salarios por tipo de institución */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-azul-marino mb-6">
            Salario por tipo de institución
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {datos.porInstitucion.map((inst, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-bold text-azul-marino text-sm mb-1">{inst.tipo}</h3>
                <p className="text-esmeralda font-bold">{inst.rango}</p>
                <p className="text-xs text-gray-400 mt-0.5">COP/mes bruto</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factores que afectan el salario */}
      <section className="py-12 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-azul-marino mb-4">
            Factores que afectan el salario
          </h2>
          <p className="text-gray-600 leading-relaxed">{datos.factoresSalario}</p>
        </div>
      </section>

      {/* SEO text */}
      <SEOTextBlock texto={datos.textoseo} />

      {/* CTA vacantes */}
      <section className="py-12 px-4 bg-azul-marino text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">¿Buscas empleo como {datos.nombre}?</h2>
          <p className="text-blue-200 mb-6">
            Explora vacantes activas en clínicas, hospitales e IPS de todo Colombia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {profConfig && (
              <Link
                to={`/empleos/profesion/${profConfig.slug}`}
                className="bg-esmeralda hover:bg-esmeralda-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Ver vacantes de {datos.nombre}
              </Link>
            )}
            <Link to="/salarios" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20">
              Ver todos los salarios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
