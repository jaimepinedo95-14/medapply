-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Notificaciones por email al postularse
-- El candidato necesita leer el email de la empresa para notificarle por
-- correo que alguien aplicó a su vacante. Ninguna política existente lo
-- permite (008 es la dirección inversa: empresa ve postulantes). Esta
-- política otorga acceso SOLO al email de la empresa duenya de una vacante
-- a la que el candidato se postuló — mismo principio que 008 y 011.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "usuarios_select_empresa_postulada"
  ON public.usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.postulaciones p
      JOIN public.ofertas o ON o.id = p.oferta_id
      WHERE o.empresa_id = usuarios.id
        AND p.candidato_id = auth.uid()
    )
  );
