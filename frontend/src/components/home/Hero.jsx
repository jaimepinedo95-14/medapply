import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGION } from "../../config/region";
import { useStats } from "../../hooks/useStats";

const IconoBuscar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconoUbicacion = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function Hero() {
  const [busqueda, setBusqueda] = useState("");
  const [ciudad, setCiudad] = useState("");
  const navigate = useNavigate();
  const stats = useStats();

  const manejarBusqueda = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (busqueda) params.set("q", busqueda);
    if (ciudad) params.set("ciudad", ciudad);
    navigate(`/empleos?${params.toString()}`);
  };

  return (
    <section
      className="relative text-white"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay azul marino semitransparente */}
      <div className="absolute inset-0 bg-azul-marino/85" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">

        {/* Texto principal */}
        <div className="text-center mb-10">
          <span className="inline-block bg-esmeralda text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            🏥 La primera bolsa de empleo exclusiva del sector salud en Colombia
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            Encuentra tu próximo empleo
            <br />
            <span className="text-esmeralda-claro">en salud</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto">
            La primera bolsa de empleo exclusiva del sector salud en Colombia.
            Conectamos talento médico con las mejores instituciones.
          </p>
        </div>

        {/* Buscador principal */}
        <form onSubmit={manejarBusqueda} className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">

            <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-gray-400 mr-3 flex-shrink-0">
                <IconoBuscar />
              </span>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Cargo, especialidad o palabra clave..."
                className="bg-transparent w-full text-gray-800 placeholder-gray-400 outline-none text-sm"
              />
            </div>

            <div className="hidden md:block w-px bg-gray-200 my-2" />

            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 min-w-[180px]">
              <span className="text-gray-400 mr-3 flex-shrink-0">
                <IconoUbicacion />
              </span>
              <select
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="bg-transparent w-full text-gray-700 outline-none text-sm cursor-pointer"
              >
                <option value="">Todas las ciudades</option>
                {REGION.ciudades.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn-primario whitespace-nowrap px-8 py-3 text-sm"
            >
              Buscar empleo
            </button>
          </div>
        </form>

        {/* Estadísticas rápidas — datos reales con realtime */}
        <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-8 md:gap-14 border-t border-white/10 pt-8">
          {[
            { numero: stats.ofertas,    texto: "Ofertas activas" },
            { numero: stats.empresas,   texto: "Empresas registradas" },
            { numero: stats.candidatos, texto: "Profesionales de salud" },
          ].map((stat) => (
            <div key={stat.texto} className="text-center px-1">
              <p className="text-2xl sm:text-3xl font-bold text-esmeralda-claro leading-tight">
                {stat.numero.toLocaleString("es-CO")}
              </p>
              <p className="text-blue-200 text-xs sm:text-sm mt-1 leading-snug">{stat.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
