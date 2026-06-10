-- ═══════════════════════════════════════════════════════════════════════════
-- MedApply — Tabla de visitas a ofertas (analítica premium para empresas)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.visitas_ofertas (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  oferta_id   UUID        NOT NULL REFERENCES public.ofertas(id) ON DELETE CASCADE,
  usuario_id  UUID        REFERENCES public.usuarios(id) ON DELETE SET NULL,
  ip_anonima  TEXT,
  ciudad      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitas_oferta_id  ON public.visitas_ofertas (oferta_id);
CREATE INDEX IF NOT EXISTS idx_visitas_created_at ON public.visitas_ofertas (created_at);

-- ── RLS ───────────────────────────────────────────────────────────────────────

ALTER TABLE public.visitas_ofertas ENABLE ROW LEVEL SECURITY;

-- Empresa solo ve visitas de sus propias ofertas
CREATE POLICY "visitas_empresa_select"
  ON public.visitas_ofertas FOR SELECT
  USING (
    oferta_id IN (
      SELECT id FROM public.ofertas WHERE empresa_id = auth.uid()
    )
  );

-- Cualquier visitante (incluso anónimo) puede registrar una visita
CREATE POLICY "visitas_insert_public"
  ON public.visitas_ofertas FOR INSERT
  WITH CHECK (true);

GRANT INSERT ON public.visitas_ofertas TO anon;
GRANT INSERT ON public.visitas_ofertas TO authenticated;
GRANT SELECT ON public.visitas_ofertas TO authenticated;
