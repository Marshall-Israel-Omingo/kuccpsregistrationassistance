-- Add admin SELECT policies for applications
CREATE POLICY "Admins can view all applications" 
ON public.applications 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add admin UPDATE policy for applications
CREATE POLICY "Admins can update all applications" 
ON public.applications 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Add admin SELECT policies for profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add admin SELECT policies for payments
CREATE POLICY "Admins can view all payments" 
ON public.payments 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add admin UPDATE policy for payments
CREATE POLICY "Admins can update all payments" 
ON public.payments 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Add admin SELECT policies for support_tickets
CREATE POLICY "Admins can view all support tickets" 
ON public.support_tickets 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add admin UPDATE policy for support_tickets
CREATE POLICY "Admins can update all support tickets" 
ON public.support_tickets 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Add admin SELECT policy for ticket_messages
CREATE POLICY "Admins can view all ticket messages" 
ON public.ticket_messages 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add admin INSERT policy for ticket_messages (to reply)
CREATE POLICY "Admins can insert ticket messages" 
ON public.ticket_messages 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Add admin SELECT policy for course_selections
CREATE POLICY "Admins can view all course selections" 
ON public.course_selections 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add admin SELECT policy for documents
CREATE POLICY "Admins can view all documents" 
ON public.documents 
FOR SELECT 
USING (is_admin(auth.uid()));