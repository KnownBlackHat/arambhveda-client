
-- Add 'admin' and 'user' to existing app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'user';

-- Create new enums
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'interested', 'follow_up', 'converted', 'not_interested');
CREATE TYPE public.call_outcome AS ENUM ('answered', 'no_answer', 'busy', 'voicemail', 'wrong_number', 'callback_requested');
CREATE TYPE public.prospect_call_outcome AS ENUM ('connected', 'not_connected', 'busy', 'no_answer', 'wrong_number', 'callback', 'interested');

-- Add columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add unique constraint on user_roles if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key') THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;
