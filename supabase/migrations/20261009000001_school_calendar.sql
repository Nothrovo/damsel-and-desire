-- ============================================================================
-- Migration: 20261009000001_school_calendar.sql
-- Description: Progressive School Calendar Global State (April-March Timeline)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.school_calendar_state (
  id TEXT PRIMARY KEY DEFAULT 'housen_default',
  current_month_id TEXT NOT NULL DEFAULT 'april',
  completed_event_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  month_notes JSONB NOT NULL DEFAULT '{}'::jsonb,
  academic_year INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default state row
INSERT INTO public.school_calendar_state (
  id,
  current_month_id,
  completed_event_ids,
  custom_events,
  month_notes,
  academic_year
) VALUES (
  'housen_default',
  'april',
  '[]'::jsonb,
  '[]'::jsonb,
  '{}'::jsonb,
  1
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (Communal Open Access)
ALTER TABLE public.school_calendar_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read school_calendar_state" ON public.school_calendar_state;
DROP POLICY IF EXISTS "Public manage school_calendar_state" ON public.school_calendar_state;

CREATE POLICY "Public read school_calendar_state"
  ON public.school_calendar_state FOR SELECT USING (true);

CREATE POLICY "Public manage school_calendar_state"
  ON public.school_calendar_state FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.school_calendar_state TO anon, authenticated;
