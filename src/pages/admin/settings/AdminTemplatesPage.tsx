import { useState } from 'react';
import { Plus, Mail, MessageSquare, Bell, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotificationTemplates, useUpdateNotificationTemplate } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

const AdminTemplatesPage = () => {
  const { data: templates, isLoading } = useNotificationTemplates();
  const updateTemplate = useUpdateNotificationTemplate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      email: 'bg-blue-100 text-blue-700',
      sms: 'bg-green-100 text-green-700',
      push: 'bg-purple-100 text-purple-700',
    };
    return <Badge className={styles[type] || 'bg-muted'}>{type}</Badge>;
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateTemplate.mutateAsync({ id, is_active: !isActive });
      toast({
        title: 'Template Updated',
        description: `Template ${!isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update template status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notification Templates</h1>
            <p className="text-muted-foreground">Manage email, SMS, and push notification templates</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="teal">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input placeholder="e.g., Welcome Email" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject (for emails)</Label>
                  <Input placeholder="Email subject line" />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea 
                    placeholder="Use {{variable}} for dynamic content"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available variables: {'{{full_name}}'}, {'{{email}}'}, {'{{amount}}'}, {'{{reference}}'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Trigger Event</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user_signup">User Signup</SelectItem>
                      <SelectItem value="payment_success">Payment Success</SelectItem>
                      <SelectItem value="application_submit">Application Submitted</SelectItem>
                      <SelectItem value="status_change">Status Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="teal">
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates List */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : templates?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Mail className="h-12 w-12 mb-4" />
                <p>No templates created yet</p>
              </CardContent>
            </Card>
          ) : (
            templates?.map((template: any) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mt-0.5">
                        {getTypeIcon(template.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                          {getTypeBadge(template.type)}
                          {template.trigger_event && (
                            <Badge variant="outline" className="text-xs">
                              {template.trigger_event.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                        {template.subject && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Subject: {template.subject}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {template.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                          checked={template.is_active}
                          onCheckedChange={() => handleToggleActive(template.id, template.is_active)}
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Test
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTemplatesPage;
