import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminSupportPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support</h1>
          <p className="text-muted-foreground">Support ticket management coming soon</p>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">Support System Coming Soon</p>
            <p className="text-sm">This feature will be available in a future update.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSupportPage;
