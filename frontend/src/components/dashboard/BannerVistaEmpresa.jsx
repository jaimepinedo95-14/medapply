import { Link } from "react-router-dom";

// Se muestra arriba del contenido público cuando una empresa autenticada
// navega a una URL pública (ej. /empleos, /empleos/:id). Le aclara que está
// viendo la web pública con su cuenta de empresa y le ofrece volver a su panel.
export default function BannerVistaEmpresa() {
  return (
    <div className="bg-blue-50 border-b border-blue-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-azul-marino">
        👔 Estás viendo esta página pública con tu cuenta de empresa.
      </p>
      <Link to="/empresa/mis-vacantes" className="btn-primario text-xs py-2 px-4 whitespace-nowrap">
        Ver en mi panel →
      </Link>
    </div>
  );
}
