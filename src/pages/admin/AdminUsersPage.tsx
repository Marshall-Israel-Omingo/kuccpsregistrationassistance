import { useState } from 'react';
import { Search, UserCog, Shield, ShieldCheck, ShieldX, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAllProfiles, useAllUserRoles, useUpdateUserRole, useDeleteUserRole } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const roleConfig: Record<AppRole, { label: string; color: string; icon: typeof Shield }> = {
  admin: { label: 'Admin', color: 'bg-destructive text-destructive-foreground', icon: ShieldCheck },
  moderator: { label: 'Moderator', color: 'bg-amber-500 text-white', icon: Shield },
  support: { label: 'Support', color: 'bg-secondary text-secondary-foreground', icon: UserCog },
  user: { label: 'User', color: 'bg-muted text-muted-foreground', icon: User },
};

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; name: string; currentRole?: AppRole } | null>(null);
  const [newRole, setNewRole] = useState<AppRole | ''>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: profiles, isLoading: profilesLoading } = useAllProfiles();
  const { data: userRoles, isLoading: rolesLoading } = useAllUserRoles();
  const updateRole = useUpdateUserRole();
  const deleteRole = useDeleteUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
    },
  });

  // Combine profiles with their roles
  const usersWithRoles = profiles?.map(profile => {
    const userRole = userRoles?.find(r => r.user_id === profile.user_id);
    return {
      ...profile,
      role: userRole?.role as AppRole | undefined,
      roleId: userRole?.id,
    };
  }) || [];

  const filteredUsers = usersWithRoles.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenRoleDialog = (user: typeof usersWithRoles[0]) => {
    setSelectedUser({
      id: user.user_id,
      email: user.email,
      name: user.full_name,
      currentRole: user.role,
    });
    setNewRole(user.role || '');
    setDialogOpen(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      const currentRole = selectedUser.currentRole;
      const existingRoleRecord = userRoles?.find(r => r.user_id === selectedUser.id);

      if (newRole === '') {
        // Remove role
        if (existingRoleRecord) {
          await deleteRole.mutateAsync(existingRoleRecord.id);
          toast({
            title: 'Role removed',
            description: `${selectedUser.name}'s role has been removed.`,
          });
        }
      } else if (existingRoleRecord) {
        // Update existing role
        await updateRole.mutateAsync({ id: existingRoleRecord.id, role: newRole as AppRole });
        toast({
          title: 'Role updated',
          description: `${selectedUser.name} is now a ${roleConfig[newRole as AppRole].label}.`,
        });
      } else {
        // Add new role
        await addRoleMutation.mutateAsync({ userId: selectedUser.id, role: newRole as AppRole });
        toast({
          title: 'Role assigned',
          description: `${selectedUser.name} is now a ${roleConfig[newRole as AppRole].label}.`,
        });
      }

      setDialogOpen(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role.',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadge = (role?: AppRole) => {
    if (!role) {
      return <Badge variant="outline" className="text-muted-foreground">No Role</Badge>;
    }
    const config = roleConfig[role];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const isLoading = profilesLoading || rolesLoading;

  const stats = {
    total: usersWithRoles.length,
    admins: usersWithRoles.filter(u => u.role === 'admin').length,
    moderators: usersWithRoles.filter(u => u.role === 'moderator').length,
    support: usersWithRoles.filter(u => u.role === 'support').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Role Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <ShieldCheck className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.admins}</p>
                  <p className="text-sm text-muted-foreground">Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Shield className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.moderators}</p>
                  <p className="text-sm text-muted-foreground">Moderators</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <UserCog className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.support}</p>
                  <p className="text-sm text-muted-foreground">Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-secondary" />
                All Users
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRoleDialog(user)}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Manage Role
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Management Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage User Role</DialogTitle>
              <DialogDescription>
                Change the role for {selectedUser?.name} ({selectedUser?.email})
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Role</label>
                <Select value={newRole} onValueChange={(value) => setNewRole(value as AppRole | '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        User (Standard)
                      </div>
                    </SelectItem>
                    <SelectItem value="support">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4" />
                        Support Agent
                      </div>
                    </SelectItem>
                    <SelectItem value="moderator">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Moderator
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm font-medium">Role Permissions:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {newRole === 'admin' && (
                    <>
                      <li>• Full access to all admin features</li>
                      <li>• Can manage user roles</li>
                      <li>• Can modify system settings</li>
                    </>
                  )}
                  {newRole === 'moderator' && (
                    <>
                      <li>• Access to admin panel</li>
                      <li>• Can manage applications</li>
                      <li>• Cannot modify system settings</li>
                    </>
                  )}
                  {newRole === 'support' && (
                    <>
                      <li>• Can view and respond to tickets</li>
                      <li>• Limited admin access</li>
                    </>
                  )}
                  {newRole === 'user' && (
                    <>
                      <li>• Standard user access</li>
                      <li>• No admin privileges</li>
                    </>
                  )}
                  {!newRole && (
                    <li>• No special permissions</li>
                  )}
                </ul>
              </div>

              {newRole === 'admin' && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ Warning: Granting admin access gives full control over the system.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleRoleChange}
                disabled={updateRole.isPending || addRoleMutation.isPending || deleteRole.isPending}
              >
                {(updateRole.isPending || addRoleMutation.isPending) ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;