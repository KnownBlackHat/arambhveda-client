
-- Enable pg_trgm for full text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  module TEXT NOT NULL,
  record_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Admins can view audit logs') THEN
    CREATE POLICY "Admins can view audit logs" ON public.activity_logs FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Admins can insert audit logs') THEN
    CREATE POLICY "Admins can insert audit logs" ON public.activity_logs FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON public.activity_logs(module);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- 2. SOFT DELETE
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 3. COLLEGE VERSIONING
CREATE TABLE IF NOT EXISTS public.college_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id BIGINT NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  version_number INT NOT NULL DEFAULT 1,
  edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  previous_content JSONB NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.college_versions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'college_versions' AND policyname = 'Admins can view versions') THEN
    CREATE POLICY "Admins can view versions" ON public.college_versions FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'college_versions' AND policyname = 'Admins can insert versions') THEN
    CREATE POLICY "Admins can insert versions" ON public.college_versions FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_college_versions_college ON public.college_versions(college_id, version_number DESC);

-- 4. SLUG REDIRECTS
CREATE TABLE IF NOT EXISTS public.slug_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  old_slug TEXT NOT NULL,
  new_slug TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'college',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'slug_redirects' AND policyname = 'Anyone can read redirects') THEN
    CREATE POLICY "Anyone can read redirects" ON public.slug_redirects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'slug_redirects' AND policyname = 'Admins can manage redirects') THEN
    CREATE POLICY "Admins can manage redirects" ON public.slug_redirects FOR ALL USING (public.is_admin(auth.uid()));
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_slug_redirects_old ON public.slug_redirects(old_slug);

-- 5. LEAD ENHANCEMENTS
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS reminder_flag BOOLEAN DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_stage TEXT DEFAULT 'new';

CREATE TABLE IF NOT EXISTS public.lead_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lead_status_history' AND policyname = 'Admins can view lead history') THEN
    CREATE POLICY "Admins can view lead history" ON public.lead_status_history FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lead_status_history' AND policyname = 'Admins can insert lead history') THEN
    CREATE POLICY "Admins can insert lead history" ON public.lead_status_history FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;

-- 6. DUPLICATE LEAD DETECTION
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS merged_into UUID;

-- 7. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  alt_text TEXT,
  folder TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_library' AND policyname = 'Admins can view media') THEN
    CREATE POLICY "Admins can view media" ON public.media_library FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_library' AND policyname = 'Admins can insert media') THEN
    CREATE POLICY "Admins can insert media" ON public.media_library FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_library' AND policyname = 'Admins can update media') THEN
    CREATE POLICY "Admins can update media" ON public.media_library FOR UPDATE USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_library' AND policyname = 'Admins can delete media') THEN
    CREATE POLICY "Admins can delete media" ON public.media_library FOR DELETE USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can view media files') THEN
    CREATE POLICY "Anyone can view media files" ON storage.objects FOR SELECT USING (bucket_id = 'media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Auth users can upload media') THEN
    CREATE POLICY "Auth users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Auth users can delete media') THEN
    CREATE POLICY "Auth users can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- 8. ADVANCED SEO FIELDS
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS twitter_title TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS twitter_description TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS twitter_image TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS faq_schema JSONB DEFAULT '[]';
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS breadcrumb_schema JSONB;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS noindex BOOLEAN DEFAULT false;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS sitemap_priority NUMERIC(2,1) DEFAULT 0.5;

-- 10. PUBLISH CONTROL
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS publish_status TEXT DEFAULT 'published';
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS featured_priority INT DEFAULT 0;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS homepage_visible BOOLEAN DEFAULT false;

-- 11. LOGIN ATTEMPTS
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'login_attempts' AND policyname = 'Super admins can view login attempts') THEN
    CREATE POLICY "Super admins can view login attempts" ON public.login_attempts FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'login_attempts' AND policyname = 'Anyone can log attempts') THEN
    CREATE POLICY "Anyone can log attempts" ON public.login_attempts FOR INSERT WITH CHECK (true);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON public.login_attempts(email, created_at DESC);

-- 12. SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_colleges_name_trgm ON public.colleges USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_colleges_deleted ON public.colleges(deleted_at);
CREATE INDEX IF NOT EXISTS idx_leads_deleted ON public.leads(deleted_at);

-- 13. PERFORMANCE METRICS
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS page_views BIGINT DEFAULT 0;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS leads_generated INT DEFAULT 0;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS college_conversion_rate NUMERIC(5,2) DEFAULT 0;

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  module TEXT,
  record_id TEXT,
  is_read BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_notifications' AND policyname = 'Users can view own notifications') THEN
    CREATE POLICY "Users can view own notifications" ON public.admin_notifications FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_notifications' AND policyname = 'Users can update own notifications') THEN
    CREATE POLICY "Users can update own notifications" ON public.admin_notifications FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_notifications' AND policyname = 'Admins can insert notifications') THEN
    CREATE POLICY "Admins can insert notifications" ON public.admin_notifications FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.admin_notifications(user_id, is_read, created_at DESC);
