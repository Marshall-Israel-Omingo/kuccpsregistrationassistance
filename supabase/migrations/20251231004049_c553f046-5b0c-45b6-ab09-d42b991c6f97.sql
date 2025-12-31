-- Create profiles table for student information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  id_number TEXT,
  date_of_birth DATE,
  county TEXT,
  index_number TEXT,
  mean_grade TEXT,
  cluster_points INTEGER,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create subject_grades table for KCSE results
CREATE TABLE public.subject_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create application status enum
CREATE TYPE public.application_status AS ENUM ('draft', 'payment_pending', 'submitted', 'in_progress', 'completed', 'rejected');

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status public.application_status DEFAULT 'draft' NOT NULL,
  personal_details_confirmed BOOLEAN DEFAULT false,
  documents_uploaded BOOLEAN DEFAULT false,
  kuccps_reference TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create course_selections table (up to 4 choices)
CREATE TABLE public.course_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_code TEXT,
  institution_name TEXT,
  cluster_points INTEGER,
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (application_id, priority),
  UNIQUE (application_id, course_id)
);

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
  status public.payment_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT DEFAULT 'mpesa',
  transaction_ref TEXT,
  mpesa_receipt TEXT,
  phone_number TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'open' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create ticket_messages table
CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('student', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for subject_grades
CREATE POLICY "Users can view their own grades" ON public.subject_grades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grades" ON public.subject_grades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grades" ON public.subject_grades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grades" ON public.subject_grades
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for applications
CREATE POLICY "Users can view their own application" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own application" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own application" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for course_selections
CREATE POLICY "Users can view their own course selections" ON public.course_selections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = course_selections.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own course selections" ON public.course_selections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = course_selections.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own course selections" ON public.course_selections
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = course_selections.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own course selections" ON public.course_selections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = course_selections.application_id 
      AND applications.user_id = auth.uid()
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for documents
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for support_tickets
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ticket_messages
CREATE POLICY "Users can view messages from their tickets" ON public.ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE support_tickets.id = ticket_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their tickets" ON public.ticket_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE support_tickets.id = ticket_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name, email, phone, index_number, mean_grade, cluster_points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'index_number',
    NEW.raw_user_meta_data ->> 'mean_grade',
    (NEW.raw_user_meta_data ->> 'cluster_points')::INTEGER
  );
  
  -- Create application
  INSERT INTO public.applications (user_id)
  VALUES (NEW.id);
  
  -- Create welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Welcome to KUCCPS Registration!',
    'Your account has been created successfully. Start by browsing courses and adding them to your choices.',
    'info'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
