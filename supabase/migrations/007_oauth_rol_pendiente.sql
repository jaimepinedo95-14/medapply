-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Rol "pendiente" para registros via OAuth (Google/Apple)
-- Google y Apple no informan si el usuario es candidato o empresa, así que el
-- trigger ya no asume "candidato" por defecto: deja el rol en 'pendiente' y la
-- pantalla /auth/callback le pide al usuario que elija antes de redirigirlo.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_check;
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_rol_check
  CHECK (rol IN ('candidato','empresa','moderador','admin','superadmin','pendiente'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rol           TEXT;
  v_nombre        TEXT;
  v_nombre_empresa TEXT;
BEGIN
  -- jaimepinedo95@gmail.com siempre es superadmin
  IF NEW.email = 'jaimepinedo95@gmail.com' THEN
    v_rol := 'superadmin';
  ELSIF NEW.raw_user_meta_data->>'rol' IS NOT NULL THEN
    v_rol := NEW.raw_user_meta_data->>'rol';
  ELSE
    -- Sin rol en metadata: registro via OAuth (Google/Apple).
    -- Queda "pendiente" hasta que el usuario elija en /auth/callback.
    v_rol := 'pendiente';
  END IF;

  v_nombre := COALESCE(
    NEW.raw_user_meta_data->>'nombre',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.usuarios (id, email, nombre, rol)
  VALUES (NEW.id, NEW.email, v_nombre, v_rol)
  ON CONFLICT (id) DO NOTHING;

  IF v_rol = 'candidato' THEN
    INSERT INTO public.perfiles_candidato (usuario_id)
    VALUES (NEW.id)
    ON CONFLICT (usuario_id) DO NOTHING;

  ELSIF v_rol = 'empresa' THEN
    v_nombre_empresa := COALESCE(
      NEW.raw_user_meta_data->>'nombre_empresa',
      v_nombre
    );
    INSERT INTO public.perfiles_empresa (usuario_id, nombre_empresa)
    VALUES (NEW.id, v_nombre_empresa)
    ON CONFLICT (usuario_id) DO NOTHING;
  END IF;

  -- Si v_rol = 'pendiente', no se crea ningún perfil todavía;
  -- se creará cuando el usuario elija su rol en /auth/callback
  -- (ver AuthContext.elegirRolOAuth).

  RETURN NEW;
END;
$$;
