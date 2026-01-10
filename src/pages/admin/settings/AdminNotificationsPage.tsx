import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';

const AdminNotificationsPage = () => {
  const { toast } = useToast();

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
                  { key: 'email_welcome', label: 'Welcome email' },
                  { key: 'email_marketing', label: 'Marketing updates' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch id={item.key} defaultChecked />
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
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch id={item.key} defaultChecked />
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
                    <Switch id={item.key} defaultChecked />
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
            {/* Payment Alerts */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Payment Alerts</h3>
              <div className="space-y-4">
                {[
                  { key: 'payment_verified', label: 'Payment verified' },
                  { key: 'daily_summary', label: 'Daily summary' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label htmlFor={`admin_${item.key}`}>{item.label}</Label>
                    <Switch id={`admin_${item.key}`} defaultChecked />
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
                  <Label>Payment failure rate exceeds (%)</Label>
                  <Input type="number" defaultValue={5} />
                </div>
                <div className="space-y-2">
                  <Label>New signups exceed (daily)</Label>
                  <Input type="number" defaultValue={100} />
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
