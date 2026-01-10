import { Shield, Key, Clock, Lock, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';

const AdminSecurityPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Security settings have been updated.',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security Settings</h1>
          <p className="text-muted-foreground">Configure authentication and security policies</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Authentication Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-secondary" />
                Authentication & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Policy */}
              <div>
                <h3 className="font-medium text-foreground mb-4">Password Requirements</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Minimum 8 characters</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require uppercase letter</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require number</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require special character</Label>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 2FA */}
              <div>
                <h3 className="font-medium text-foreground mb-4">Two-Factor Authentication</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Require for admin accounts</Label>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>2FA Method</Label>
                    <Select defaultValue="email">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS code</SelectItem>
                        <SelectItem value="email">Email code</SelectItem>
                        <SelectItem value="app">Authenticator app</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Session Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Session timeout (minutes)</Label>
                  <Input type="number" defaultValue={60} />
                </div>
                <div className="space-y-2">
                  <Label>Remember me duration (days)</Label>
                  <Input type="number" defaultValue={30} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enforce single session per user</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Logout on browser close</Label>
                  <Switch />
                </div>
              </div>

              <Separator />

              {/* Login Security */}
              <div>
                <h3 className="font-medium text-foreground mb-4">Login Protection</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max failed attempts</Label>
                    <Input type="number" defaultValue={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lockout duration (minutes)</Label>
                    <Input type="number" defaultValue={15} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>CAPTCHA after failed attempts</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-4">Encryption Settings</h3>
                <div className="p-3 bg-secondary/10 rounded-lg space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-secondary" />
                    <span className="font-medium text-secondary">Enabled</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Data at rest: AES-256</p>
                  <p className="text-sm text-muted-foreground">Data in transit: TLS 1.3</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-foreground mb-4">Data Export & Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Allow students to export their data</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Allow students to delete account</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-secondary" />
                Automated Backups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Backup frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Backup time</Label>
                <Input type="time" defaultValue="02:00" />
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Last backup: Today at 02:00 AM</p>
              </div>
              <Button variant="coral" className="w-full">
                Backup Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="teal" onClick={handleSave}>
            Save Security Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurityPage;
