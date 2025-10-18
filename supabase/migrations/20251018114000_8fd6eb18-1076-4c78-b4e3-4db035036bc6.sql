-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for photo selection clients
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  contact TEXT,
  selection_limit INTEGER DEFAULT 150,
  folder_path TEXT,
  is_finalized BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  folder_path TEXT NOT NULL,
  thumbnail_url TEXT,
  full_url TEXT,
  file_size BIGINT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(file_name, folder_path)
);

-- Create selections table to track user selections
CREATE TABLE public.selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('selected', 'later', 'skipped')),
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, photo_id)
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  selection_experience INTEGER CHECK (selection_experience BETWEEN 1 AND 5),
  photo_quality INTEGER CHECK (photo_quality BETWEEN 1 AND 5),
  comments TEXT,
  is_publishable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- RLS Policies for photos (all authenticated users can view)
CREATE POLICY "Authenticated users can view photos"
  ON public.photos FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for selections
CREATE POLICY "Users can view their own selections"
  ON public.selections FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own selections"
  ON public.selections FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own selections"
  ON public.selections FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own selections"
  ON public.selections FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for feedback
CREATE POLICY "Users can view their own feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- RLS Policies for site_settings (read-only for authenticated users)
CREATE POLICY "Authenticated users can view site settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for activity_logs
CREATE POLICY "Users can view their own activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('hero', '{"title": "Your Beautiful Moments", "tagline": "Select your favorite photos", "slides": []}'),
  ('branding', '{"primaryColor": "#C2994A", "logoUrl": "", "fontHeading": "Playfair Display", "fontBody": "Inter"}'),
  ('guide_video', '{"url": "", "title": "How to Select Your Photos"}'),
  ('contacts', '{"whatsapp": {"number": "", "message": "Hi, I need help with photo selection", "enabled": true}, "team": []}'),
  ('selection_settings', '{"globalLimit": 150, "autoFolderCreation": false}');

-- Create indexes for better performance
CREATE INDEX idx_selections_user_id ON public.selections(user_id);
CREATE INDEX idx_selections_photo_id ON public.selections(photo_id);
CREATE INDEX idx_selections_status ON public.selections(status);
CREATE INDEX idx_photos_folder_path ON public.photos(folder_path);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);