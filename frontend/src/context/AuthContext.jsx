import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const ROLES = {
  CANDIDATO:  "candidato",
  EMPRESA:    "empresa",
  MODERADOR:  "moderador",
  ADMIN:      "admin",
  SUPERADMIN: "superadmin",
};

const PERMISOS_ROL = {
  candidato:  ["ver_empleos", "postularse", "editar_perfil_candidato"],
  empresa:    ["ver_candidatos", "publicar_ofertas", "gestionar_ofertas_propias"],
  moderador:  ["ver_ofertas_pendientes", "aprobar_oferta", "pausar_oferta", "rechazar_oferta"],
  admin:      ["ver_dashboard", "gestionar_usuarios", "gestionar_empresas", "gestionar_ofertas", "ver_candidatos"],
  superadmin: [
    "ver_dashboard", "gestionar_usuarios", "gestionar_empresas", "gestionar_ofertas",
    "ver_candidatos", "ver_pagos", "gestionar_roles", "configuracion_plataforma",
    "aprobar_oferta", "pausar_oferta", "rechazar_oferta", "ver_ofertas_pendientes",
  ],
};

export const DESTINO_POR_ROL = {
  candidato:  "/candidato/dashboard",
  empresa:    "/empresa/dashboard",
  moderador:  "/moderador/ofertas",
  admin:      "/admin/dashboard",
  superadmin: "/admin/dashboard",
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario]           = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  const fetchPerfil = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Tabla no existe aún o el trigger no corrió todavía —
        // usar datos básicos del auth session como fallback
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const meta = authData.user.user_metadata || {};
          const email = authData.user.email || "";
          setUsuario({
            id:    authData.user.id,
            email,
            nombre: meta.nombre || email.split("@")[0],
            rol:    email === "jaimepinedo95@gmail.com" ? "superadmin" : (meta.rol || "candidato"),
            activo: true,
          });
        } else {
          setUsuario(null);
        }
      } else if (data) {
        setUsuario(data);
      }
    } catch (e) {
      console.error("AuthContext fetchPerfil:", e);
      setUsuario(null);
    } finally {
      setCargandoAuth(false);
    }
  }, []);

  useEffect(() => {
    // Verificar sesión existente al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchPerfil(session.user.id);
      } else {
        setCargandoAuth(false);
      }
    });

    // Escuchar cambios de auth (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session?.user) {
          await fetchPerfil(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUsuario(null);
          setCargandoAuth(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchPerfil]);

  // ── Autenticación ──────────────────────────────────────────────────────────

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Traduce mensajes de error al español
      if (error.message.includes("Invalid login credentials"))
        throw new Error("Correo o contraseña incorrectos.");
      if (error.message.includes("Email not confirmed"))
        throw new Error("Confirma tu correo antes de iniciar sesión.");
      throw new Error(error.message);
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  const registrarCandidato = async (nombre, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, rol: "candidato" } },
    });
    if (error) {
      if (error.message.includes("already registered"))
        throw new Error("Ya existe una cuenta con ese correo.");
      throw new Error(error.message);
    }
    return data;
  };

  const registrarEmpresa = async (nombreEmpresa, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre: nombreEmpresa, rol: "empresa", nombre_empresa: nombreEmpresa } },
    });
    if (error) {
      if (error.message.includes("already registered"))
        throw new Error("Ya existe una cuenta con ese correo.");
      throw new Error(error.message);
    }
    return data;
  };

  const recuperarPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nueva-password`,
    });
    if (error) throw new Error(error.message);
  };

  // ── Permisos ───────────────────────────────────────────────────────────────

  const tienePermiso = (permiso) => {
    if (!usuario?.rol) return false;
    return PERMISOS_ROL[usuario.rol]?.includes(permiso) ?? false;
  };

  const esRol = (...roles) => roles.includes(usuario?.rol);

  const cambiarRolUsuario = async (userId, nuevoRol) => {
    const { error } = await supabase
      .from("usuarios")
      .update({ rol: nuevoRol })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    // Si es el usuario actual, actualiza el estado local
    if (usuario?.id === userId) setUsuario((u) => ({ ...u, rol: nuevoRol }));
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      cargandoAuth,
      login,
      logout,
      registrarCandidato,
      registrarEmpresa,
      recuperarPassword,
      tienePermiso,
      esRol,
      cambiarRolUsuario,
      DESTINO_POR_ROL,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
