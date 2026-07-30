-- 1. Deduplicate by keeping the lowercase row if a capitalized duplicate exists
DELETE FROM public.social_links a
WHERE a.platform != LOWER(a.platform)
  AND EXISTS (
    SELECT 1 FROM public.social_links b
    WHERE b.platform = LOWER(a.platform)
  );

-- 2. Standardize remaining capitalized platform names to lowercase keys
UPDATE public.social_links SET platform = LOWER(platform) WHERE platform != LOWER(platform);

-- 3. Delete any unsupported platforms to maintain clean config
DELETE FROM public.social_links WHERE platform NOT IN ('linkedin', 'github', 'behance', 'instagram', 'whatsapp', 'email');

-- 4. Insert missing default rows with default URLs
INSERT INTO public.social_links (platform, url, display_order)
VALUES 
  ('linkedin', 'https://www.linkedin.com/in/ashok-vangapandu', 1),
  ('github', 'https://github.com/AshokVangapandu', 2),
  ('behance', 'https://www.behance.net/ashokv13', 3),
  ('whatsapp', 'https://wa.me/919182566082?text=Hi%20Ashok%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you%20regarding%20your%20work.', 4),
  ('instagram', 'https://www.instagram.com/ashok_vangapandu?igsh=amM1cTVldDVsZjh3', 5),
  ('email', 'mailto:ashokvangapandu45@gmail.com', 6)
ON CONFLICT (platform) DO NOTHING;

-- 5. Add check constraint to enforce lowercase platform values
ALTER TABLE public.social_links DROP CONSTRAINT IF EXISTS check_platform_lowercase;
ALTER TABLE public.social_links ADD CONSTRAINT check_platform_lowercase CHECK (platform = LOWER(platform));
