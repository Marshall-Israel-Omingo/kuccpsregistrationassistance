import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseById, Course } from '@/data/courses';

export interface ShortlistCourse {
  id: string;
  shortlist_id: string;
  course_id: string;
  course_name: string;
  course_code: string | null;
  institution_id: string | null;
  institution_name: string | null;
  priority: number;
  fit_score: number | null;
  notes: string | null;
  created_at: string;
}

export interface Shortlist {
  id: string;
  user_id: string;
  name: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const useShortlist = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['shortlist', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get primary shortlist
      const { data: shortlist, error: shortlistError } = await supabase
        .from('shortlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .maybeSingle();

      if (shortlistError) throw shortlistError;
      return shortlist as Shortlist | null;
    },
    enabled: !!user,
  });
};

export const useShortlistCourses = () => {
  const { user } = useAuth();
  const { data: shortlist } = useShortlist();

  return useQuery({
    queryKey: ['shortlist_courses', shortlist?.id],
    queryFn: async () => {
      if (!shortlist) return [];
      
      const { data, error } = await supabase
        .from('shortlist_courses')
        .select('*')
        .eq('shortlist_id', shortlist.id)
        .order('priority');

      if (error) throw error;
      return data as ShortlistCourse[];
    },
    enabled: !!shortlist,
  });
};

export const useAddToShortlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: shortlist } = useShortlist();

  return useMutation({
    mutationFn: async ({ courseId, institutionId, institutionName }: { 
      courseId: string; 
      institutionId?: string;
      institutionName?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      if (!shortlist) throw new Error('No shortlist found');

      const course = getCourseById(courseId);
      if (!course) throw new Error('Course not found');

      // Check if already in shortlist
      const { data: existing } = await supabase
        .from('shortlist_courses')
        .select('id')
        .eq('shortlist_id', shortlist.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existing) {
        throw new Error('Course already in your choices');
      }

      // Get current count
      const { count } = await supabase
        .from('shortlist_courses')
        .select('*', { count: 'exact', head: true })
        .eq('shortlist_id', shortlist.id);

      if (count && count >= 4) {
        throw new Error('You can only have 4 course choices');
      }

      const { data, error } = await supabase
        .from('shortlist_courses')
        .insert({
          shortlist_id: shortlist.id,
          course_id: courseId,
          course_name: course.name,
          course_code: course.code,
          institution_id: institutionId || null,
          institution_name: institutionName || null,
          priority: (count || 0) + 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist_courses'] });
    },
  });
};

export const useRemoveFromShortlist = () => {
  const queryClient = useQueryClient();
  const { data: shortlist } = useShortlist();

  return useMutation({
    mutationFn: async (shortlistCourseId: string) => {
      if (!shortlist) throw new Error('No shortlist found');

      const { error } = await supabase
        .from('shortlist_courses')
        .delete()
        .eq('id', shortlistCourseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist_courses'] });
    },
  });
};

export const useUpdatePriority = () => {
  const queryClient = useQueryClient();
  const { data: shortlist } = useShortlist();

  return useMutation({
    mutationFn: async (courses: { id: string; priority: number }[]) => {
      if (!shortlist) throw new Error('No shortlist found');

      const updates = courses.map(c => 
        supabase
          .from('shortlist_courses')
          .update({ priority: c.priority })
          .eq('id', c.id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist_courses'] });
    },
  });
};

// Hook to check if a course is in shortlist
export const useIsCourseInShortlist = (courseId: string) => {
  const { data: courses } = useShortlistCourses();
  return courses?.some(c => c.course_id === courseId) ?? false;
};
