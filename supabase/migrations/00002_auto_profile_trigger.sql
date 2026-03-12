-- Auto-create a default profile when a new auth user is created.
-- This runs with SECURITY DEFINER so it bypasses RLS.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role)
  VALUES (
    NEW.id,
    LOWER(REPLACE(SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1), '.', '')) || '_' || SUBSTR(MD5(NEW.id::text), 1, 6),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1)),
    'fan'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
