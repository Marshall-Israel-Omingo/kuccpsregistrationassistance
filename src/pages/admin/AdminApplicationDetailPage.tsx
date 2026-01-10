import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminApplicationDetailPage = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Application Details</h1>
            <p className="text-muted-foreground">View application information</p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              Application management has been replaced with the CourseMatch course browsing system.
            </p>
            <Button asChild>
              <Link to="/admin">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicationDetailPage;
