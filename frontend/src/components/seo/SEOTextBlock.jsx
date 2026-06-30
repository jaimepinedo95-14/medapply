// Bloque de texto optimizado para SEO. Se coloca al final de la página.
export default function SEOTextBlock({ texto, titulo = null }) {
  if (!texto) return null;
  return (
    <section className="py-10 px-4">
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-100">
        {titulo && (
          <h2 className="text-base font-bold text-azul-marino mb-3">{titulo}</h2>
        )}
        <p className="text-gray-500 text-sm leading-relaxed">{texto}</p>
      </div>
    </section>
  );
}
