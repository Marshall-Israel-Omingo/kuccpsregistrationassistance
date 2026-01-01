-- Create app_role enum for role types
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'support', 'user');

-- Create user_roles table for admin access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
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

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'moderator')
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.is_admin(auth.uid()));

-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE (category, key)
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
ON public.system_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update settings"
ON public.system_settings FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert settings"
ON public.system_settings FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- Create notification_templates table
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  trigger_event TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage templates"
ON public.notification_templates FOR ALL
USING (public.is_admin(auth.uid()));

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at
BEFORE UPDATE ON public.notification_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (category, key, value) VALUES
('security', 'password_policy', '{"min_length": 8, "require_uppercase": true, "require_number": true, "require_special": true}'),
('security', 'session', '{"timeout_minutes": 60, "remember_days": 30, "single_session": false}'),
('security', 'login', '{"max_attempts": 5, "lockout_minutes": 15, "captcha_threshold": 3}'),
('notifications', 'student', '{"email_payment": true, "email_status": true, "email_documents": true, "sms_payment": true}'),
('notifications', 'admin', '{"new_application": true, "payment_verified": true, "new_ticket": true, "high_priority": true}'),
('system', 'maintenance', '{"enabled": false, "message": "System is under maintenance. Please try again later.", "allow_admin": true}');

-- Insert default notification templates
INSERT INTO public.notification_templates (name, type, subject, content, trigger_event, variables) VALUES
('Welcome Email', 'email', 'Welcome to KUCCPS Portal!', 'Dear {{full_name}}, Welcome to the KUCCPS Portal. Your account has been created successfully.', 'user_signup', '["full_name", "email"]'),
('Payment Confirmation', 'email', 'Payment Received', 'Dear {{full_name}}, Your payment of KES {{amount}} has been received. Reference: {{reference}}', 'payment_success', '["full_name", "amount", "reference"]'),
('Application Submitted', 'email', 'Application Submitted Successfully', 'Dear {{full_name}}, Your application has been submitted. Reference: {{app_reference}}', 'application_submit', '["full_name", "app_reference"]'),
('Payment SMS', 'sms', NULL, 'KUCCPS: Payment of KES {{amount}} received. Ref: {{reference}}', 'payment_success', '["amount", "reference"]');