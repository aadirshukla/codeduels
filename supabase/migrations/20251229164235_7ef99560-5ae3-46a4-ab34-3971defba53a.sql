-- Fix: Add comprehensive username validation in handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  clean_username TEXT;
BEGIN
  clean_username := TRIM(new.raw_user_meta_data ->> 'username');
  
  -- Reject email addresses as usernames
  IF clean_username ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Email addresses cannot be used as usernames';
  END IF;
  
  -- Validate length (3-30 characters)
  IF LENGTH(clean_username) < 3 OR LENGTH(clean_username) > 30 THEN
    RAISE EXCEPTION 'Username must be between 3 and 30 characters';
  END IF;
  
  -- Validate characters (alphanumeric, underscore, hyphen only)
  IF clean_username !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Username can only contain letters, numbers, underscore, and hyphen';
  END IF;
  
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, clean_username);
  
  RETURN new;
END;
$$;