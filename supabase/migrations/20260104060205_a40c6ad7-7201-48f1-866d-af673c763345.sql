-- Add foreign key relationship between applications.user_id and profiles.user_id
-- First, we need to ensure profiles.user_id is unique (it should be)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Add foreign key from applications to profiles
ALTER TABLE public.applications 
ADD CONSTRAINT applications_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Also add foreign key from payments to profiles for admin payments page
ALTER TABLE public.payments
ADD CONSTRAINT payments_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;