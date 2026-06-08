// Componente reutilizable para campos de formulario con etiqueta y mensaje de error
export function InputCampo({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-azul-marino mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors duration-200
          ${error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-300 bg-white focus:border-esmeralda"
          }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// Componente reutilizable para campos select
export function SelectCampo({ label, error, children, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-azul-marino mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        {...props}
        className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition-colors duration-200 cursor-pointer bg-white
          ${error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-300 focus:border-esmeralda"
          }`}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
