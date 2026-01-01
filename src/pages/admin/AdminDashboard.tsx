import { 
  Users, 
  FileText, 
  CreditCard, 
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminStats, useAllApplications, useAllPayments } from '@/hooks/useAdmin';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: applications } = useAllApplications();
  const { data: payments } = useAllPayments();

  const recentApplications = applications?.slice(0, 5) || [];
  const recentPayments = payments?.slice(0, 5) || [];

  const pendingApplications = applications?.filter(a => a.status === 'submitted' || a.status === 'in_progress').length || 0;
  const completedPayments = payments?.filter(p => p.status === 'completed').length || 0;
  const totalRevenue = payments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-secondary/10 text-secondary';
      case 'submitted': return 'bg-primary/10 text-primary';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (statsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your KUCCPS portal activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalStudents || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-secondary">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalApplications || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-amber-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{pendingApplications} pending review</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">KES {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-secondary">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>{completedPayments} successful payments</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Support Tickets</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalTickets || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>3 awaiting response</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/applications">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No applications yet</p>
                ) : (
                  recentApplications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">
                          {app.profiles?.full_name || 'Unknown Student'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/payments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No payments yet</p>
                ) : (
                  recentPayments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">
                          KES {Number(payment.amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.phone_number || 'N/A'} • {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={payment.status === 'completed' ? 'bg-secondary/10 text-secondary' : 'bg-amber-100 text-amber-700'}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/applications">
                  <FileText className="h-5 w-5" />
                  <span>Process Applications</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/support">
                  <MessageSquare className="h-5 w-5" />
                  <span>View Tickets</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/reports">
                  <TrendingUp className="h-5 w-5" />
                  <span>Generate Reports</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/settings/system">
                  <AlertCircle className="h-5 w-5" />
                  <span>System Status</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
