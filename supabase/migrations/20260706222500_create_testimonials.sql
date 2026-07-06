-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  linkedin_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT FALSE CHECK (consent = TRUE),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast reads of approved and featured testimonials in the live carousel
CREATE INDEX IF NOT EXISTS idx_testimonials_status_featured ON testimonials (status, featured DESC, created_at DESC);

-- Automatic updated_at trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row-Level Security (RLS)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY: Anyone (anonymous and authenticated) can read approved testimonials
CREATE POLICY "Allow public select of approved testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (status = 'approved');

-- 2. INSERT POLICY: Anyone can submit a testimonial as long as status is 'pending' and featured is 'false'
CREATE POLICY "Allow public insert of pending testimonials"
  ON testimonials
  FOR INSERT
  TO public
  WITH CHECK (
    status = 'pending' 
    AND featured = FALSE
    AND consent = TRUE
  );

-- 3. ADMIN POLICIES: Owner matching the Google Account email can perform all actions
CREATE POLICY "Allow admin select all"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'ashokvangapandu45@gmail.com');

CREATE POLICY "Allow admin insert all"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = 'ashokvangapandu45@gmail.com');

CREATE POLICY "Allow admin update all"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'ashokvangapandu45@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'ashokvangapandu45@gmail.com');

CREATE POLICY "Allow admin delete all"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'ashokvangapandu45@gmail.com');
