-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Búsqueda inteligente de candidatos para empresas (versión restringida)
-- Las empresas ven nombre de cualquier candidato en los resultados de búsqueda,
-- pero el email y el acceso al perfil completo solo se desbloquean desde el
-- plan Estándar en adelante (control aplicado en el frontend). El email NUNCA
-- se expone a través de esta vista, sin importar el plan: estructuralmente no
-- forma parte de las columnas seleccionadas.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

-- IMPORTANTE: esta vista se crea SIN security_invoker para que corra con los
-- permisos de su propietario (el rol que ejecuta esta migración en el SQL
-- Editor) y así pueda listar candidatos sin quedar sujeta al RLS restrictivo
-- de la tabla base `usuarios`. Como la vista solo expone id y nombre — nunca
-- email ni ninguna otra columna — esto no amplía qué datos sensibles son
-- visibles, solo permite el listado de nombres necesario para la búsqueda.
CREATE OR REPLACE VIEW public.candidatos_busqueda_publica AS
SELECT id, nombre
FROM public.usuarios
WHERE rol = 'candidato';

GRANT SELECT ON public.candidatos_busqueda_publica TO authenticated;
