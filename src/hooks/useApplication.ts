import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Platform access types for CourseMatch
export type AccessStatus = 'free' | 'pending' | 'paid' | 'expired';

export interface PlatformAccess {
  id: string;
  user_id: string;
  status: AccessStatus;
  unlocked_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Shortlist {
  id: string;
  user_id: string;
  name: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShortlistCourse {
  id: string;
  shortlist_id: string;
  course_id: string;
  course_name: string;
  course_code: string | null;
  institution_id: string | null;
  institution_name: string | null;
  priority: number;
  notes: string | null;
  fit_score: number | null;
  created_at: string;
}

export const usePlatformAccess = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['platform_access', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('platform_access')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as PlatformAccess | null;
    },
    enabled: !!user,
  });
};

export const useShortlists = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['shortlists', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('shortlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Shortlist[];
    },
    enabled: !!user,
  });
};

export const usePrimaryShortlist = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['primary_shortlist', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('shortlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .maybeSingle();

      if (error) throw error;
      return data as Shortlist | null;
    },
    enabled: !!user,
  });
};

export const useShortlistCourses = (shortlistId: string | undefined) => {
  return useQuery({
    queryKey: ['shortlist_courses', shortlistId],
    queryFn: async () => {
      if (!shortlistId) return [];
      
      const { data, error } = await supabase
        .from('shortlist_courses')
        .select('*')
        .eq('shortlist_id', shortlistId)
        .order('priority', { ascending: true });

      if (error) throw error;
      return data as ShortlistCourse[];
    },
    enabled: !!shortlistId,
  });
};

export const useAddToShortlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Omit<ShortlistCourse, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('shortlist_courses')
        .insert(course)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shortlist_courses', variables.shortlist_id] });
    },
  });
};

export const useRemoveFromShortlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, shortlistId }: { id: string; shortlistId: string }) => {
      const { error } = await supabase
        .from('shortlist_courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { shortlistId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['shortlist_courses', result.shortlistId] });
    },
  });
};

export const useUpdateShortlistCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, shortlistId, updates }: { 
      id: string; 
      shortlistId: string;
      updates: Partial<Pick<ShortlistCourse, 'priority' | 'notes'>> 
    }) => {
      const { data, error } = await supabase
        .from('shortlist_courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, shortlistId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['shortlist_courses', result.shortlistId] });
    },
  });
};

export const useCreateShortlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('shortlists')
        .insert({ user_id: user.id, name })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlists', user?.id] });
    },
  });
};
