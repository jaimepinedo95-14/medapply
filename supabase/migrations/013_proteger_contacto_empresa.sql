-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Proteger datos de contacto de la empresa frente a candidatos/público
-- La política "pe_select_public" (USING true, desde 001/002) permite que
-- CUALQUIERA — incluso sin autenticarse — lea la fila completa de
-- perfiles_empresa, incluyendo el teléfono. PerfilPublicoEmpresa.jsx además
-- mostraba ese teléfono y el email (via join a usuarios) directamente en la
-- página pública. Esta migración:
--   1. Reemplaza el acceso público "a todo" por un acceso de admin explícito.
--   2. Crea una vista pública segura (solo columnas no sensibles) para que
--      /empresas/:id siga funcionando sin exponer teléfono/email/NIT como
--      dato de contacto directo.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "pe_select_public" ON public.perfiles_empresa;

-- Solo admin/superadmin pueden leer la fila completa (incluye teléfono, NIT).
-- Las empresas ya pueden leer/editar su propia fila via "pe_all_own".
CREATE POLICY "pe_select_admin"
  ON public.perfiles_empresa FOR SELECT
  USING (get_mi_rol() IN ('admin', 'superadmin'));

-- Vista pública segura: sin teléfono, sin email, sin NIT. Solo lo necesario
-- para que un candidato vea "quién publica la vacante", nunca cómo contactarla
-- directamente. Corre con los privilegios del propietario de la vista, así que
-- no depende de (ni se ve afectada por) el cambio de política anterior.
CREATE OR REPLACE VIEW public.perfiles_empresa_publico AS
SELECT
  usuario_id,
  nombre_empresa,
  logo,
  descripcion,
  tipo_empresa,
  ciudad
FROM public.perfiles_empresa;

GRANT SELECT ON public.perfiles_empresa_publico TO anon, authenticated;
