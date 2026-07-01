import Hero from "../components/home/Hero";
import ExplorarSEO from "../components/home/ExplorarSEO";
import Categorias from "../components/home/Categorias";
import ComoFunciona from "../components/home/ComoFunciona";
import BannerEmpresas from "../components/home/BannerEmpresas";

// Página de inicio — ensambla todas las secciones del home
export default function Inicio() {
  return (
    <main>
      <Hero />
      <ExplorarSEO />
      <Categorias />
      <ComoFunciona />
      <BannerEmpresas />
    </main>
  );
}
