import { Mail, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminTemplatesPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notification Templates</h1>
          <p className="text-muted-foreground">Manage email and notification templates</p>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Mail className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">Templates Coming Soon</p>
            <p className="text-sm">This feature will be available in a future update.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTemplatesPage;
