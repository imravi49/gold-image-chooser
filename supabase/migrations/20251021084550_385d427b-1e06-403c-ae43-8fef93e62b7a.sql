-- ============================================================================
-- SECURITY FIX: Secure admin_settings and add missing RLS policies
-- ============================================================================

-- 1. Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage policies for logos bucket
CREATE POLICY "Admins can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

-- 3. CRITICAL: Fix admin_settings RLS - Remove public read access
DROP POLICY IF EXISTS "Everyone can view settings" ON admin_settings;

CREATE POLICY "Only admins can view settings"
ON admin_settings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can manage settings"
ON admin_settings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Fix users table - Add admin policies
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert users"
ON users FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete users"
ON users FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Fix activity_logs - Add insert and admin policies
CREATE POLICY "Users can insert own activity logs"
ON activity_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all logs"
ON activity_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete logs"
ON activity_logs FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Fix feedback - Add admin policy
CREATE POLICY "Admins can view all feedback"
ON feedback FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete feedback"
ON feedback FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Fix site_settings - Add admin write policies
CREATE POLICY "Admins can manage site settings"
ON site_settings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));