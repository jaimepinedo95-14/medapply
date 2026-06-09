-- ═══════════════════════════════════════════════════════════════════════════
-- MedApply — Fix recursión infinita en RLS
-- Supabase Dashboard → SQL Editor → New query → pegar todo → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 1: Eliminar TODAS las políticas existentes
-- ─────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "usuarios_select_own"     ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_own"     ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insert_trigger" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_admin"   ON public.usuarios;

DROP POLICY IF EXISTS "pc_all_own"        ON public.perfiles_candidato;
DROP POLICY IF EXISTS "pc_select_empresa" ON public.perfiles_candidato;

DROP POLICY IF EXISTS "pe_all_own"        ON public.perfiles_empresa;
DROP POLICY IF EXISTS "pe_select_public"  ON public.perfiles_empresa;
DROP POLICY IF EXISTS "pe_insert_trigger" ON public.perfiles_empresa;

DROP POLICY IF EXISTS "ofertas_select_active"  ON public.ofertas;
DROP POLICY IF EXISTS "ofertas_insert_empresa" ON public.ofertas;
DROP POLICY IF EXISTS "ofertas_update_empresa" ON public.ofertas;
DROP POLICY IF EXISTS "ofertas_admin"          ON public.ofertas;

DROP POLICY IF EXISTS "post_own"            ON public.postulaciones;
DROP POLICY IF EXISTS "post_empresa_select" ON public.postulaciones;
DROP POLICY IF EXISTS "post_empresa_update" ON public.postulaciones;

DROP POLICY IF EXISTS "notif_own"           ON public.notificaciones;
DROP POLICY IF EXISTS "notif_insert_system" ON public.notificaciones;

DROP POLICY IF EXISTS "msg_own"   ON public.mensajes;

DROP POLICY IF EXISTS "sus_own"   ON public.suscripciones;
DROP POLICY IF EXISTS "sus_admin" ON public.suscripciones;

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 2: Funciones SECURITY DEFINER
-- Corren con privilegios del owner → NO activan RLS → no hay recursión
-- ─────────────────────────────────────────────────────────────────────────

-- Retorna el rol del usuario actual como texto
CREATE OR REPLACE FUNCTION public.get_mi_rol()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rol FROM public.usuarios WHERE id = auth.uid()
$$;

-- Retorna true si el usuario es admin o superadmin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id = auth.uid()
      AND rol IN ('admin', 'superadmin')
  )
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 3: Políticas — usuarios
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "usuarios_insert_trigger"
  ON public.usuarios FOR INSERT
  WITH CHECK (true);

CREATE POLICY "usuarios_select_own"
  ON public.usuarios FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "usuarios_update_own"
  ON public.usuarios FOR UPDATE
  USING (auth.uid() = id OR is_admin());

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 4: Políticas — perfiles_candidato
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "pc_all_own"
  ON public.perfiles_candidato FOR ALL
  USING (auth.uid() = usuario_id);

CREATE POLICY "pc_select_empresa"
  ON public.perfiles_candidato FOR SELECT
  USING (get_mi_rol() IN ('empresa', 'admin', 'superadmin'));

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 5: Políticas — perfiles_empresa
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "pe_all_own"
  ON public.perfiles_empresa FOR ALL
  USING (auth.uid() = usuario_id);

CREATE POLICY "pe_select_public"
  ON public.perfiles_empresa FOR SELECT
  USING (true);

CREATE POLICY "pe_insert_trigger"
  ON public.perfiles_empresa FOR INSERT
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 6: Políticas — ofertas
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "ofertas_select_active"
  ON public.ofertas FOR SELECT
  USING (
    estado = 'activa'
    OR auth.uid() = empresa_id
    OR is_admin()
    OR get_mi_rol() = 'moderador'
  );

CREATE POLICY "ofertas_insert_empresa"
  ON public.ofertas FOR INSERT
  WITH CHECK (
    auth.uid() = empresa_id
    AND get_mi_rol() = 'empresa'
  );

CREATE POLICY "ofertas_update_empresa"
  ON public.ofertas FOR UPDATE
  USING (auth.uid() = empresa_id OR is_admin());

CREATE POLICY "ofertas_admin"
  ON public.ofertas FOR ALL
  USING (is_admin() OR get_mi_rol() = 'moderador');

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 7: Políticas — postulaciones
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "post_own"
  ON public.postulaciones FOR ALL
  USING (auth.uid() = candidato_id);

CREATE POLICY "post_empresa_select"
  ON public.postulaciones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ofertas o
    WHERE o.id = oferta_id AND o.empresa_id = auth.uid()
  ));

CREATE POLICY "post_empresa_update"
  ON public.postulaciones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.ofertas o
    WHERE o.id = oferta_id AND o.empresa_id = auth.uid()
  ));

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 8: Políticas — notificaciones
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "notif_own"
  ON public.notificaciones FOR ALL
  USING (auth.uid() = usuario_id);

CREATE POLICY "notif_insert_system"
  ON public.notificaciones FOR INSERT
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 9: Políticas — mensajes
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "msg_own"
  ON public.mensajes FOR ALL
  USING (auth.uid() = empresa_id OR auth.uid() = candidato_id);

-- ─────────────────────────────────────────────────────────────────────────
-- PASO 10: Políticas — suscripciones
-- ─────────────────────────────────────────────────────────────────────────

CREATE POLICY "sus_own"
  ON public.suscripciones FOR ALL
  USING (auth.uid() = usuario_id OR is_admin());
