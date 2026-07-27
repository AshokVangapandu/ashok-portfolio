-- Standardize existing platform names to lowercase keys
UPDATE public.social_links SET platform = 'linkedin' WHERE LOWER(platform) = 'linkedin';
UPDATE public.social_links SET platform = 'github' WHERE LOWER(platform) = 'github';
UPDATE public.social_links SET platform = 'behance' WHERE LOWER(platform) = 'behance';
UPDATE public.social_links SET platform = 'instagram' WHERE LOWER(platform) = 'instagram';
UPDATE public.social_links SET platform = 'whatsapp' WHERE LOWER(platform) = 'whatsapp';
UPDATE public.social_links SET platform = 'email' WHERE LOWER(platform) = 'email';

-- Delete any unsupported platforms to maintain clean config
DELETE FROM public.social_links WHERE platform NOT IN ('linkedin', 'github', 'behance', 'instagram', 'whatsapp', 'email');

-- Insert missing default rows with default URLs
INSERT INTO public.social_links (platform, url, display_order)
VALUES 
  ('linkedin', 'https://www.linkedin.com/in/ashok-vangapandu', 1),
  ('github', 'https://github.com/AshokVangapandu', 2),
  ('behance', 'https://www.behance.net/ashokv13', 3),
  ('whatsapp', 'https://wa.me/919182566082?text=Hi%20Ashok%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you%20regarding%20your%20work.', 4),
  ('instagram', 'https://www.instagram.com/ashok_vangapandu?igsh=amM1cTVldDVsZjh3', 5),
  ('email', 'mailto:ashokvangapandu45@gmail.com', 6)
ON CONFLICT (platform) DO NOTHING;
