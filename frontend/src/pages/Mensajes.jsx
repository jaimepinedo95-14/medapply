import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Mensajes() {
  const { usuario } = useAuth();
  const esEmpresa = usuario?.rol === "empresa";

  const [conversaciones, setConversaciones] = useState([]);
  const [activo, setActivo]                 = useState(null);
  const [mensajes, setMensajes]             = useState([]);
  const [texto, setTexto]                   = useState("");
  const [cargando, setCargando]             = useState(true);
  const [panelMovil, setPanelMovil]         = useState("lista");
  const finRef = useRef(null);

  useEffect(() => {
    if (!usuario?.id) return;
    cargarConversaciones();
  }, [usuario?.id]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes.length]);

  async function cargarConversaciones() {
    setCargando(true);
    try {
      const { data: msgs, error } = esEmpresa
        ? await supabase
            .from("mensajes")
            .select("*, usuarios!candidato_id(id, nombre)")
            .eq("empresa_id", usuario.id)
            .order("created_at", { ascending: false })
        : await supabase
            .from("mensajes")
            .select("*, usuarios!empresa_id(id, nombre, perfiles_empresa(nombre_empresa, logo))")
            .eq("candidato_id", usuario.id)
            .order("created_at", { ascending: false });

      if (error || !msgs?.length) {
        setConversaciones([]);
        return;
      }

      const convsMap = {};
      for (const msg of msgs) {
        const otroId = esEmpresa ? msg.candidato_id : msg.empresa_id;
        if (!convsMap[otroId]) {
          const otro = msg.usuarios;
          const nombreOtro = esEmpresa
            ? otro?.nombre || "Candidato"
            : otro?.perfiles_empresa?.nombre_empresa || otro?.nombre || "Empresa";
          const logoOtro = esEmpresa ? null : otro?.perfiles_empresa?.logo;
          const iniciales = nombreOtro
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();

          convsMap[otroId] = {
            otroId,
            nombre: nombreOtro,
            iniciales,
            logo: logoOtro,
            msgs: [],
            noLeidos: 0,
          };
        }

        convsMap[otroId].msgs.push(msg);
        const miRol = esEmpresa ? "empresa" : "candidato";
        if (!msg.leido && msg.remitente_rol !== miRol) {
          convsMap[otroId].noLeidos++;
        }
      }

      const convsList = Object.values(convsMap).map((c) => ({
        otroId:        c.otroId,
        nombre:        c.nombre,
        iniciales:     c.iniciales,
        logo:          c.logo,
        noLeidos:      c.noLeidos,
        ultimoMensaje: c.msgs[0]?.contenido || "",
        hora:          formatHora(c.msgs[0]?.created_at),
        mensajesOrden: [...c.msgs].reverse(),
      }));

      setConversaciones(convsList);
    } catch (_) {
      setConversaciones([]);
    } finally {
      setCargando(false);
    }
  }

  async function seleccionar(conv) {
    setActivo(conv);
    setMensajes(conv.mensajesOrden);
    setPanelMovil("chat");

    const miRol = esEmpresa ? "empresa" : "candidato";
    await supabase
      .from("mensajes")
      .update({ leido: true })
      .eq(esEmpresa ? "empresa_id" : "candidato_id", usuario.id)
      .eq(esEmpresa ? "candidato_id" : "empresa_id", conv.otroId)
      .neq("remitente_rol", miRol)
      .eq("leido", false);

    setConversaciones((prev) =>
      prev.map((c) => (c.otroId === conv.otroId ? { ...c, noLeidos: 0 } : c))
    );
  }

  async function enviar() {
    const msg = texto.trim();
    if (!msg || !activo) return;
    setTexto("");

    const nuevoMsg = {
      empresa_id:    esEmpresa ? usuario.id : activo.otroId,
      candidato_id:  esEmpresa ? activo.otroId : usuario.id,
      remitente_rol: esEmpresa ? "empresa" : "candidato",
      contenido:     msg,
    };

    const { data, error } = await supabase
      .from("mensajes")
      .insert(nuevoMsg)
      .select()
      .single();

    if (!error && data) {
      setMensajes((prev) => [...prev, data]);
      setConversaciones((prev) =>
        prev.map((c) =>
          c.otroId === activo.otroId
            ? { ...c, ultimoMensaje: msg, hora: "Ahora" }
            : c
        )
      );
    }
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  const miRol = esEmpresa ? "empresa" : "candidato";
  const totalSinLeer = conversaciones.reduce((a, c) => a + c.noLeidos, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        style={{ height: "calc(100vh - 140px)", minHeight: 480 }}
      >
        <div className="flex h-full">

          {/* Lista de conversaciones */}
          <div className={`w-full md:w-80 flex-shrink-0 border-r border-gray-100 flex flex-col
            ${panelMovil === "chat" ? "hidden md:flex" : "flex"}`}>

            <div className="px-4 py-4 border-b border-gray-100">
              <h1 className="text-lg font-bold text-azul-marino">Mensajes</h1>
              <p className="text-xs text-gray-400 mt-0.5">{totalSinLeer} sin leer</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cargando ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-4 py-3.5 border-b border-gray-50 flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-100 rounded animate-pulse mb-2 w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : conversaciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center py-12">
                  <span className="text-4xl mb-3">💬</span>
                  <p className="text-sm font-semibold text-gray-600">Sin conversaciones</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {esEmpresa
                      ? "Inicia conversaciones con candidatos desde su perfil."
                      : "Cuando una empresa te contacte, aparecerá aquí."}
                  </p>
                </div>
              ) : (
                conversaciones.map((conv) => (
                  <button
                    key={conv.otroId}
                    onClick={() => seleccionar(conv)}
                    className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-colors flex gap-3
                      ${activo?.otroId === conv.otroId ? "bg-blue-50/80" : "hover:bg-gray-50"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {conv.logo
                        ? <img src={conv.logo} alt="" className="w-full h-full object-cover" />
                        : <span className="text-white text-xs font-bold">{conv.iniciales}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-azul-marino truncate">{conv.nombre}</p>
                        <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{conv.hora}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.ultimoMensaje}</p>
                    </div>
                    {conv.noLeidos > 0 && (
                      <span className="w-5 h-5 bg-esmeralda text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 self-center">
                        {conv.noLeidos}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Hilo de conversación */}
          <div className={`flex-1 flex flex-col min-w-0
            ${panelMovil === "lista" ? "hidden md:flex" : "flex"}`}>

            {activo ? (
              <>
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-3">
                  <button onClick={() => setPanelMovil("lista")} className="md:hidden text-azul-marino p-1 -ml-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {activo.logo
                      ? <img src={activo.logo} alt="" className="w-full h-full object-cover" />
                      : <span className="text-white text-xs font-bold">{activo.iniciales}</span>
                    }
                  </div>
                  <div>
                    <p className="font-bold text-azul-marino text-sm">{activo.nombre}</p>
                    <p className="text-xs text-gray-400">{esEmpresa ? "Candidato" : "Empresa"}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {mensajes.map((m) => {
                    const esMio = m.remitente_rol === miRol;
                    return (
                      <div key={m.id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                          ${esMio
                            ? "bg-azul-marino text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                          }`}>
                          <p>{m.contenido}</p>
                          <p className={`text-[10px] mt-1 text-right ${esMio ? "text-white/60" : "text-gray-400"}`}>
                            {formatHora(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={finRef} />
                </div>

                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Escribe un mensaje..."
                      rows={1}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none outline-none focus:border-azul-claro max-h-28"
                    />
                    <button
                      onClick={enviar}
                      disabled={!texto.trim()}
                      className="bg-esmeralda hover:bg-esmeralda-hover disabled:opacity-40 text-white rounded-xl p-2.5 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  </div>
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

function formatHora(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const ahora = new Date();
  const diff = ahora - d;
  if (diff < 86400000 && d.getDate() === ahora.getDate()) {
    return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  }
  if (diff < 172800000) return "Ayer";
  return d.toLocaleDateString("es-CO", { weekday: "short" });
}
