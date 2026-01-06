-- =====================================================
-- CourseMatch Database Schema - Fresh Start
-- =====================================================

-- Drop existing tables (fresh start)
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS course_selections CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS subject_grades CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notification_templates CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.application_status CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.access_status CASCADE;

-- =====================================================
-- CORE USER TABLES
-- =====================================================

-- User profiles with KCSE data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  county TEXT,
  secondary_school TEXT,
  year_of_completion INTEGER,
  mean_grade TEXT,
  aggregate_points INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (is_admin(auth.uid()));

-- Subject grades for KCSE results
CREATE TABLE public.subject_grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject)
);

ALTER TABLE public.subject_grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own grades" ON public.subject_grades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own grades" ON public.subject_grades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own grades" ON public.subject_grades FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own grades" ON public.subject_grades FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- CAREER INTERESTS & ASSESSMENT
-- =====================================================

-- Career interest categories
CREATE TABLE public.career_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  interest_category TEXT NOT NULL,
  interest_level INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, interest_category)
);

ALTER TABLE public.career_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interests" ON public.career_interests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own interests" ON public.career_interests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interests" ON public.career_interests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own interests" ON public.career_interests FOR DELETE USING (auth.uid() = user_id);

-- Career assessment responses
CREATE TABLE public.career_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE public.career_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessments" ON public.career_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own assessments" ON public.career_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessments" ON public.career_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assessments" ON public.career_assessments FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- PLATFORM ACCESS & PAYMENTS
-- =====================================================

-- Platform access status
CREATE TYPE public.access_status AS ENUM ('free', 'pending', 'paid', 'expired');

CREATE TABLE public.platform_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  status access_status NOT NULL DEFAULT 'free',
  unlocked_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access" ON public.platform_access FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own access" ON public.platform_access FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all access" ON public.platform_access FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update all access" ON public.platform_access FOR UPDATE USING (is_admin(auth.uid()));

-- Payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 50.00,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'mpesa',
  phone_number TEXT,
  transaction_ref TEXT,
  mpesa_receipt TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update all payments" ON public.payments FOR UPDATE USING (is_admin(auth.uid()));

-- =====================================================
-- COURSE SHORTLISTING & COMPARISON
-- =====================================================

-- User shortlists (can have multiple lists)
CREATE TABLE public.shortlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Choices',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shortlists" ON public.shortlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own shortlists" ON public.shortlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shortlists" ON public.shortlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shortlists" ON public.shortlists FOR DELETE USING (auth.uid() = user_id);

-- Shortlisted courses
CREATE TABLE public.shortlist_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shortlist_id UUID NOT NULL REFERENCES public.shortlists(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_code TEXT,
  institution_id TEXT,
  institution_name TEXT,
  priority INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  fit_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shortlist_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shortlist courses" ON public.shortlist_courses FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.shortlists WHERE id = shortlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert their own shortlist courses" ON public.shortlist_courses FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.shortlists WHERE id = shortlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can update their own shortlist courses" ON public.shortlist_courses FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.shortlists WHERE id = shortlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete their own shortlist courses" ON public.shortlist_courses FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.shortlists WHERE id = shortlist_id AND user_id = auth.uid()));

-- Course comparison sessions
CREATE TABLE public.course_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_ids TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own comparisons" ON public.course_comparisons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own comparisons" ON public.course_comparisons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comparisons" ON public.course_comparisons FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- NOTIFICATIONS & ADMIN
-- =====================================================

CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- User roles for admin
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'support', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (is_admin(auth.uid()));

-- Analytics/activity logs
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs" ON public.activity_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "System can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated at trigger function (recreate to be safe)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_access_updated_at BEFORE UPDATE ON public.platform_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shortlists_updated_at BEFORE UPDATE ON public.shortlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Handle new user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (user_id, email, full_name, phone)
  VALUES (
    new.id,
    new.email,
    COALESCE(NULLIF(new.raw_user_meta_data ->> 'full_name', ''), 'New User'),
    NULLIF(new.raw_user_meta_data ->> 'phone', '')
  );

  -- Create platform access record (free tier)
  INSERT INTO public.platform_access (user_id, status)
  VALUES (new.id, 'free');

  -- Create default shortlist
  INSERT INTO public.shortlists (user_id, name, is_primary)
  VALUES (new.id, 'My Course Choices', true);

  -- Create welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    new.id,
    'Welcome to CourseMatch! 🎓',
    'Start by entering your KCSE grades to unlock personalized course recommendations.',
    'info'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();