-- Drop and recreate the handle_new_user function to properly handle empty strings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile for new user with proper NULL handling for empty strings
  INSERT INTO public.profiles (user_id, email, full_name, phone, index_number, mean_grade, cluster_points)
  VALUES (
    new.id,
    new.email,
    COALESCE(NULLIF(new.raw_user_meta_data ->> 'full_name', ''), 'New User'),
    NULLIF(new.raw_user_meta_data ->> 'phone', ''),
    NULLIF(new.raw_user_meta_data ->> 'index_number', ''),
    NULLIF(new.raw_user_meta_data ->> 'mean_grade', ''),
    CASE 
      WHEN new.raw_user_meta_data ->> 'cluster_points' IS NULL THEN NULL
      WHEN new.raw_user_meta_data ->> 'cluster_points' = '' THEN NULL
      ELSE (new.raw_user_meta_data ->> 'cluster_points')::integer
    END
  );

  -- Create initial application
  INSERT INTO public.applications (user_id, status)
  VALUES (new.id, 'draft');

  -- Create welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    new.id,
    'Welcome to KUCCPS Portal!',
    'Your account has been created successfully. Start by completing your profile and selecting your preferred courses.',
    'info'
  );

  RETURN new;
END;
$$;