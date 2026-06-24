-- ══════════════════════════════════════════════════════════════════════════════
-- MedApply — Retiro manual y expiración automática de vacantes
-- Agrega los estados 'cerrada' (retirada manualmente por la empresa) y
-- 'expirada' (pasaron 30 días desde fecha_publicacion) al CHECK de
-- ofertas.estado. Sin esto, los UPDATE a estos valores fallan silenciosamente
-- contra el constraint original ('activa','pausada','eliminada','pendiente').
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.ofertas DROP CONSTRAINT IF EXISTS ofertas_estado_check;
ALTER TABLE public.ofertas ADD CONSTRAINT ofertas_estado_check
  CHECK (estado IN ('activa','pausada','eliminada','pendiente','cerrada','expirada'));
