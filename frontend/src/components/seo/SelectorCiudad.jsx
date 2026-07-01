import { useState, useRef, useEffect } from "react";
import { CIUDADES_SEO } from "../../config/seo";

export default function SelectorCiudad({ ciudadNombre, onSelect }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickFuera(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  return (
    <div className="relative inline-block mb-5" ref={ref}>
      <button
        onClick={() => setAbierto(p => !p)}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition-colors ${
          abierto
            ? "bg-white text-azul-marino border-white"
            : "bg-white/15 hover:bg-white/25 text-white border-white/30"
        }`}
      >
        📍 {ciudadNombre ?? "Todas las ciudades"}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${abierto ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {abierto && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 max-h-72 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 border-b border-gray-100">
            Cambiar ciudad
          </div>
          {ciudadNombre && (
            <button
              onClick={() => { onSelect(null); setAbierto(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-azul-marino transition-colors"
            >
              Todas las ciudades
            </button>
          )}
          {CIUDADES_SEO.map(c => (
            <button
              key={c.slug}
              onClick={() => { onSelect(c); setAbierto(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                c.nombre === ciudadNombre
                  ? "bg-blue-50 text-azul-marino font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-azul-marino"
              }`}
            >
              {c.nombre === ciudadNombre ? "✓ " : ""}{c.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
