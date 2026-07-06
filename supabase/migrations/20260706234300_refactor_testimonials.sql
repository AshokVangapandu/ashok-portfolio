-- Drop old table if exists
DROP TABLE IF EXISTS testimonials;

-- Create refactored testimonials table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID NOT NULL,
  google_name TEXT,
  google_email TEXT NOT NULL,
  google_avatar TEXT,
  linkedin_url TEXT,
  testimonial TEXT NOT NULL CONSTRAINT check_testimonial_length CHECK (char_length(testimonial) <= 500),
  consent_public BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CONSTRAINT check_status_value CHECK (status IN ('pending', 'approved', 'rejected')),
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  source TEXT NOT NULL DEFAULT 'portfolio',
  ip_address TEXT,
  user_agent TEXT
);

-- Create performance indexes
CREATE INDEX idx_testimonials_user_id ON testimonials(user_id);
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX idx_testimonials_approved ON testimonials(approved);
CREATE INDEX idx_testimonials_status ON testimonials(status);

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

-- 1. SELECT POLICY: Anyone can read approved testimonials
CREATE POLICY "Allow public select of approved testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (status = 'approved');

-- 2. SELECT POLICY: Authenticated users can read their own submissions (pending or rejected)
CREATE POLICY "Allow users to select own"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. INSERT POLICY: Authenticated users can insert their own testimonials
CREATE POLICY "Allow authenticated insert own"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND status = 'pending' 
    AND approved = FALSE
  );

-- 4. ADMIN POLICIES: Full management rights for ashokvangapandu45@gmail.com
CREATE POLICY "Allow admin select all"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'ashokvangapandu45@gmail.com');

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

