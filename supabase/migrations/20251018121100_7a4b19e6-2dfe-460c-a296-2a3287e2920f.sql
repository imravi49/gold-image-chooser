-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Add review categories table for Later selections
CREATE TABLE public.review_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('selected', 'later')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, photo_id)
);

ALTER TABLE public.review_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their review categories"
  ON public.review_categories
  FOR ALL
  USING (auth.uid()::text = user_id::text);

-- Update selections table to support review workflow
ALTER TABLE public.selections 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'selected' CHECK (category IN ('selected', 'later'));

-- Add admin settings table
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage settings"
  ON public.admin_settings
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view settings"
  ON public.admin_settings
  FOR SELECT
  USING (true);