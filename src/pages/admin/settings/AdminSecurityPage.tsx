import { useState } from 'react';
import { Shield, Key, Clock, Lock, AlertTriangle, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuditLogs, useSystemSettings } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

const AdminSecurityPage = () => {
  const { data: auditLogs, isLoading: logsLoading } = useAuditLogs({ limit: 50 });
  const { data: settings } = useSystemSettings('security');
  const { toast } = useToast();

  const passwordPolicy = settings?.find(s => s.key === 'password_policy')?.value as Record<string, any> || {};
  const sessionSettings = settings?.find(s => s.key === 'session')?.value as Record<string, any> || {};
  const loginSettings = settings?.find(s => s.key === 'login')?.value as Record<string, any> || {};

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Security settings have been updated.',
    });
  };

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      info: 'bg-muted text-muted-foreground',
      warning: 'bg-amber-100 text-amber-700',
      error: 'bg-destructive/10 text-destructive',
      critical: 'bg-red-600 text-white',
    };
    return <Badge className={styles[severity] || styles.info}>{severity}</Badge>;
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
                    <Switch defaultChecked={passwordPolicy.min_length >= 8} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require uppercase letter</Label>
                    <Switch defaultChecked={passwordPolicy.require_uppercase} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require number</Label>
                    <Switch defaultChecked={passwordPolicy.require_number} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require special character</Label>
                    <Switch defaultChecked={passwordPolicy.require_special} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Password expiry (days, 0 = never)</Label>
                    <Input type="number" defaultValue={0} className="w-20" />
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
                  <Input type="number" defaultValue={sessionSettings.timeout_minutes || 60} />
                </div>
                <div className="space-y-2">
                  <Label>Remember me duration (days)</Label>
                  <Input type="number" defaultValue={sessionSettings.remember_days || 30} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enforce single session per user</Label>
                  <Switch defaultChecked={sessionSettings.single_session} />
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
                    <Input type="number" defaultValue={loginSettings.max_attempts || 5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lockout duration (minutes)</Label>
                    <Input type="number" defaultValue={loginSettings.lockout_minutes || 15} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>CAPTCHA after failed attempts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Email on suspicious login</Label>
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
                <h3 className="font-medium text-foreground mb-4">Data Retention</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Completed applications (years)</Label>
                    <Input type="number" defaultValue={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cancelled applications (months)</Label>
                    <Input type="number" defaultValue={12} />
                  </div>
                  <div className="space-y-2">
                    <Label>Activity logs (months)</Label>
                    <Input type="number" defaultValue={24} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto-delete after retention period</Label>
                    <Switch defaultChecked />
                  </div>
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
                  <div className="space-y-2">
                    <Label>Account deletion grace period (days)</Label>
                    <Input type="number" defaultValue={30} />
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
              <div className="space-y-2">
                <Label>Keep backups</Label>
                <Input type="number" defaultValue={30} />
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

        {/* Audit Logs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-secondary" />
              Security Audit Log
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {logsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !auditLogs || auditLogs.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p>No audit logs available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{log.event_type}</TableCell>
                        <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.description}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip_address || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

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
