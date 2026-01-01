import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/components/admin/AdminLayout';
import { useSystemSettings, useUpdateSystemSetting } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

const AdminNotificationsPage = () => {
  const { data: settings } = useSystemSettings('notifications');
  const updateSetting = useUpdateSystemSetting();
  const { toast } = useToast();

  const studentSettings = settings?.find(s => s.key === 'student')?.value as Record<string, boolean> || {};
  const adminSettings = settings?.find(s => s.key === 'admin')?.value as Record<string, boolean> || {};

  const handleSave = async () => {
    toast({
      title: 'Settings Saved',
      description: 'Notification settings have been updated.',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
          <p className="text-muted-foreground">Configure notification preferences for students and admins</p>
        </div>

        {/* Student Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: 'email_payment', label: 'Payment confirmation' },
                  { key: 'email_status', label: 'Application status updates' },
                  { key: 'email_documents', label: 'Document requests' },
                  { key: 'email_completed', label: 'Application completed' },
                  { key: 'email_support', label: 'Support ticket replies' },
                  { key: 'email_marketing', label: 'Marketing updates' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch 
                      id={item.key} 
                      defaultChecked={studentSettings[item.key] !== false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* SMS Notifications */}
            <div>
              <h3 className="font-medium text-foreground mb-2">SMS Notifications</h3>
              <p className="text-sm text-muted-foreground mb-4">SMS credits required</p>
              <div className="space-y-4">
                {[
                  { key: 'sms_payment', label: 'Payment confirmation' },
                  { key: 'sms_completed', label: 'Application completed' },
                  { key: 'sms_status', label: 'Status updates' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch 
                      id={item.key}
                      defaultChecked={studentSettings[item.key] !== false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* In-App Notifications */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Dashboard Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: 'realtime', label: 'Real-time updates' },
                  { key: 'badge', label: 'Show notification badge' },
                  { key: 'push', label: 'Browser push notifications' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch 
                      id={item.key}
                      defaultChecked
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admin Team Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Application Alerts */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Application Alerts</h3>
              <div className="space-y-4">
                {[
                  { key: 'new_application', label: 'New application submitted' },
                  { key: 'payment_verified', label: 'Payment verified' },
                  { key: 'app_stalled', label: 'Application stalled (24+ hours)' },
                  { key: 'app_edited', label: 'Student edited application' },
                  { key: 'daily_summary', label: 'Daily application summary' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={`admin_${item.key}`}>{item.label}</Label>
                    <Switch 
                      id={`admin_${item.key}`}
                      defaultChecked={adminSettings[item.key] !== false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Support Alerts */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Support Alerts</h3>
              <div className="space-y-4">
                {[
                  { key: 'new_ticket', label: 'New support ticket' },
                  { key: 'high_priority', label: 'High priority ticket' },
                  { key: 'ticket_waiting', label: 'Ticket waiting (2+ hours)' },
                  { key: 'ticket_summary', label: 'Daily ticket summary' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={`support_${item.key}`}>{item.label}</Label>
                    <Switch 
                      id={`support_${item.key}`}
                      defaultChecked={adminSettings[item.key] !== false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Alert Thresholds */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Alert Thresholds</h3>
              <p className="text-sm text-muted-foreground mb-4">Alert me when:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pending apps exceed</Label>
                  <Input type="number" defaultValue={50} />
                </div>
                <div className="space-y-2">
                  <Label>Avg processing time exceeds (hours)</Label>
                  <Input type="number" defaultValue={48} />
                </div>
                <div className="space-y-2">
                  <Label>Payment failure rate exceeds (%)</Label>
                  <Input type="number" defaultValue={5} />
                </div>
                <div className="space-y-2">
                  <Label>Unresolved tickets exceed</Label>
                  <Input type="number" defaultValue={20} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="teal" onClick={handleSave}>
            Save Notification Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotificationsPage;
