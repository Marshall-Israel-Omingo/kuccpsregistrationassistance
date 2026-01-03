import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

export interface ApplicationWithProfile {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  personal_details_confirmed: boolean | null;
  documents_uploaded: boolean | null;
  kuccps_reference: string | null;
  submitted_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
    county: string | null;
    id_number: string | null;
    index_number: string | null;
    mean_grade: string | null;
    cluster_points: number | null;
  } | null;
}

export const useApplicationDetails = (applicationId: string | undefined) => {
  return useQuery({
    queryKey: ['admin-application', applicationId],
    queryFn: async () => {
      if (!applicationId) return null;
      
      // First get the application
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .maybeSingle();

      if (appError) throw appError;
      if (!application) return null;

      // Then get the profile for this user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone, date_of_birth, county, id_number, index_number, mean_grade, cluster_points')
        .eq('user_id', application.user_id)
        .maybeSingle();

      if (profileError) throw profileError;

      return {
        ...application,
        profiles: profile,
      } as ApplicationWithProfile;
    },
    enabled: !!applicationId,
  });
};

export const useApplicationCourseSelections = (applicationId: string | undefined) => {
  return useQuery({
    queryKey: ['admin-course-selections', applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      
      const { data, error } = await supabase
        .from('course_selections')
        .select('*')
        .eq('application_id', applicationId)
        .order('priority', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!applicationId,
  });
};

export const useApplicationDocuments = (applicationId: string | undefined) => {
  return useQuery({
    queryKey: ['admin-documents', applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!applicationId,
  });
};

export const useApplicationPayments = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['admin-user-payments', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      updates,
    }: {
      applicationId: string;
      updates: Partial<{
        status: ApplicationStatus;
        kuccps_reference: string;
        completed_at: string;
        submitted_at: string;
      }>;
    }) => {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-application', variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['allApplications'] });
    },
  });
};
