
-- Create blogs table
CREATE TABLE public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  content text,
  excerpt text,
  cover_image text,
  author_id uuid,
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blogs" ON public.blogs FOR SELECT USING (status = 'published' OR is_admin(auth.uid()));
CREATE POLICY "Admins can insert blogs" ON public.blogs FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update blogs" ON public.blogs FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete blogs" ON public.blogs FOR DELETE USING (is_admin(auth.uid()));

-- Create testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  company text,
  content text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url text,
  is_featured boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible testimonials" ON public.testimonials FOR SELECT USING (is_visible = true OR is_admin(auth.uid()));
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (is_admin(auth.uid()));

-- Create banners table
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  link_url text,
  position text DEFAULT 'homepage' CHECK (position IN ('homepage', 'sidebar', 'popup', 'header')),
  is_active boolean DEFAULT true,
  start_date timestamptz,
  end_date timestamptz,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active banners" ON public.banners FOR SELECT USING (is_active = true OR is_admin(auth.uid()));
CREATE POLICY "Admins can insert banners" ON public.banners FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update banners" ON public.banners FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete banners" ON public.banners FOR DELETE USING (is_admin(auth.uid()));

-- Create courses table
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  duration text,
  degree_type text,
  stream text,
  avg_fees numeric,
  eligibility text,
  career_options text[],
  top_colleges text[],
  is_popular boolean DEFAULT false,
  status text DEFAULT 'published',
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (is_admin(auth.uid()));

-- Create exams table
CREATE TABLE public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  full_name text,
  description text,
  exam_date text,
  registration_start text,
  registration_end text,
  eligibility text,
  exam_pattern text,
  syllabus text,
  preparation_tips text,
  conducting_body text,
  mode text,
  frequency text,
  official_website text,
  is_popular boolean DEFAULT false,
  status text DEFAULT 'published',
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Admins can insert exams" ON public.exams FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update exams" ON public.exams FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete exams" ON public.exams FOR DELETE USING (is_admin(auth.uid()));

-- Create SEO settings table
CREATE TABLE public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  noindex boolean DEFAULT false,
  schema_markup jsonb,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read SEO settings" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage SEO settings" ON public.seo_settings FOR ALL USING (is_admin(auth.uid()));
