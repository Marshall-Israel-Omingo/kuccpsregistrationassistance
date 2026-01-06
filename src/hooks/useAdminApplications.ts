import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// For CourseMatch, we track platform access and shortlists instead of applications
export interface UserWithAccess {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  mean_grade: string | null;
  aggregate_points: number | null;
  created_at: string;
  platform_access: {
    status: 'free' | 'pending' | 'paid' | 'expired';
    unlocked_at: string | null;
  } | null;
}

export const useAllUsersWithAccess = () => {
  return useQuery({
    queryKey: ['all-users-access'],
    queryFn: async () => {
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get platform access
      const { data: accessData, error: accessError } = await supabase
        .from('platform_access')
        .select('*');

      if (accessError) throw accessError;

      // Join the data
      const usersWithAccess = profiles.map(profile => ({
        ...profile,
        platform_access: accessData.find(a => a.user_id === profile.user_id) || null,
      }));

      return usersWithAccess as UserWithAccess[];
    },
  });
};

export const useUserShortlistCourses = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['admin-user-shortlist', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // First get the user's shortlists
      const { data: shortlists, error: shortlistError } = await supabase
        .from('shortlists')
        .select('id')
        .eq('user_id', userId);

      if (shortlistError) throw shortlistError;
      if (!shortlists || shortlists.length === 0) return [];

      // Get all courses from all shortlists
      const shortlistIds = shortlists.map(s => s.id);
      const { data: courses, error: coursesError } = await supabase
        .from('shortlist_courses')
        .select('*')
        .in('shortlist_id', shortlistIds)
        .order('priority', { ascending: true });

      if (coursesError) throw coursesError;
      return courses;
    },
    enabled: !!userId,
  });
};

export const useUserPayments = (userId: string | undefined) => {
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

export const useUpdateUserAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: string;
      status: 'free' | 'pending' | 'paid' | 'expired';
    }) => {
      const updateData: Record<string, unknown> = { status };
      
      if (status === 'paid') {
        updateData.unlocked_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('platform_access')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-access'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
};
