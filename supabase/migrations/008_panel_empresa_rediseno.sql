-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Rediseño del panel de empresa: plan "estandar" + visibilidad de
-- contacto de postulantes para empresas
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Nuevo nivel de plan "estandar" entre básico y premium ────────────────────
ALTER TABLE public.perfiles_empresa DROP CONSTRAINT IF EXISTS perfiles_empresa_plan_check;
ALTER TABLE public.perfiles_empresa ADD CONSTRAINT perfiles_empresa_plan_check
  CHECK (plan IN ('gratuito','basico','estandar','premium'));

-- ── Permite a la empresa ver nombre y email SOLO de candidatos que se
--    postularon a alguna de sus propias vacantes (necesario para el botón
--    "Contactar" en el panel de empresa). No otorga acceso a usuarios sin
--    relación de postulación.
CREATE POLICY "usuarios_select_postulantes_empresa"
  ON public.usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.postulaciones p
      JOIN public.ofertas o ON o.id = p.oferta_id
      WHERE p.candidato_id = usuarios.id
        AND o.empresa_id = auth.uid()
    )
  );
