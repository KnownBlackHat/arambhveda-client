
-- Create colleges table for all Indian institutions
CREATE TABLE public.colleges (
  id BIGSERIAL PRIMARY KEY,
  code TEXT,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  category TEXT,
  type TEXT,
  established INTEGER,
  approvals TEXT[],
  campus_area NUMERIC,
  courses TEXT[],
  avg_fees NUMERIC,
  admission_exams TEXT[],
  highest_package NUMERIC,
  avg_package NUMERIC,
  top_recruiters TEXT[],
  infrastructure TEXT[],
  rating NUMERIC,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Public read access (college listings are public)
CREATE POLICY "Colleges are publicly readable"
ON public.colleges
FOR SELECT
USING (true);

-- Create indexes for common queries
CREATE INDEX idx_colleges_city ON public.colleges (city);
CREATE INDEX idx_colleges_state ON public.colleges (state);
CREATE INDEX idx_colleges_category ON public.colleges (category);
CREATE INDEX idx_colleges_name ON public.colleges USING gin (to_tsvector('english', name));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_colleges_updated_at
BEFORE UPDATE ON public.colleges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
