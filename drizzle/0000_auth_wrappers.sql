-- Functions to bridge to Supabase Auth safely
CREATE OR REPLACE FUNCTION public.get_my_id() 
RETURNS uuid AS $$
  SELECT auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS boolean AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin';
$$ LANGUAGE sql STABLE SECURITY DEFINER;