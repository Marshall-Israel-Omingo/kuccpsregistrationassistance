-- Deny anonymous (unauthenticated) access to profiles table
-- This prevents scraping of sensitive student data without authentication
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Also add explicit deny for other tables with sensitive user data

-- Deny anonymous access to payments (contains phone numbers and transaction data)
CREATE POLICY "Deny anonymous access to payments"
ON public.payments
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to subject_grades (academic performance data)
CREATE POLICY "Deny anonymous access to subject grades"
ON public.subject_grades
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to platform_access (subscription data)
CREATE POLICY "Deny anonymous access to platform access"
ON public.platform_access
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to notifications
CREATE POLICY "Deny anonymous access to notifications"
ON public.notifications
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to shortlists
CREATE POLICY "Deny anonymous access to shortlists"
ON public.shortlists
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to shortlist_courses
CREATE POLICY "Deny anonymous access to shortlist courses"
ON public.shortlist_courses
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to career_assessments
CREATE POLICY "Deny anonymous access to career assessments"
ON public.career_assessments
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to career_interests
CREATE POLICY "Deny anonymous access to career interests"
ON public.career_interests
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to course_comparisons
CREATE POLICY "Deny anonymous access to course comparisons"
ON public.course_comparisons
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to user_roles (prevents role enumeration)
CREATE POLICY "Deny anonymous access to user roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to activity_logs
CREATE POLICY "Deny anonymous access to activity logs"
ON public.activity_logs
FOR SELECT
TO anon
USING (false);