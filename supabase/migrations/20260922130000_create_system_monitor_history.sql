-- Migration: 20260922130000_create_system_monitor_history.sql
-- Table: public.system_monitor_history for System Monitor Phase 8 Monitoring History & Trends

CREATE TABLE IF NOT EXISTS public.system_monitor_history (
    id TEXT PRIMARY KEY,
    source_type TEXT NOT NULL, -- 'TECHNICAL_COMPONENT' | 'PRODUCTION_WORKFLOW' | 'DATA_INTEGRITY' | 'SECURITY'
    source_id TEXT NOT NULL,
    check_id TEXT,
    status TEXT NOT NULL, -- 'healthy' | 'degraded' | 'down' | 'unknown' | 'warning' | 'failed'
    verification_status TEXT NOT NULL DEFAULT 'not_verified', -- 'verified' | 'partially_verified' | 'not_verified'
    response_time_ms NUMERIC,
    evidence_type TEXT,
    severity TEXT,
    sanitized_summary TEXT,
    incident_id TEXT,
    is_simulated BOOLEAN NOT NULL DEFAULT false,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments on table columns
COMMENT ON TABLE public.system_monitor_history IS 'Persistent diagnostic health evaluation history and metric observations for System Monitor.';
COMMENT ON COLUMN public.system_monitor_history.id IS 'Unique history record ID in HIST-timestamp-random format.';
COMMENT ON COLUMN public.system_monitor_history.source_type IS 'Diagnostic source domain.';
COMMENT ON COLUMN public.system_monitor_history.source_id IS 'Target component or workflow identifier.';
COMMENT ON COLUMN public.system_monitor_history.status IS 'Observed health or check status at evaluation time.';
COMMENT ON COLUMN public.system_monitor_history.verification_status IS 'Observed verification level at evaluation time.';
COMMENT ON COLUMN public.system_monitor_history.response_time_ms IS 'Actual recorded probe execution duration in milliseconds.';
COMMENT ON COLUMN public.system_monitor_history.incident_id IS 'Optional foreign key / correlation to public.system_incidents.';

-- Indexes for efficient historical range queries and metric aggregations
CREATE INDEX IF NOT EXISTS idx_system_monitor_history_source_eval ON public.system_monitor_history(source_type, source_id, evaluated_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_monitor_history_eval ON public.system_monitor_history(evaluated_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_monitor_history_check ON public.system_monitor_history(check_id);
CREATE INDEX IF NOT EXISTS idx_system_monitor_history_incident ON public.system_monitor_history(incident_id);

-- Enable Row Level Security
ALTER TABLE public.system_monitor_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to read monitoring history
CREATE POLICY "Allow authenticated admins to read monitoring history"
ON public.system_monitor_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admins
        WHERE public.admins.email = auth.jwt() ->> 'email'
        AND public.admins.is_active = true
    )
);

-- Allow authenticated admins to insert monitoring history
CREATE POLICY "Allow authenticated admins to insert monitoring history"
ON public.system_monitor_history
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admins
        WHERE public.admins.email = auth.jwt() ->> 'email'
        AND public.admins.is_active = true
    )
);

-- Allow authenticated admins to delete simulated monitoring history during resets
CREATE POLICY "Allow authenticated admins to delete simulated monitoring history"
ON public.system_monitor_history
FOR DELETE
TO authenticated
USING (
    is_simulated = true
    AND EXISTS (
        SELECT 1 FROM public.admins
        WHERE public.admins.email = auth.jwt() ->> 'email'
        AND public.admins.is_active = true
    )
);
