import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  User,
  Upload,
  CreditCard,
  CheckCircle,
  ChevronRight,
  Plus,
  Trash2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import {
  useApplication,
  useCourseSelections,
  useRemoveCourseSelection,
  useUpdateApplication,
} from '@/hooks/useApplication';
import { useLatestPayment, useCreatePayment } from '@/hooks/usePayments';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ApplicationPage = () => {
  const { data: profile } = useProfile();
  const { data: application, isLoading } = useApplication();
  const { data: selections } = useCourseSelections(application?.id);
  const { data: latestPayment } = useLatestPayment();
  const removeCourseSelection = useRemoveCourseSelection();
  const updateApplication = useUpdateApplication();
  const createPayment = useCreatePayment();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('courses');
  const [personalConfirmed, setPersonalConfirmed] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { color: 'bg-muted text-muted-foreground', label: 'Draft' };
      case 'payment_pending':
        return { color: 'bg-warning text-warning-foreground', label: 'Payment Pending' };
      case 'submitted':
        return { color: 'bg-secondary text-secondary-foreground', label: 'Submitted' };
      case 'in_progress':
        return { color: 'bg-primary text-primary-foreground', label: 'In Progress' };
      case 'completed':
        return { color: 'bg-success text-success-foreground', label: 'Completed' };
      default:
        return { color: 'bg-muted text-muted-foreground', label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(application?.status || 'draft');
  const isPaid = latestPayment?.status === 'completed';

  const handleRemoveCourse = async (id: string) => {
    if (!application) return;
    try {
      await removeCourseSelection.mutateAsync({ id, applicationId: application.id });
      toast({ title: 'Course removed from your choices' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove course', variant: 'destructive' });
    }
  };

  const handleConfirmPersonal = async () => {
    try {
      await updateApplication.mutateAsync({ personal_details_confirmed: true });
      toast({ title: 'Personal details confirmed' });
      setActiveTab('documents');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to confirm details', variant: 'destructive' });
    }
  };

  const handleInitiatePayment = async () => {
    if (!application) return;
    try {
      await createPayment.mutateAsync({
        user_id: application.user_id,
        application_id: application.id,
        amount: 500,
        status: 'pending',
        payment_method: 'mpesa',
        phone_number: profile?.phone || null,
        transaction_ref: null,
        mpesa_receipt: null,
        paid_at: null,
      });
      await updateApplication.mutateAsync({ status: 'payment_pending' });
      toast({ title: 'Payment initiated', description: 'Follow M-Pesa instructions to complete payment' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to initiate payment', variant: 'destructive' });
    }
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
      <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
        {/* Status Banner */}
        <div className={cn('rounded-xl p-6', statusConfig.color)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80 mb-1">Application Status</p>
              <h2 className="text-2xl font-bold">{statusConfig.label}</h2>
            </div>
            <div className="text-sm opacity-80">
              Last updated: {new Date(application?.updated_at || '').toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="courses" className="text-xs sm:text-sm">
              <BookOpen className="h-4 w-4 mr-1 hidden sm:block" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="personal" className="text-xs sm:text-sm">
              <User className="h-4 w-4 mr-1 hidden sm:block" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs sm:text-sm">
              <Upload className="h-4 w-4 mr-1 hidden sm:block" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="payment" className="text-xs sm:text-sm">
              <CreditCard className="h-4 w-4 mr-1 hidden sm:block" />
              Payment
            </TabsTrigger>
            <TabsTrigger
              value="confirmation"
              disabled={application?.status !== 'completed'}
              className="text-xs sm:text-sm"
            >
              <CheckCircle className="h-4 w-4 mr-1 hidden sm:block" />
              Confirm
            </TabsTrigger>
          </TabsList>

          {/* Course Selections Tab */}
          <TabsContent value="courses" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Your Course Choices</h3>
              <span className="text-sm text-muted-foreground">{selections?.length || 0} of 4 selected</span>
            </div>

            {selections && selections.length > 0 ? (
              <div className="space-y-4">
                {selections.map((selection, index) => (
                  <Card key={selection.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={cn(
                                'px-3 py-1 rounded-full text-xs font-bold',
                                index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              )}
                            >
                              Choice {selection.priority}
                            </span>
                            {selection.cluster_points && (
                              <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                                {selection.cluster_points} pts
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-foreground">{selection.course_name}</h4>
                          <p className="text-sm text-muted-foreground">{selection.institution_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCourse(selection.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No courses selected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse our course catalog and add up to 4 choices
                  </p>
                  <Link to="/dashboard/courses">
                    <Button variant="teal">
                      <Plus className="mr-2 h-4 w-4" />
                      Browse Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {selections && selections.length < 4 && selections.length > 0 && (
              <Link to="/dashboard/courses">
                <Button variant="outline" className="w-full border-dashed">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Choice ({4 - selections.length} remaining)
                </Button>
              </Link>
            )}

            {selections && selections.length > 0 && (
              <Button variant="teal" className="w-full" onClick={() => setActiveTab('personal')}>
                Continue to Personal Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </TabsContent>

          {/* Personal Details Tab */}
          <TabsContent value="personal" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Full Name</span>
                    <p className="font-medium text-foreground">{profile?.full_name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email</span>
                    <p className="font-medium text-foreground">{profile?.email || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone</span>
                    <p className="font-medium text-foreground">{profile?.phone || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID Number</span>
                    <p className="font-medium text-foreground">{profile?.id_number || '-'}</p>
                  </div>
                </div>
                <Link to="/dashboard/profile" className="text-sm text-primary hover:underline">
                  Edit in Profile →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">KCSE Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Index Number</span>
                    <p className="font-medium text-foreground">{profile?.index_number || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mean Grade</span>
                    <p className="font-medium text-foreground">{profile?.mean_grade || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cluster Points</span>
                    <p className="font-medium text-foreground">{profile?.cluster_points || '-'}</p>
                  </div>
                </div>
                <Link to="/dashboard/profile" className="text-sm text-primary hover:underline">
                  Edit in Profile →
                </Link>
              </CardContent>
            </Card>

            <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
              <Checkbox
                id="confirm"
                checked={personalConfirmed || application?.personal_details_confirmed}
                onCheckedChange={(checked) => setPersonalConfirmed(checked as boolean)}
                disabled={application?.personal_details_confirmed}
              />
              <Label htmlFor="confirm" className="text-sm cursor-pointer">
                I confirm that all information provided is accurate and complete
              </Label>
            </div>

            <Button
              variant="teal"
              className="w-full"
              onClick={handleConfirmPersonal}
              disabled={
                (!personalConfirmed && !application?.personal_details_confirmed) ||
                updateApplication.isPending
              }
            >
              {application?.personal_details_confirmed ? 'Details Confirmed ✓' : 'Confirm & Continue'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 mt-6">
            <div className="grid gap-4">
              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">ID Card Copy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a clear scan or photo of your National ID
                    </p>
                    <Button variant="outline">Choose File</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">KCSE Result Slip</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your official KCSE result slip
                    </p>
                    <Button variant="outline">Choose File</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Requirements:</strong> Clear, readable scans • File size under 5MB • PDF or image format
              </p>
            </div>

            <Button variant="teal" className="w-full" onClick={() => setActiveTab('payment')}>
              Continue to Payment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4 mt-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-sm text-muted-foreground mb-1">Service Fee</div>
                <div className="text-4xl font-bold text-secondary mb-4">KES 500</div>

                {isPaid ? (
                  <div className="flex items-center justify-center gap-2 text-success mb-4">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold">Payment Confirmed</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-warning mb-4">
                    <AlertCircle className="h-6 w-6" />
                    <span className="font-semibold">Payment Pending</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {!isPaid && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">M-Pesa Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paybill Number</span>
                      <span className="font-bold text-foreground">123456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-bold text-foreground">{profile?.phone || 'Your Phone'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold text-secondary">KES 500</span>
                    </div>
                  </div>

                  <Button variant="teal" className="w-full" onClick={handleInitiatePayment}>
                    I've Made Payment
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Payments are verified automatically within 5 minutes
                  </p>
                </CardContent>
              </Card>
            )}

            {isPaid && (
              <Button variant="teal" className="w-full" disabled>
                Submit Application
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </TabsContent>

          {/* Confirmation Tab */}
          <TabsContent value="confirmation" className="space-y-4 mt-6">
            {application?.status === 'completed' ? (
              <>
                <div className="bg-success rounded-xl p-8 text-center text-success-foreground">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Application Completed!</h2>
                  <p>Your KUCCPS registration has been submitted successfully.</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>KUCCPS Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-secondary">{application.kuccps_reference}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Submitted on {new Date(application.submitted_at || '').toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Complete all steps to view your confirmation
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationPage;
