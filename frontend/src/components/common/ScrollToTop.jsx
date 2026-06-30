import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router no hace scroll-restoration por defecto: al navegar a una
// ruta nueva, el navegador mantiene la posición de scroll de la página
// anterior. Eso hace que enlaces como "Precios" en el Footer (al final de
// la página) parezcan "no funcionar" — la ruta sí cambia, pero el usuario
// sigue viendo el mismo punto de scroll, a veces aterrizando en medio del
// contenido de la página nueva en vez de arriba.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // setTimeout(0) garantiza que el componente destino ya está en el DOM
      // antes de intentar el scroll. Sin esto, al navegar desde otra ruta
      // el getElementById puede devolver null porque React aún no ha
      // terminado de pintar el nuevo árbol.
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
