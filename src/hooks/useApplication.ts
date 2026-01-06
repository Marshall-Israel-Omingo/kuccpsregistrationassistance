import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type ApplicationStatus = 'draft' | 'payment_pending' | 'submitted' | 'in_progress' | 'completed' | 'rejected';

export interface Application {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  personal_details_confirmed: boolean;
  documents_uploaded: boolean;
  kuccps_reference: string | null;
  submitted_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseSelection {
  id: string;
  application_id: string;
  course_id: string;
  course_name: string;
  course_code: string | null;
  institution_name: string | null;
  cluster_points: number | null;
  priority: number;
  created_at: string;
}

export const useApplication = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['application', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Application | null;
    },
    enabled: !!user,
  });
};

export const useCourseSelections = (applicationId: string | undefined) => {
  return useQuery({
    queryKey: ['course_selections', applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      
      const { data, error } = await supabase
        .from('course_selections')
        .select('*')
        .eq('application_id', applicationId)
        .order('priority', { ascending: true });

      if (error) throw error;
      return data as CourseSelection[];
    },
    enabled: !!applicationId,
  });
};

export const useAddCourseSelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (selection: Omit<CourseSelection, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('course_selections')
        .insert(selection)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course_selections', variables.application_id] });
    },
  });
};

export const useRemoveCourseSelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, applicationId }: { id: string; applicationId: string }) => {
      const { error } = await supabase
        .from('course_selections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { applicationId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['course_selections', result.applicationId] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Application>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', user?.id] });
    },
  });
};
