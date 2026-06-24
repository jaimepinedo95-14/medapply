-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Permite a las empresas leer el CV de sus propios postulantes
-- El bucket 'cvs' es privado: solo el dueño (cvs_owner_access, 001_schema.sql)
-- o un admin (cvs_admin_read, 003_add_perfil_columns.sql) podían generar una
-- signed URL. Las empresas no tenían ningún permiso, por lo que "Ver hoja de
-- vida completa" en el panel de empresa fallaba. Esta política otorga acceso
-- SOLO a los CVs de candidatos que se postularon a alguna vacante de esa
-- empresa — mismo principio ya usado en 008_panel_empresa_rediseno.sql.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "cvs_empresa_postulantes_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cvs'
    AND get_mi_rol() = 'empresa'
    AND EXISTS (
      SELECT 1
      FROM public.postulaciones p
      JOIN public.ofertas o ON o.id = p.oferta_id
      WHERE o.empresa_id = auth.uid()
        AND p.candidato_id::text = (storage.foldername(name))[1]
    )
  );
