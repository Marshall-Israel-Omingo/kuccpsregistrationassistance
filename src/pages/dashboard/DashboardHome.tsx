import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BookOpen,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Target,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { usePlatformAccess, usePrimaryShortlist, useShortlistCourses } from '@/hooks/useApplication';
import { useLatestPayment } from '@/hooks/usePayments';

const getAccessConfig = (status: string) => {
  switch (status) {
    case 'free':
      return { color: 'bg-muted', textColor: 'text-muted-foreground', label: 'Free Tier', icon: Clock };
    case 'pending':
      return { color: 'bg-warning', textColor: 'text-warning-foreground', label: 'Payment Pending', icon: AlertCircle };
    case 'paid':
      return { color: 'bg-success', textColor: 'text-success-foreground', label: 'Full Access', icon: CheckCircle };
    case 'expired':
      return { color: 'bg-destructive', textColor: 'text-destructive-foreground', label: 'Expired', icon: AlertCircle };
    default:
      return { color: 'bg-muted', textColor: 'text-muted-foreground', label: 'Unknown', icon: Clock };
  }
};

const DashboardHome = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: platformAccess, isLoading: accessLoading } = usePlatformAccess();
  const { data: primaryShortlist } = usePrimaryShortlist();
  const { data: shortlistCourses } = useShortlistCourses(primaryShortlist?.id);
  const { data: latestPayment } = useLatestPayment();

  const isLoading = profileLoading || accessLoading;
  const accessConfig = getAccessConfig(platformAccess?.status || 'free');
  const AccessIcon = accessConfig.icon;
  
  const hasPaidAccess = platformAccess?.status === 'paid';
  const hasGrades = profile?.mean_grade && profile.aggregate_points;

  const getProgress = () => {
    let progress = 0;
    if (profile?.full_name) progress += 20;
    if (hasGrades) progress += 30;
    if (hasPaidAccess) progress += 30;
    if ((shortlistCourses?.length || 0) > 0) progress += 20;
    return progress;
  };

  const profileCompletion = () => {
    if (!profile) return 0;
    let complete = 0;
    const fields = ['full_name', 'email', 'phone', 'mean_grade', 'aggregate_points', 'secondary_school', 'county'];
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
            {hasPaidAccess
              ? 'Explore personalized course recommendations and build your shortlist.'
              : 'Enter your KCSE grades and unlock smart course recommendations for just KES 50.'}
          </p>
        </div>

        {/* Access Status Card */}
        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl ${accessConfig.color} flex items-center justify-center`}>
                  <AccessIcon className={`h-8 w-8 ${accessConfig.textColor}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Access Status</p>
                  <h3 className="text-xl font-bold text-foreground">{accessConfig.label}</h3>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="font-semibold text-secondary">{getProgress()}%</span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>
              {!hasPaidAccess ? (
                <Link to="/dashboard/payments">
                  <Button variant="teal">
                    Unlock Full Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard/courses">
                  <Button variant="teal">
                    Browse Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">{shortlistCourses?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Courses Shortlisted</p>
                </div>
              </div>
              <Link
                to="/dashboard/shortlist"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                View Shortlist →
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

        {/* KCSE Results Summary */}
        {hasGrades && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Your KCSE Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-primary">{profile?.mean_grade}</p>
                  <p className="text-sm text-muted-foreground">Mean Grade</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-secondary">{profile?.aggregate_points}</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">
                    {hasPaidAccess ? '1000+' : '—'}
                  </p>
                  <p className="text-sm text-muted-foreground">Courses Available</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-success">
                    {hasPaidAccess ? 'Active' : 'Locked'}
                  </p>
                  <p className="text-sm text-muted-foreground">Recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
              <Link to="/dashboard/profile">
                <Button variant="coral" className="w-full h-auto py-4 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Update Profile
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
