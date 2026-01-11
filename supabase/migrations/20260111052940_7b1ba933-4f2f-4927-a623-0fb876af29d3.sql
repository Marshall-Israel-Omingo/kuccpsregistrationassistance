-- Drop the overly permissive INSERT policy on activity_logs
DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;

-- Create a SECURITY DEFINER function for controlled activity logging
CREATE OR REPLACE FUNCTION public.log_activity(
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow logging for authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for logging';
  END IF;
  
  -- Insert the activity log entry
  INSERT INTO activity_logs (user_id, event_type, event_data)
  VALUES (auth.uid(), p_event_type, p_event_data);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.log_activity(TEXT, JSONB) TO authenticated;