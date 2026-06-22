import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputCampo, SelectCampo } from "../../components/common/InputCampo";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const CIUDADES = ["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga","Pereira","Manizales","Santa Marta","Cúcuta","Ibagué","Pasto","Neiva","Montería","Armenia","Otra"];
const CATEGORIAS = ["Médico general","Médico especialista","Enfermero/a","Auxiliar de enfermería","Conductor de ambulancia","Camillero","Ingeniero biomédico","Personal administrativo","Odontólogo/a","Bacteriólogo/a","Fisioterapeuta","Psicólogo/a","Farmacéutico/a","Tecnólogo en radiología","Oficios varios","Otro"];
const TIPOS_CONTRATO = ["Tiempo completo","Medio tiempo","Por turnos","Prestación de servicios","Contrato por obra o labor"];

function validar(datos) {
  const err = {};
  if (!datos.titulo.trim())       err.titulo      = "El título del cargo es obligatorio.";
  if (!datos.descripcion.trim())  err.descripcion = "La descripción es obligatoria.";
  if (datos.descripcion.trim().length < 50) err.descripcion = "La descripción debe tener al menos 50 caracteres.";
  if (!datos.requisitos.trim())   err.requisitos  = "Los requisitos son obligatorios.";
  if (!datos.ciudad)              err.ciudad      = "Selecciona la ciudad.";
  if (!datos.tipoContrato)        err.tipoContrato = "Selecciona el tipo de contrato.";
  if (!datos.categoria)           err.categoria   = "Selecciona la categoría profesional requerida.";
  if (!datos.fechaLimite)         err.fechaLimite = "Indica la fecha límite de postulación.";
  else {
    // La fecha límite debe ser futura
    if (new Date(datos.fechaLimite) <= new Date()) err.fechaLimite = "La fecha límite debe ser una fecha futura.";
  }
  return err;
}

export default function PublicarOferta() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [datos, setDatos] = useState({
    titulo: "", descripcion: "", requisitos: "",
    ciudad: "", tipoContrato: "", salarioMin: "", salarioMax: "",
    categoria: "", fechaLimite: "", urgente: false,
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [publicando, setPublicando] = useState(false);

  // Fecha mínima para el datepicker: mañana
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  const fechaMin = manana.toISOString().split("T")[0];

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatos(p => ({ ...p, [name]: value }));
    if (errores[name]) setErrores(p => ({ ...p, [name]: "" }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const err = validar(datos);
    if (Object.keys(err).length) { setErrores(err); return; }
    if (!usuario?.id) { setErrorGeneral("Debes iniciar sesión para publicar."); return; }

    setPublicando(true);
    setErrorGeneral("");
    try {
      const { error } = await supabase.from("ofertas").insert({
        empresa_id:           usuario.id,
        titulo:               datos.titulo.trim(),
        descripcion:          datos.descripcion.trim(),
        requisitos:           datos.requisitos.trim(),
        ciudad:               datos.ciudad,
        tipo_contrato:        datos.tipoContrato,
        salario_min:          datos.salarioMin ? Number(datos.salarioMin) : null,
        salario_max:          datos.salarioMax ? Number(datos.salarioMax) : null,
        categoria_profesional: datos.categoria,
        fecha_limite:         datos.fechaLimite || null,
        urgente:              datos.urgente,
        estado:               "activa",
      });
      if (error) throw error;
      navigate("/empresa/ofertas");
    } catch (err) {
      setErrorGeneral(err.message || "No se pudo publicar la oferta. Intenta de nuevo.");
      setPublicando(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-marino">Publicar nueva oferta</h1>
        <p className="text-gray-500 text-sm mt-1">Completa los detalles del cargo para llegar a los mejores candidatos.</p>
      </div>

      <form onSubmit={manejarEnvio} noValidate>
        {errorGeneral && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex gap-2">
            <span>⚠️</span>{errorGeneral}
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">

          {/* Sección 1: Información del cargo */}
          <h2 className="text-lg font-bold text-azul-marino mb-5 pb-2 border-b border-gray-100">
            Información del cargo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <InputCampo
              label="Título del cargo"
              name="titulo"
              type="text"
              placeholder="Ej: Médico General de Urgencias"
              value={datos.titulo}
              onChange={manejarCambio}
              error={errores.titulo}
              className="md:col-span-2"
            />
            <SelectCampo
              label="Categoría profesional requerida"
              name="categoria"
              value={datos.categoria}
              onChange={manejarCambio}
              error={errores.categoria}
            >
              <option value="">Seleccionar categoría</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </SelectCampo>
            <SelectCampo
              label="Ciudad"
              name="ciudad"
              value={datos.ciudad}
              onChange={manejarCambio}
              error={errores.ciudad}
            >
              <option value="">Seleccionar ciudad</option>
              {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
            </SelectCampo>
            <SelectCampo
              label="Tipo de contrato"
              name="tipoContrato"
              value={datos.tipoContrato}
              onChange={manejarCambio}
              error={errores.tipoContrato}
            >
              <option value="">Seleccionar tipo</option>
              {TIPOS_CONTRATO.map(t => <option key={t} value={t}>{t}</option>)}
            </SelectCampo>

            {/* Salario — campo opcional */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Salario mensual <span className="text-gray-400 font-normal text-xs">(opcional)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    name="salarioMin"
                    type="text"
                    inputMode="numeric"
                    value={datos.salarioMin}
                    onChange={manejarCambio}
                    placeholder="Mínimo"
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:border-esmeralda"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    name="salarioMax"
                    type="text"
                    inputMode="numeric"
                    value={datos.salarioMax}
                    onChange={manejarCambio}
                    placeholder="Máximo"
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:border-esmeralda"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Déjalo en blanco para mostrar "Salario a convenir".</p>
            </div>

            {/* Fecha límite */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Fecha límite de postulación <span className="text-red-500">*</span>
              </label>
              <input
                name="fechaLimite"
                type="date"
                min={fechaMin}
                value={datos.fechaLimite}
                onChange={manejarCambio}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors
                  ${errores.fechaLimite ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-esmeralda"}`}
              />
              {errores.fechaLimite && <p className="mt-1 text-xs text-red-500">⚠ {errores.fechaLimite}</p>}
            </div>
          </div>

          {/* Sección 2: Descripción y requisitos */}
          <h2 className="text-lg font-bold text-azul-marino mb-5 pb-2 border-b border-gray-100">
            Descripción y requisitos
          </h2>
          <div className="space-y-5 mb-6">
            {/* Descripción del cargo */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Descripción del cargo <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                rows={6}
                value={datos.descripcion}
                onChange={manejarCambio}
                placeholder="Describe el cargo: funciones principales, horario, condiciones laborales, beneficios, a quién reporta, etc."
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors
                  ${errores.descripcion ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-esmeralda"}`}
              />
              <div className="flex justify-between mt-1">
                {errores.descripcion
                  ? <p className="text-xs text-red-500">⚠ {errores.descripcion}</p>
                  : <p className="text-xs text-gray-400">Mínimo 50 caracteres.</p>
                }
                <p className="text-xs text-gray-400">{datos.descripcion.length} caracteres</p>
              </div>
            </div>

            {/* Requisitos */}
            <div>
              <label className="block text-sm font-semibold text-azul-marino mb-1.5">
                Requisitos <span className="text-red-500">*</span>
              </label>
              <textarea
                name="requisitos"
                rows={5}
                value={datos.requisitos}
                onChange={manejarCambio}
                placeholder="Lista los requisitos del cargo: título profesional, experiencia mínima, tarjeta profesional, disponibilidad, etc."
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors
                  ${errores.requisitos ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-esmeralda"}`}
              />
              {errores.requisitos && <p className="mt-1 text-xs text-red-500">⚠ {errores.requisitos}</p>}
            </div>
          </div>

          {/* Vista previa del salario */}
          {datos.salario || datos.titulo ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-400 font-medium mb-1">Vista previa de tu oferta:</p>
              <p className="font-bold text-azul-marino">{datos.titulo || "Título del cargo"}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {datos.ciudad || "Ciudad"} · {datos.tipoContrato || "Tipo de contrato"} ·{" "}
                <span className="text-esmeralda font-semibold">
                  {datos.salario ? `$${datos.salario} COP` : "Salario a convenir"}
                </span>
              </p>
            </div>
          ) : null}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={publicando}
              className="flex-1 btn-primario py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {publicando ? "Publicando oferta..." : "Publicar oferta"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/empresa/ofertas")}
              className="flex-1 btn-outline py-4 text-base"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
