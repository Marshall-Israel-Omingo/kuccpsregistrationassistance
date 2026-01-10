import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminApplicationsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground">Application management coming soon</p>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">Applications Coming Soon</p>
            <p className="text-sm">This feature will be available in a future update.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicationsPage;
