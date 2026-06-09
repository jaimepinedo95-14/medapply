-- ═══════════════════════════════════════════════════════════════════════════
-- MedApply — Estadísticas públicas y acceso anónimo
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Permitir que usuarios anónimos cuenten perfiles_candidato
--    (para mostrar totales reales en la página de inicio)
-- ─────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "pc_select_public" ON public.perfiles_candidato;

CREATE POLICY "pc_select_public"
  ON public.perfiles_candidato FOR SELECT
  TO anon
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Función SECURITY DEFINER para contar sin restricciones de RLS
--    Accesible para cualquier visitante (anon o authenticated)
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_stats_publicos()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'candidatos', (SELECT COUNT(*) FROM public.perfiles_candidato),
    'empresas',   (SELECT COUNT(*) FROM public.perfiles_empresa),
    'ofertas',    (SELECT COUNT(*) FROM public.ofertas WHERE estado = 'activa')
  )
$$;

GRANT EXECUTE ON FUNCTION public.get_stats_publicos() TO anon;
GRANT EXECUTE ON FUNCTION public.get_stats_publicos() TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Habilitar realtime para las tablas de estadísticas
-- ─────────────────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.perfiles_candidato;
ALTER PUBLICATION supabase_realtime ADD TABLE public.perfiles_empresa;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ofertas;
