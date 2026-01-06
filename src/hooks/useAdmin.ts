import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'support' | 'user';
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export const useIsAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['admin', 'moderator']);
      
      if (error) return false;
      return data && data.length > 0;
    },
    enabled: !!user?.id,
  });
};

export const useUserRoles = () => {
  return useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserRole[];
    },
  });
};

export const useAllUserRoles = () => {
  return useQuery({
    queryKey: ['all-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserRole[];
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'admin' | 'moderator' | 'support' | 'user' }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    },
  });
};

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    },
  });
};

export const useActivityLogs = (filters?: { eventType?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['activityLogs', filters],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters?.eventType) {
        query = query.eq('event_type', filters.eventType);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      } else {
        query = query.limit(100);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ActivityLog[];
    },
  });
};

export const useAllProfiles = () => {
  return useQuery({
    queryKey: ['allProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAllPayments = () => {
  return useQuery({
    queryKey: ['allPayments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAllPlatformAccess = () => {
  return useQuery({
    queryKey: ['allPlatformAccess'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_access')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const [profiles, payments, platformAccess, shortlists] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('payments').select('status, amount', { count: 'exact' }),
        supabase.from('platform_access').select('status', { count: 'exact' }),
        supabase.from('shortlists').select('id', { count: 'exact' }),
      ]);
      
      const paidUsers = (platformAccess.data || []).filter(pa => pa.status === 'paid').length;
      const totalRevenue = (payments.data || [])
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);
      
      return {
        totalStudents: profiles.count || 0,
        totalPayments: payments.count || 0,
        paidUsers,
        totalRevenue,
        totalShortlists: shortlists.count || 0,
        payments: payments.data || [],
        platformAccess: platformAccess.data || [],
      };
    },
  });
};

export const useUpdatePlatformAccess = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'free' | 'pending' | 'paid' | 'expired' }) => {
      const { data, error } = await supabase
        .from('platform_access')
        .update({ 
          status,
          unlocked_at: status === 'paid' ? new Date().toISOString() : null,
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPlatformAccess'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
};
