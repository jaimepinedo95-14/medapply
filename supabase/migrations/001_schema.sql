-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Schema inicial
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

-- Extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tabla usuarios ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.usuarios (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT UNIQUE NOT NULL,
  nombre     TEXT NOT NULL,
  rol        TEXT NOT NULL DEFAULT 'candidato'
               CHECK (rol IN ('candidato','empresa','moderador','admin','superadmin')),
  activo     BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabla perfiles_candidato ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.perfiles_candidato (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id               UUID UNIQUE REFERENCES public.usuarios(id) ON DELETE CASCADE,
  foto                     TEXT,
  telefono                 TEXT,
  ciudad                   TEXT,
  categoria_profesional    TEXT,
  numero_tarjeta_profesional TEXT,
  verificado_rethus        BOOLEAN DEFAULT false,
  porcentaje_perfil        INTEGER DEFAULT 20,
  video_presentacion_url   TEXT,
  hoja_de_vida_url         TEXT,
  resumen                  TEXT,
  experiencia_anios        INTEGER DEFAULT 0,
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabla perfiles_empresa ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.perfiles_empresa (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id    UUID UNIQUE REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nombre_empresa TEXT NOT NULL DEFAULT '',
  nit           TEXT,
  logo          TEXT,
  descripcion   TEXT,
  tipo_empresa  TEXT,
  ciudad        TEXT,
  telefono      TEXT,
  plan          TEXT DEFAULT 'gratuito' CHECK (plan IN ('gratuito','basico','premium')),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabla ofertas ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ofertas (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id            UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  titulo                TEXT NOT NULL,
  descripcion           TEXT,
  requisitos            TEXT,
  ciudad                TEXT,
  tipo_contrato         TEXT,
  salario_min           BIGINT,
  salario_max           BIGINT,
  categoria_profesional TEXT,
  urgente               BOOLEAN DEFAULT false,
  estado                TEXT DEFAULT 'activa'
                          CHECK (estado IN ('activa','pausada','eliminada','pendiente')),
  fecha_publicacion     TIMESTAMPTZ DEFAULT NOW(),
  fecha_limite          DATE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabla postulaciones ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.postulaciones (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidato_id      UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  oferta_id         UUID REFERENCES public.ofertas(id) ON DELETE CASCADE,
  estado            TEXT DEFAULT 'pendiente'
                      CHECK (estado IN ('pendiente','vista','rechazada','aceptada','en_revision','preseleccionada')),
  fecha_postulacion TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidato_id, oferta_id)
);

-- ── Tabla notificaciones ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notificaciones (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id  UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL,
  titulo      TEXT NOT NULL,
  descripcion TEXT,
  leida       BOOLEAN DEFAULT false,
  accion_href  TEXT,
  accion_label TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabla mensajes ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mensajes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id    UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  candidato_id  UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  remitente_rol TEXT NOT NULL CHECK (remitente_rol IN ('empresa','candidato')),
  contenido     TEXT NOT NULL,
  leido         BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabla suscripciones ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.suscripciones (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id  UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  plan        TEXT NOT NULL,
  precio      BIGINT DEFAULT 0,
  fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
  fecha_fin   TIMESTAMPTZ,
  activo      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Vista: ofertas con datos de empresa ───────────────────────────────────────
CREATE OR REPLACE VIEW public.ofertas_con_empresa AS
SELECT
  o.id,
  o.empresa_id,
  o.titulo,
  o.descripcion,
  o.requisitos,
  o.ciudad,
  o.tipo_contrato,
  o.salario_min,
  o.salario_max,
  o.categoria_profesional,
  o.urgente,
  o.estado,
  o.fecha_publicacion,
  o.fecha_limite,
  o.created_at,
  COALESCE(pe.nombre_empresa, u.nombre) AS nombre_empresa,
  pe.logo                               AS logo_empresa,
  pe.tipo_empresa,
  pe.ciudad                             AS ciudad_empresa
FROM public.ofertas o
LEFT JOIN public.usuarios u       ON u.id = o.empresa_id
LEFT JOIN public.perfiles_empresa pe ON pe.usuario_id = o.empresa_id;

-- ── Trigger: auto-crear usuario y perfil al registrarse ──────────────────────
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
    v_rol := 'candidato';
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

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.usuarios            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles_candidato  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles_empresa    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ofertas             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postulaciones       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificaciones      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensajes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suscripciones       ENABLE ROW LEVEL SECURITY;

-- usuarios
CREATE POLICY "usuarios_select_own"   ON public.usuarios FOR SELECT
  USING (auth.uid() = id OR EXISTS(
    SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.rol IN ('admin','superadmin')
  ));
CREATE POLICY "usuarios_update_own"   ON public.usuarios FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "usuarios_insert_trigger" ON public.usuarios FOR INSERT WITH CHECK (true);

-- perfiles_candidato
CREATE POLICY "pc_all_own"          ON public.perfiles_candidato FOR ALL  USING (auth.uid() = usuario_id);
CREATE POLICY "pc_select_empresa"   ON public.perfiles_candidato FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.rol IN ('empresa','admin','superadmin')));

-- perfiles_empresa
CREATE POLICY "pe_all_own"          ON public.perfiles_empresa FOR ALL  USING (auth.uid() = usuario_id);
CREATE POLICY "pe_select_public"    ON public.perfiles_empresa FOR SELECT USING (true);
CREATE POLICY "pe_insert_trigger"   ON public.perfiles_empresa FOR INSERT WITH CHECK (true);

-- ofertas
CREATE POLICY "ofertas_select_active" ON public.ofertas FOR SELECT USING (estado = 'activa' OR auth.uid() = empresa_id);
CREATE POLICY "ofertas_insert_empresa" ON public.ofertas FOR INSERT
  WITH CHECK (auth.uid() = empresa_id AND EXISTS(
    SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.rol = 'empresa'
  ));
CREATE POLICY "ofertas_update_empresa" ON public.ofertas FOR UPDATE USING (auth.uid() = empresa_id);
CREATE POLICY "ofertas_admin"          ON public.ofertas FOR ALL
  USING (EXISTS(SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.rol IN ('admin','superadmin','moderador')));

-- postulaciones
CREATE POLICY "post_own"             ON public.postulaciones FOR ALL  USING (auth.uid() = candidato_id);
CREATE POLICY "post_empresa_select"  ON public.postulaciones FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.ofertas o WHERE o.id = oferta_id AND o.empresa_id = auth.uid()));
CREATE POLICY "post_empresa_update"  ON public.postulaciones FOR UPDATE
  USING (EXISTS(SELECT 1 FROM public.ofertas o WHERE o.id = oferta_id AND o.empresa_id = auth.uid()));

-- notificaciones
CREATE POLICY "notif_own"  ON public.notificaciones FOR ALL USING (auth.uid() = usuario_id);
CREATE POLICY "notif_insert_system" ON public.notificaciones FOR INSERT WITH CHECK (true);

-- mensajes
CREATE POLICY "msg_own"    ON public.mensajes FOR ALL USING (auth.uid() = empresa_id OR auth.uid() = candidato_id);

-- suscripciones
CREATE POLICY "sus_own"    ON public.suscripciones FOR ALL USING (auth.uid() = usuario_id);

-- ── Storage buckets ───────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES
  ('fotos-perfil', 'fotos-perfil', true),
  ('cvs',          'cvs',          false),
  ('videos',       'videos',       false),
  ('logos',        'logos',        true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "fotos_public_read"  ON storage.objects FOR SELECT USING (bucket_id = 'fotos-perfil');
CREATE POLICY "fotos_auth_upload"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fotos-perfil' AND auth.role() = 'authenticated');
CREATE POLICY "logos_public_read"  ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "logos_auth_upload"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "cvs_owner_access"   ON storage.objects FOR ALL USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "videos_owner_access" ON storage.objects FOR ALL USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
