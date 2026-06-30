import { useParams } from "react-router-dom";
import { CIUDADES_SEO } from "../../config/seo";
import EmpleosCiudad from "./EmpleosCiudad";
import DetalleOferta from "../DetalleOferta";

// Distribuye entre la página de ciudad y el detalle de oferta.
// Ambos comparten el param `:id` del route /empleos/:id para no romper
// los <Link to={`/empleos/${oferta.id}`}> existentes en toda la app.
export default function EmpleosDispatch() {
  const { id } = useParams();
  if (CIUDADES_SEO.some(c => c.slug === id)) return <EmpleosCiudad />;
  return <DetalleOferta />;
}
