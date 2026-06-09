-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Migración 003: columnas faltantes + políticas Storage
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- DEBE ejecutarse después de 001_schema.sql y 002_fix_rls_recursion.sql
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Nuevas columnas en perfiles_candidato ─────────────────────────────────────
ALTER TABLE public.perfiles_candidato
  ADD COLUMN IF NOT EXISTS experiencias JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS educaciones  JSONB DEFAULT '[]';

-- ── Nueva columna en perfiles_empresa ────────────────────────────────────────
ALTER TABLE public.perfiles_empresa
  ADD COLUMN IF NOT EXISTS sitio_web TEXT;

-- ── Políticas Storage: permitir re-subida (UPDATE) ───────────────────────────
-- fotos-perfil
DROP POLICY IF EXISTS "fotos_auth_update" ON storage.objects;
CREATE POLICY "fotos_auth_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'fotos-perfil' AND auth.role() = 'authenticated');

-- logos
DROP POLICY IF EXISTS "logos_auth_update" ON storage.objects;
CREATE POLICY "logos_auth_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- ── Políticas Storage: admin puede leer CVs y videos de candidatos ────────────
DROP POLICY IF EXISTS "cvs_admin_read" ON storage.objects;
CREATE POLICY "cvs_admin_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cvs' AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid() AND rol IN ('admin', 'superadmin')
      )
    )
  );

DROP POLICY IF EXISTS "videos_admin_read" ON storage.objects;
CREATE POLICY "videos_admin_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'videos' AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid() AND rol IN ('admin', 'superadmin')
      )
    )
  );
