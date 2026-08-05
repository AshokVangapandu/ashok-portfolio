-- 1. Insert default profiles for any existing orphaned visitor IDs to prevent FK constraint validation failure
INSERT INTO public.visitor_profiles (visitor_id, updated_at)
SELECT DISTINCT visitor_id, NOW()
FROM public.visitor_sessions
ON CONFLICT (visitor_id) DO NOTHING;

-- 2. Add foreign key constraint to visitor_sessions referencing visitor_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_visitor_sessions_visitor_profile' 
      AND table_name = 'visitor_sessions'
  ) THEN
    ALTER TABLE public.visitor_sessions
    ADD CONSTRAINT fk_visitor_sessions_visitor_profile
    FOREIGN KEY (visitor_id) REFERENCES public.visitor_profiles(visitor_id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Cleanup temporary investigation policies for anon role
DROP POLICY IF EXISTS temp_anon_select ON public.visitor_profiles;
DROP POLICY IF EXISTS temp_anon_select ON public.visitor_sessions;
DROP POLICY IF EXISTS temp_anon_select ON public.page_views;
