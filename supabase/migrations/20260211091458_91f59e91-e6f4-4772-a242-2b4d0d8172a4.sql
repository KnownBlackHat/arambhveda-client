
-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'content_manager', 'seo_manager', 'lead_manager', 'editor');

-- Create user_roles table FIRST
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer functions BEFORE any policies
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

-- user_roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  course_interest TEXT,
  city TEXT,
  source_page TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'lead_manager'));
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Add SEO and admin fields to colleges
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS admission_process TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS cutoff_details JSONB DEFAULT '[]';
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS prospectus_url TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS accreditation TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS affiliation TEXT;

-- Admin college management policies
CREATE POLICY "Admins can insert colleges" ON public.colleges FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update colleges" ON public.colleges FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete colleges" ON public.colleges FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
