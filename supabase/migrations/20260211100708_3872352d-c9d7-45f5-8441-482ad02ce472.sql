
-- Invitations table
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  role app_role NOT NULL DEFAULT 'user',
  status invitation_status NOT NULL DEFAULT 'pending',
  invited_by uuid REFERENCES auth.users(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invitations" ON public.invitations
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ERP Leads table
CREATE TABLE public.erp_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to uuid REFERENCES auth.users(id),
  name text NOT NULL,
  phone text,
  email text,
  company text,
  status lead_status NOT NULL DEFAULT 'new',
  follow_up_date timestamptz,
  notes text,
  source text,
  created_by uuid REFERENCES auth.users(id),
  last_call_at timestamptz,
  last_note_at timestamptz,
  last_activity_at timestamptz DEFAULT now(),
  next_follow_up_at timestamptz,
  call_count integer DEFAULT 0,
  is_complete boolean DEFAULT false,
  inactivity_days integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.erp_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own leads" ON public.erp_leads
FOR SELECT TO authenticated
USING (assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can insert leads" ON public.erp_leads
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own leads" ON public.erp_leads
FOR UPDATE TO authenticated
USING (assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can delete leads" ON public.erp_leads
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER update_erp_leads_updated_at
BEFORE UPDATE ON public.erp_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Call logs table
CREATE TABLE public.erp_call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.erp_leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  duration_minutes integer DEFAULT 0,
  duration_seconds integer DEFAULT 0,
  outcome call_outcome NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.erp_call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own call logs" ON public.erp_call_logs
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can insert call logs" ON public.erp_call_logs
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Lead timeline table (immutable)
CREATE TABLE public.lead_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.erp_leads(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  action_type text NOT NULL,
  old_value text,
  new_value text,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see timeline for accessible leads" ON public.lead_timeline
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.erp_leads
    WHERE erp_leads.id = lead_timeline.lead_id
    AND (erp_leads.assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  )
);

CREATE POLICY "Users can insert timeline entries" ON public.lead_timeline
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Prospects table
CREATE TABLE public.prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  company text,
  source text,
  notes text,
  assigned_to uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id),
  call_count integer DEFAULT 0,
  last_called_at timestamptz,
  ai_score numeric DEFAULT 0,
  ai_recommendation text,
  is_promoted boolean DEFAULT false,
  promoted_at timestamptz,
  promoted_to_lead_id uuid REFERENCES public.erp_leads(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own prospects" ON public.prospects
FOR SELECT TO authenticated
USING (assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can insert prospects" ON public.prospects
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own prospects" ON public.prospects
FOR UPDATE TO authenticated
USING (assigned_to = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can delete prospects" ON public.prospects
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER update_prospects_updated_at
BEFORE UPDATE ON public.prospects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Prospect calls table
CREATE TABLE public.prospect_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid REFERENCES public.prospects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  call_time timestamptz DEFAULT now(),
  duration_seconds integer DEFAULT 0,
  outcome prospect_call_outcome NOT NULL,
  notes text,
  ai_analysis text,
  ai_promote_recommendation boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.prospect_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own prospect calls" ON public.prospect_calls
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can insert prospect calls" ON public.prospect_calls
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Attendance table
CREATE TABLE public.erp_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  check_in timestamptz NOT NULL DEFAULT now(),
  check_out timestamptz,
  status text NOT NULL DEFAULT 'present',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.erp_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own attendance" ON public.erp_attendance
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can insert own attendance" ON public.erp_attendance
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own attendance" ON public.erp_attendance
FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- Update handle_new_user to also create default 'user' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create/recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
