import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

const NotificacionesContext = createContext(null);

export const TIPOS_NOTIFICACION = {
  POSTULACION_RECIBIDA: "postulacion_recibida",
  CAMBIO_ESTADO:        "cambio_estado",
  NUEVA_OFERTA:         "nueva_oferta",
  MENSAJE:              "mensaje",
  RECORDATORIO_PERFIL:  "recordatorio_perfil",
};

export function NotificacionesProvider({ children }) {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(false);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  // Cargar notificaciones del usuario autenticado
  const cargar = useCallback(async () => {
    if (!usuario?.id) { setNotificaciones([]); return; }
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from("notificaciones")
        .select("*")
        .eq("usuario_id", usuario.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotificaciones(data ?? []);
    } catch {
      // Tabla no existente aún o sin conexión → sin notificaciones
      setNotificaciones([]);
    } finally {
      setCargando(false);
    }
  }, [usuario?.id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Suscripción en tiempo real
  useEffect(() => {
    if (!usuario?.id) return;
    const canal = supabase
      .channel(`notificaciones_${usuario.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notificaciones", filter: `usuario_id=eq.${usuario.id}` },
        (payload) => {
          setNotificaciones((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, [usuario?.id]);

  const marcarLeida = useCallback(async (id) => {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
    try {
      await supabase.from("notificaciones").update({ leida: true }).eq("id", id);
    } catch { /* optimistic update ya aplicado */ }
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    if (!usuario?.id) return;
    try {
      await supabase.from("notificaciones").update({ leida: true })
        .eq("usuario_id", usuario.id).eq("leida", false);
    } catch { /* optimistic update ya aplicado */ }
  }, [usuario?.id]);

  const eliminar = useCallback(async (id) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    try {
      await supabase.from("notificaciones").delete().eq("id", id);
    } catch { /* optimistic update ya aplicado */ }
  }, []);

  return (
    <NotificacionesContext.Provider
      value={{ notificaciones, noLeidas, cargando, marcarLeida, marcarTodasLeidas, eliminar, cargar }}
    >
      {children}
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  return useContext(NotificacionesContext);
}
