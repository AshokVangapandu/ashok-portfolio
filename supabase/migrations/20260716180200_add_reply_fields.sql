-- Alter contact_messages table to add reply tracking and read status fields
ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Comment on newly added columns for schema documentation
COMMENT ON COLUMN public.contact_messages.is_read IS 'Flag indicating if the message has been viewed or replied to by an administrator.';
COMMENT ON COLUMN public.contact_messages.replied_at IS 'Timestamp when the administrator clicked reply to open the compose flow.';
COMMENT ON COLUMN public.contact_messages.updated_at IS 'Timestamp for the last state modifications.';
