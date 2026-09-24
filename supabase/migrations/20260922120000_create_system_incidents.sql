-- Migration: 20260922120000_create_system_incidents.sql
-- Table: public.system_incidents for System Monitor Phase 7 Persistent Incidents

CREATE TABLE IF NOT EXISTS public.system_incidents (
    id TEXT PRIMARY KEY,
    incident_key TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'acknowledged' | 'resolved'
    severity TEXT NOT NULL DEFAULT 'high', -- 'critical' | 'high' | 'medium' | 'low'
    source_type TEXT NOT NULL, -- 'TECHNICAL_COMPONENT' | 'PRODUCTION_WORKFLOW' | 'DATA_INTEGRITY' | 'SECURITY'
    source_id TEXT,
    component_name TEXT,
    workflow_name TEXT,
    check_id TEXT,
    evidence_type TEXT,
    first_detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT,
    resolution_note TEXT,
    recovery_detected_at TIMESTAMPTZ,
    sanitized_error TEXT,
    latest_evidence TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_simulated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments on table columns
COMMENT ON TABLE public.system_incidents IS 'Persistent diagnostic incidents and lifecycle history for System Monitor.';
COMMENT ON COLUMN public.system_incidents.id IS 'Unique incident ID in INC-timestamp-random format.';
COMMENT ON COLUMN public.system_incidents.incident_key IS 'Deduplication key (sourceType:targetResource:checkId).';
COMMENT ON COLUMN public.system_incidents.status IS 'Current lifecycle state: open, acknowledged, resolved.';
COMMENT ON COLUMN public.system_incidents.occurrence_count IS 'Counter of repeated observations of the same active incident.';
COMMENT ON COLUMN public.system_incidents.is_simulated IS 'Flag indicating if the incident originated from a diagnostic simulation.';

-- Indexes for efficient querying by status, key, and timestamps
CREATE INDEX IF NOT EXISTS idx_system_incidents_status ON public.system_incidents(status);
CREATE INDEX IF NOT EXISTS idx_system_incidents_key_status ON public.system_incidents(incident_key, status);
CREATE INDEX IF NOT EXISTS idx_system_incidents_last_detected ON public.system_incidents(last_detected_at DESC);

-- Enable Row Level Security
ALTER TABLE public.system_incidents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to read system incidents
CREATE POLICY "Allow authenticated admins to read system incidents"
ON public.system_incidents
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admins
        WHERE public.admins.email = auth.jwt() ->> 'email'
        AND public.admins.is_active = true
    )
);

-- Allow authenticated admins to insert system incidents
CREATE POLICY "Allow authenticated admins to insert system incidents"
ON public.system_incidents
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admins
        WHERE public.admins.email = auth.jwt() ->> 'email'
        AND public.admins.is_active = true
    )
);

-- Allow authenticated admins to update system incidents
CREATE POLICY "Allow authenticated admins to update system incidents"
ON public.system_incidents
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admins
        WHERE public.admins.email = auth.jwt() ->> 'email'
        AND public.admins.is_active = true
    )
);
