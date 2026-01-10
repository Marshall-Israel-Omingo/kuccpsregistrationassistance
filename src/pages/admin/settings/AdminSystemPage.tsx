import { useState } from 'react';
import { 
  Server, 
  AlertTriangle, 
  Database, 
  Zap, 
  RefreshCw,
  CheckCircle,
  Trash2,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';

const AdminSystemPage = () => {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleMaintenanceToggle = async (enabled: boolean) => {
    setMaintenanceMode(enabled);
    toast({
      title: enabled ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled',
      description: enabled 
        ? 'Students will see the maintenance page.' 
        : 'System is now accessible to all users.',
    });
  };

  const systemStatus = [
    { name: 'Database', status: 'operational', responseTime: '12ms' },
    { name: 'Storage', status: 'operational', usage: '23%' },
    { name: 'API', status: 'operational', uptime: '99.9%' },
    { name: 'Payment Gateway', status: 'operational', successRate: '98.5%' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and maintenance</p>
        </div>

        {/* Maintenance Mode */}
        <Card className={maintenanceMode ? 'border-amber-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${maintenanceMode ? 'text-amber-500' : 'text-muted-foreground'}`} />
              System Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Banner */}
            <div className={`p-4 rounded-lg ${maintenanceMode ? 'bg-amber-100' : 'bg-secondary/10'}`}>
              <p className={`font-semibold ${maintenanceMode ? 'text-amber-700' : 'text-secondary'}`}>
                {maintenanceMode ? 'Maintenance Mode ACTIVE' : 'System is LIVE'}
              </p>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, students will see a maintenance page
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={handleMaintenanceToggle}
              />
            </div>

            {maintenanceMode && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Allow admin access</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance message</Label>
                    <Textarea
                      defaultValue="System is under maintenance. Please try again later."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    Warning: Activating maintenance mode will prevent students from accessing the platform
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-secondary" />
              System Health & Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemStatus.map((item) => (
                <div key={item.name} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.name}</span>
                    <Badge className="bg-secondary/10 text-secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.responseTime && `Response: ${item.responseTime}`}
                    {item.usage && `Usage: ${item.usage}`}
                    {item.uptime && `Uptime: ${item.uptime}`}
                    {item.successRate && `Success: ${item.successRate}`}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Storage Usage */}
            <div className="space-y-4">
              <h3 className="font-medium">Storage Usage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: 2.3 GB</span>
                  <span>Total: 10 GB</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Cache Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                Cache & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">45 MB</p>
                  <p className="text-sm text-muted-foreground">Cache Size</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-muted-foreground">Hit Rate</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">8%</p>
                  <p className="text-sm text-muted-foreground">Miss Rate</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Cache
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Course Data Cache
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Auto-clear on course updates</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-clear on settings changes</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-secondary" />
                Database Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">156 MB</p>
                  <p className="text-sm text-muted-foreground">Database Size</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Last optimization: 3 days ago
              </p>

              <Separator />

              <div className="space-y-2">
                <Button variant="teal" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
                <Button variant="outline" className="w-full">
                  Analyze Tables
                </Button>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Note: Database operations may temporarily affect performance
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Version */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-secondary" />
              System Version & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">v1.0.0</p>
                <p className="text-sm text-muted-foreground">Released January 2026</p>
              </div>
              <Badge className="bg-secondary/10 text-secondary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Up to date
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check for Updates
              </Button>
              <Button variant="ghost">View Changelog</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSystemPage;
