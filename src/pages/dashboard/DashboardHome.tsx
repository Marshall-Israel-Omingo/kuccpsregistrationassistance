import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FileText,
  BookOpen,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { useApplication, useCourseSelections } from '@/hooks/useApplication';
import { useLatestPayment } from '@/hooks/usePayments';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'draft':
      return { color: 'bg-muted', textColor: 'text-muted-foreground', label: 'Not Started', icon: Clock };
    case 'payment_pending':
      return { color: 'bg-warning', textColor: 'text-warning-foreground', label: 'Payment Pending', icon: AlertCircle };
    case 'submitted':
      return { color: 'bg-secondary', textColor: 'text-secondary-foreground', label: 'Submitted', icon: CheckCircle };
    case 'in_progress':
      return { color: 'bg-primary', textColor: 'text-primary-foreground', label: 'In Progress', icon: Clock };
    case 'completed':
      return { color: 'bg-success', textColor: 'text-success-foreground', label: 'Completed', icon: CheckCircle };
    case 'rejected':
      return { color: 'bg-destructive', textColor: 'text-destructive-foreground', label: 'Rejected', icon: AlertCircle };
    default:
      return { color: 'bg-muted', textColor: 'text-muted-foreground', label: 'Unknown', icon: Clock };
  }
};

const getProgressPercentage = (
  status: string,
  selections: number,
  personalConfirmed: boolean,
  documentsUploaded: boolean
) => {
  let progress = 0;
  if (selections > 0) progress += 25;
  if (personalConfirmed) progress += 25;
  if (documentsUploaded) progress += 25;
  if (status === 'submitted' || status === 'in_progress') progress = 75;
  if (status === 'completed') progress = 100;
  return progress;
};

const DashboardHome = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: application, isLoading: applicationLoading } = useApplication();
  const { data: selections } = useCourseSelections(application?.id);
  const { data: latestPayment } = useLatestPayment();

  const isLoading = profileLoading || applicationLoading;
  const statusConfig = getStatusConfig(application?.status || 'draft');
  const StatusIcon = statusConfig.icon;
  const progress = getProgressPercentage(
    application?.status || 'draft',
    selections?.length || 0,
    application?.personal_details_confirmed || false,
    application?.documents_uploaded || false
  );

  const profileCompletion = () => {
    if (!profile) return 0;
    let complete = 0;
    const fields = ['full_name', 'email', 'phone', 'id_number', 'index_number', 'mean_grade', 'cluster_points'];
    fields.forEach((field) => {
      if (profile[field as keyof typeof profile]) complete++;
    });
    return Math.round((complete / fields.length) * 100);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20 lg:pb-6">
        {/* Welcome Banner */}
        <div className="gradient-coral rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
            <span className="text-primary-foreground/80 text-sm">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-primary-foreground/80 mt-1">
            {application?.status === 'completed'
              ? 'Your application has been completed successfully!'
              : 'Continue your application and secure your future.'}
          </p>
        </div>

        {/* Application Status Card */}
        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl ${statusConfig.color} flex items-center justify-center`}>
                  <StatusIcon className={`h-8 w-8 ${statusConfig.textColor}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Application Status</p>
                  <h3 className="text-xl font-bold text-foreground">{statusConfig.label}</h3>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-secondary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Link to="/dashboard/application">
                <Button variant="teal">
                  View Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">{selections?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Courses Selected</p>
                </div>
              </div>
              <Link
                to="/dashboard/application"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                View Choices →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {latestPayment?.status === 'completed' ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-bold text-success">Paid</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-5 w-5 text-warning" />
                        <span className="font-bold text-warning">Pending</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                </div>
              </div>
              <Link
                to="/dashboard/payments"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                View Details →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center relative">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-secondary">{profileCompletion()}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Profile Complete</p>
                </div>
              </div>
              <Link
                to="/dashboard/profile"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                Complete Profile →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/dashboard/courses">
                <Button variant="teal" className="w-full h-auto py-4 flex-col gap-2">
                  <BookOpen className="h-6 w-6" />
                  Browse Courses
                </Button>
              </Link>
              <Link to="/dashboard/application">
                <Button variant="coral" className="w-full h-auto py-4 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Complete Application
                </Button>
              </Link>
              <Link to="/dashboard/support">
                <Button variant="charcoal" className="w-full h-auto py-4 flex-col gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Get Help
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
