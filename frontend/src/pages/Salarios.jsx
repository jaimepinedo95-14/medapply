// Guía de salarios del sector salud — montos en la moneda configurada en region.js
import { Link } from "react-router-dom";
import { REGION, formatNumero } from "../config/region";

const SALARIOS = [
  { categoria: "Médico general",           inicial: "3.500.000",  medio: "5.000.000",  senior: "8.000.000"  },
  { categoria: "Médico especialista",       inicial: "8.000.000",  medio: "12.000.000", senior: "20.000.000" },
  { categoria: "Enfermero/a",               inicial: "2.500.000",  medio: "3.500.000",  senior: "5.000.000"  },
  { categoria: "Auxiliar de enfermería",    inicial: "1.500.000",  medio: "2.000.000",  senior: "2.800.000"  },
  { categoria: "Bacteriólogo/a",            inicial: "2.500.000",  medio: "3.500.000",  senior: "5.000.000"  },
  { categoria: "Fisioterapeuta",            inicial: "2.200.000",  medio: "3.000.000",  senior: "4.500.000"  },
  { categoria: "Psicólogo/a",               inicial: "2.000.000",  medio: "3.000.000",  senior: "4.500.000"  },
  { categoria: "Odontólogo/a",              inicial: "2.500.000",  medio: "4.000.000",  senior: "7.000.000"  },
  { categoria: "Ingeniero biomédico",       inicial: "3.000.000",  medio: "4.500.000",  senior: "7.000.000"  },
  { categoria: "Farmacéutico/a",            inicial: "2.200.000",  medio: "3.200.000",  senior: "5.000.000"  },
  { categoria: "Terapeuta ocupacional",     inicial: "2.000.000",  medio: "2.800.000",  senior: "4.000.000"  },
  { categoria: "Nutricionista",             inicial: "1.800.000",  medio: "2.500.000",  senior: "3.800.000"  },
  { categoria: "Personal administrativo",  inicial: "1.200.000",  medio: "1.800.000",  senior: "2.500.000"  },
  { categoria: "Conductor de ambulancia",  inicial: "1.400.000",  medio: "2.000.000",  senior: "2.800.000"  },
];

const FACTORES = [
  { icono: "🏙", factor: "Ciudad",          desc: "Bogotá, Medellín y Cali tienen salarios entre 15-25% más altos que ciudades intermedias." },
  { icono: "📅", factor: "Experiencia",      desc: "Cada 3-5 años de experiencia puede representar un incremento del 20-40% respecto al rango inicial." },
  { icono: "🎓", factor: "Especialización", desc: "Una especialización o maestría puede duplicar el salario base de un profesional de la salud." },
  { icono: "🏥", factor: "Tipo de institución", desc: "Los hospitales universitarios y clínicas de alta complejidad suelen pagar entre 10-30% más." },
  { icono: "📄", factor: "Tipo de contrato", desc: "Los contratos de prestación de servicios pueden tener salarios brutos más altos pero sin prestaciones sociales." },
  { icono: "🌙", factor: "Turnos especiales", desc: "Turnos nocturnos, festivos y de urgencias tienen recargos legales del 35-75% sobre el salario ordinario." },
];

export default function Salarios() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-azul-marino text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-esmeralda-claro font-semibold uppercase tracking-widest text-sm mb-3">Referencia salarial 2026</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Salarios del sector salud en Colombia
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Rangos de referencia mensuales en COP para los principales cargos del sector salud. Datos estimados basados en ofertas publicadas en la plataforma.
          </p>
        </div>
      </section>

      {/* Tabla de salarios */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-azul-marino mb-2">Salarios por categoría profesional</h2>
            <p className="text-gray-500 text-sm">Valores mensuales brutos en COP. Los rangos varían según ciudad, tipo de institución, experiencia y tipo de contrato.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-azul-marino text-white">
                    <th className="px-5 py-4 text-left font-semibold">Categoría profesional</th>
                    <th className="px-4 py-4 text-center font-semibold">Inicial (0-2 años)</th>
                    <th className="px-4 py-4 text-center font-semibold">Intermedio (3-7 años)</th>
                    <th className="px-4 py-4 text-center font-semibold hidden md:table-cell">Senior (8+ años)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {SALARIOS.map((s, i) => (
                    <tr key={s.categoria} className={`hover:bg-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                      <td className="px-5 py-3.5 font-medium text-azul-marino">{s.categoria}</td>
                      <td className="px-4 py-3.5 text-center text-gray-600">${s.inicial}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-esmeralda">${s.medio}</td>
                      <td className="px-4 py-3.5 text-center text-gray-800 font-bold hidden md:table-cell">${s.senior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            * Valores de referencia en COP/mes. No incluyen prestaciones sociales. Actualizados junio 2026.
          </p>
        </div>
      </section>

      {/* Factores que afectan el salario */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-azul-marino mb-2 text-center">Factores que afectan el salario</h2>
          <p className="text-gray-500 text-sm text-center mb-8">
            Más allá de la categoría, estos factores pueden impactar significativamente tu remuneración.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FACTORES.map((f) => (
              <div key={f.factor} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="text-2xl mb-3">{f.icono}</div>
                <h3 className="font-bold text-azul-marino mb-1">{f.factor}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salario mínimo — valores desde configuración regional */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="font-bold text-azul-marino mb-3 text-lg">
            📋 Salario mínimo {REGION.pais} 2026
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { label: "Salario mínimo",        valor: `${REGION.monedaSimbolo}${formatNumero(REGION.salarioMinimo)}` },
              { label: "Auxilio de transporte", valor: REGION.auxilioTransporte > 0 ? `${REGION.monedaSimbolo}${formatNumero(REGION.auxilioTransporte)}` : "No aplica" },
              { label: "Total con auxilio",      valor: `${REGION.monedaSimbolo}${formatNumero(REGION.salarioMinimo + REGION.auxilioTransporte)}` },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-3 border border-blue-100">
                <p className="text-lg font-bold text-azul-marino">{item.valor}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Valores {REGION.moneda} para 2026. {REGION.impuesto}.
            Los empleadores del sector salud deben respetar como mínimo estos valores.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-azul-marino text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">¿Buscas un empleo con buen salario en salud?</h2>
          <p className="text-blue-200 mb-6">Explora las ofertas activas en el sector salud y postúlate gratis.</p>
          <Link to="/empleos" className="bg-esmeralda hover:bg-esmeralda-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Ver ofertas disponibles
          </Link>
        </div>
      </section>
    </div>
  );
}
