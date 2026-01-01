import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminStats } from '@/hooks/useAdmin';

const AdminReportsPage = () => {
  const { data: stats } = useAdminStats();

  const reports = [
    {
      name: 'Applications Summary',
      description: 'Overview of all applications by status',
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'Revenue Report',
      description: 'Payment collection and revenue analysis',
      icon: CreditCard,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      name: 'Student Demographics',
      description: 'Student distribution by county and grades',
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      name: 'Performance Metrics',
      description: 'System performance and usage statistics',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate and view system reports</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats?.totalStudents || 0}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats?.totalApplications || 0}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats?.totalPayments || 0}</p>
                <p className="text-sm text-muted-foreground">Payments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats?.totalTickets || 0}</p>
                <p className="text-sm text-muted-foreground">Support Tickets</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.name} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${report.bgColor} flex items-center justify-center`}>
                      <report.icon className={`h-5 w-5 ${report.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Report Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applications">Applications</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="teal">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
