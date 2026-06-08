import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// ── Datos demo ────────────────────────────────────────────────────────────────
const CONVERSACIONES_DEMO = [
  {
    id: 1,
    contraparte: { nombre: "Clínica Santa Fe", tipo: "empresa", iniciales: "CS", color: "bg-blue-600" },
    ultimoMensaje: "Estimada Ana, estamos interesados en su perfil para la posición de Enfermera UCI...",
    hora: "10:32",
    noLeidos: 2,
    mensajes: [
      { id: 1, de: "empresa", texto: "Buenas tardes, Ana. Mi nombre es Sandra Morales, soy Coordinadora de Talento Humano de Clínica Santa Fe.", hora: "10:28" },
      { id: 2, de: "empresa", texto: "Estamos muy interesados en su perfil para la posición de Enfermera Jefe en nuestra UCI. Tiene una excelente trayectoria.", hora: "10:29" },
      { id: 3, de: "empresa", texto: "¿Estaría disponible para una entrevista esta semana? Tenemos espacios el miércoles o el jueves.", hora: "10:32" },
    ],
  },
  {
    id: 2,
    contraparte: { nombre: "Hospital El Tunal", tipo: "empresa", iniciales: "HT", color: "bg-emerald-600" },
    ultimoMensaje: "Muchas gracias por responder. Confirmaremos la cita para mañana a las 9am.",
    hora: "Ayer",
    noLeidos: 0,
    mensajes: [
      { id: 1, de: "empresa", texto: "Hola Ana, le contactamos del Hospital El Tunal. Vimos su perfil y creemos que encajaría perfectamente en nuestro equipo.", hora: "Ayer 14:20" },
      { id: 2, de: "yo", texto: "Hola, muchas gracias por contactarme. Estoy interesada en conocer más sobre la oportunidad.", hora: "Ayer 15:05" },
      { id: 3, de: "empresa", texto: "Perfecto. ¿Le vendría bien una videollamada mañana a las 9am?", hora: "Ayer 15:10" },
      { id: 4, de: "yo", texto: "¡Claro que sí! A las 9am perfecto.", hora: "Ayer 16:00" },
      { id: 5, de: "empresa", texto: "Muchas gracias por responder. Confirmaremos la cita para mañana a las 9am.", hora: "Ayer 16:05" },
    ],
  },
  {
    id: 3,
    contraparte: { nombre: "Fundación Cardioinfantil", tipo: "empresa", iniciales: "FC", color: "bg-red-600" },
    ultimoMensaje: "Le enviamos los detalles del proceso de selección al correo.",
    hora: "Lun",
    noLeidos: 0,
    mensajes: [
      { id: 1, de: "empresa", texto: "Buenos días. Le escribimos de Fundación Cardioinfantil.", hora: "Lun 09:00" },
      { id: 2, de: "empresa", texto: "Le enviamos los detalles del proceso de selección al correo que tenemos registrado.", hora: "Lun 09:01" },
    ],
  },
];

const CONVERSACIONES_EMPRESA_DEMO = [
  {
    id: 1,
    contraparte: { nombre: "Ana García", tipo: "candidato", iniciales: "AG", color: "bg-purple-600" },
    ultimoMensaje: "Hola, muchas gracias por contactarme. Estoy muy interesada.",
    hora: "10:45",
    noLeidos: 1,
    mensajes: [
      { id: 1, de: "yo", texto: "Hola Ana, le contactamos de Clínica Santa Fe. Revisamos su perfil y estamos muy interesados.", hora: "10:30" },
      { id: 2, de: "contraparte", texto: "Hola, muchas gracias por contactarme. Estoy muy interesada.", hora: "10:45" },
    ],
  },
  {
    id: 2,
    contraparte: { nombre: "Carlos Méndez", tipo: "candidato", iniciales: "CM", color: "bg-amber-600" },
    ultimoMensaje: "Buenos días, con gusto envío mis documentos.",
    hora: "Ayer",
    noLeidos: 0,
    mensajes: [
      { id: 1, de: "yo", texto: "Buenos días Carlos, necesitamos que nos envíe su tarjeta profesional para continuar con el proceso.", hora: "Ayer 11:00" },
      { id: 2, de: "contraparte", texto: "Buenos días, con gusto envío mis documentos.", hora: "Ayer 11:20" },
    ],
  },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function Mensajes() {
  const { usuario } = useAuth();
  const esEmpresa = usuario?.rol === "empresa";
  const esPremium = true; // En producción: usuario?.plan === "premium"

  const conversacionesBase = esEmpresa ? CONVERSACIONES_EMPRESA_DEMO : CONVERSACIONES_DEMO;
  const [conversaciones, setConversaciones] = useState(conversacionesBase);
  const [activo, setActivo] = useState(conversacionesBase[0] || null);
  const [texto, setTexto] = useState("");
  const [panelMovil, setPanelMovil] = useState("lista"); // "lista" | "chat"
  const finRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activo?.mensajes?.length]);

  const seleccionar = (conv) => {
    setActivo(conv);
    setConversaciones((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, noLeidos: 0 } : c))
    );
    setPanelMovil("chat");
  };

  const enviar = () => {
    const msg = texto.trim();
    if (!msg || !activo) return;
    const nuevo = { id: Date.now(), de: "yo", texto: msg, hora: "Ahora" };
    const convActualizada = { ...activo, mensajes: [...activo.mensajes, nuevo], ultimoMensaje: msg, hora: "Ahora" };
    setConversaciones((prev) => prev.map((c) => (c.id === activo.id ? convActualizada : c)));
    setActivo(convActualizada);
    setTexto("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  if (!esPremium && !esEmpresa) {
    return <PantallaBloqueo />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        style={{ height: "calc(100vh - 140px)", minHeight: 480 }}>
        <div className="flex h-full">

          {/* ── Panel izquierdo: lista conversaciones ── */}
          <div className={`w-full md:w-80 flex-shrink-0 border-r border-gray-100 flex flex-col
            ${panelMovil === "chat" ? "hidden md:flex" : "flex"}`}>

            {/* Header lista */}
            <div className="px-4 py-4 border-b border-gray-100">
              <h1 className="text-lg font-bold text-azul-marino">Mensajes</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {conversaciones.reduce((a, c) => a + c.noLeidos, 0)} sin leer
              </p>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto">
              {conversaciones.map((conv) => (
                <button key={conv.id} onClick={() => seleccionar(conv)}
                  className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-colors flex gap-3
                    ${activo?.id === conv.id ? "bg-blue-50/80" : "hover:bg-gray-50"}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${conv.contraparte.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">{conv.contraparte.iniciales}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-azul-marino truncate">{conv.contraparte.nombre}</p>
                      <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{conv.hora}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.ultimoMensaje}</p>
                  </div>
                  {/* Badge no leídos */}
                  {conv.noLeidos > 0 && (
                    <span className="w-5 h-5 bg-esmeralda text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 self-center">
                      {conv.noLeidos}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Panel derecho: hilo de conversación ── */}
          <div className={`flex-1 flex flex-col min-w-0
            ${panelMovil === "lista" ? "hidden md:flex" : "flex"}`}>

            {activo ? (
              <>
                {/* Header chat */}
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-3">
                  <button onClick={() => setPanelMovil("lista")}
                    className="md:hidden text-azul-marino p-1 -ml-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className={`w-9 h-9 rounded-full ${activo.contraparte.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">{activo.contraparte.iniciales}</span>
                  </div>
                  <div>
                    <p className="font-bold text-azul-marino text-sm">{activo.contraparte.nombre}</p>
                    <p className="text-xs text-gray-400 capitalize">{activo.contraparte.tipo}</p>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {activo.mensajes.map((m) => (
                    <div key={m.id} className={`flex ${m.de === "yo" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                        ${m.de === "yo"
                          ? "bg-azul-marino text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                        }`}>
                        <p>{m.texto}</p>
                        <p className={`text-[10px] mt-1 text-right ${m.de === "yo" ? "text-white/60" : "text-gray-400"}`}>
                          {m.hora}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={finRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-gray-100">
                  {esEmpresa ? (
                    <div className="flex items-end gap-2">
                      <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Escribe un mensaje..."
                        rows={1}
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none outline-none focus:border-azul-claro max-h-28"
                      />
                      <button onClick={enviar}
                        disabled={!texto.trim()}
                        className="bg-esmeralda hover:bg-esmeralda-hover disabled:opacity-40 text-white rounded-xl p-2.5 transition-colors flex-shrink-0">
                        <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="text-xl">🔒</span>
                      <div>
                        <p className="text-sm font-semibold text-azul-marino">Solo lectura</p>
                        <p className="text-xs text-gray-500">Las empresas inician las conversaciones. Puedes ver y responder desde aquí.</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <p className="font-semibold text-gray-700">Selecciona una conversación</p>
                <p className="text-sm text-gray-400 mt-1">Tus mensajes aparecerán aquí.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function PantallaBloqueo() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-esmeralda/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">💬</span>
      </div>
      <h1 className="text-2xl font-bold text-azul-marino mb-3">Sistema de mensajería</h1>
      <p className="text-gray-500 mb-6 leading-relaxed">
        Las empresas con plan <strong>Premium</strong> pueden enviarte mensajes directamente.
        Cuando una empresa te contacte, podrás responder aquí.
      </p>
      <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6">
        {[
          "Recibe mensajes de empresas interesadas en tu perfil",
          "Responde directamente desde la plataforma",
          "Notificación instantánea cuando te contacten",
          "Historial completo de conversaciones",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="text-esmeralda mt-0.5">✓</span>
            {item}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Esta función está disponible para todos los candidatos registrados. Las empresas Premium pueden iniciarte una conversación.
      </p>
    </div>
  );
}
