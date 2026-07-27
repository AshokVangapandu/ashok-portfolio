-- Convert all existing emails in public.admins to lowercase
UPDATE public.admins SET email = LOWER(email);

-- Add check constraint to enforce lowercase email values
ALTER TABLE public.admins DROP CONSTRAINT IF EXISTS check_email_lowercase;
ALTER TABLE public.admins ADD CONSTRAINT check_email_lowercase CHECK (email = LOWER(email));
