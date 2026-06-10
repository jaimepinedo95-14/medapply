-- ═══════════════════════════════════════════════════════════════════════════
-- MedApply — Tabla de alertas de empleo por email para candidatos
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.alertas_empleo (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidato_id  UUID        NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  categoria     TEXT,
  ciudad        TEXT,
  tipo_contrato TEXT,
  frecuencia    TEXT        NOT NULL DEFAULT 'semanal'
                            CHECK (frecuencia IN ('diaria', 'semanal')),
  activa        BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alertas_candidato ON public.alertas_empleo (candidato_id);
CREATE INDEX IF NOT EXISTS idx_alertas_activa    ON public.alertas_empleo (activa);

-- ── RLS ───────────────────────────────────────────────────────────────────────

ALTER TABLE public.alertas_empleo ENABLE ROW LEVEL SECURITY;

-- El candidato solo ve sus propias alertas
CREATE POLICY "alertas_select_own"
  ON public.alertas_empleo FOR SELECT
  USING (candidato_id = auth.uid());

-- Solo puede crear alertas para sí mismo
CREATE POLICY "alertas_insert_own"
  ON public.alertas_empleo FOR INSERT
  WITH CHECK (candidato_id = auth.uid());

-- Solo puede actualizar sus propias alertas
CREATE POLICY "alertas_update_own"
  ON public.alertas_empleo FOR UPDATE
  USING (candidato_id = auth.uid());

-- Solo puede eliminar sus propias alertas
CREATE POLICY "alertas_delete_own"
  ON public.alertas_empleo FOR DELETE
  USING (candidato_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.alertas_empleo TO authenticated;
