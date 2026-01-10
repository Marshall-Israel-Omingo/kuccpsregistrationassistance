import { 
  Users, 
  CreditCard,
  TrendingUp,
  CheckCircle,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminStats, useAllPayments } from '@/hooks/useAdmin';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: payments } = useAllPayments();

  const recentPayments = payments?.slice(0, 5) || [];
  const completedPayments = payments?.filter(p => p.status === 'completed').length || 0;
  const totalRevenue = payments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0) || 0;

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
          <p className="text-muted-foreground">Overview of CourseMatch platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <span>Registered users</span>
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
                  <p className="text-sm text-muted-foreground">Total Payments</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.totalPayments || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <span>All payment transactions</span>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/students">
                  <Users className="h-5 w-5" />
                  <span>View Students</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/payments">
                  <CreditCard className="h-5 w-5" />
                  <span>View Payments</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/admin/reports">
                  <TrendingUp className="h-5 w-5" />
                  <span>Generate Reports</span>
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
