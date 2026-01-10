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
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProfile, useSubjectGrades } from '@/hooks/useProfile';
import { useLatestPayment } from '@/hooks/usePayments';

const DashboardHome = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: subjectGrades } = useSubjectGrades();
  const { data: latestPayment } = useLatestPayment();

  const isLoading = profileLoading;

  const profileCompletion = () => {
    if (!profile) return 0;
    let complete = 0;
    const fields = ['full_name', 'email', 'phone', 'mean_grade', 'aggregate_points'];
    fields.forEach((field) => {
      if (profile[field as keyof typeof profile]) complete++;
    });
    // Add subject grades completion
    if (subjectGrades && subjectGrades.length >= 7) complete++;
    return Math.round((complete / (fields.length + 1)) * 100);
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
            Discover courses that match your qualifications.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">{profile?.mean_grade || '-'}</p>
                  <p className="text-sm text-muted-foreground">Mean Grade</p>
                </div>
              </div>
              <Link
                to="/dashboard/profile"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                View Profile →
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

        {/* Academic Summary */}
        {subjectGrades && subjectGrades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your KCSE Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-secondary">{profile?.mean_grade || '-'}</p>
                  <p className="text-sm text-muted-foreground">Mean Grade</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{profile?.aggregate_points || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{subjectGrades.length}</p>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {subjectGrades.filter(g => g.grade.startsWith('A') || g.grade.startsWith('B')).length}
                  </p>
                  <p className="text-sm text-muted-foreground">A's & B's</p>
                </div>
              </div>
              <Link to="/dashboard/profile">
                <Button variant="outline" size="sm">
                  View All Grades
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
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
              <Link to="/courses">
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
              <Link to="/contact">
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
