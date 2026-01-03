import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  GraduationCap,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  useApplicationDetails,
  useUpdateApplicationStatus,
  useApplicationCourseSelections,
  useApplicationDocuments,
  useApplicationPayments,
} from '@/hooks/useAdminApplications';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-muted text-muted-foreground' },
  { value: 'payment_pending', label: 'Payment Pending', color: 'bg-amber-100 text-amber-700' },
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-primary/10 text-primary' },
  { value: 'completed', label: 'Completed', color: 'bg-secondary/10 text-secondary' },
  { value: 'rejected', label: 'Rejected', color: 'bg-destructive/10 text-destructive' },
];

const AdminApplicationDetailPage = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [newStatus, setNewStatus] = useState<string>('');
  const [kuccpsRef, setKuccpsRef] = useState('');

  const { data: application, isLoading } = useApplicationDetails(applicationId);
  const { data: courseSelections } = useApplicationCourseSelections(applicationId);
  const { data: documents } = useApplicationDocuments(applicationId);
  const { data: payments } = useApplicationPayments(application?.user_id);
  const updateStatus = useUpdateApplicationStatus();

  const handleStatusUpdate = async () => {
    if (!applicationId || !newStatus) return;

    try {
      const updates: Record<string, unknown> = { status: newStatus };
      
      if (newStatus === 'completed' && kuccpsRef) {
        updates.kuccps_reference = kuccpsRef;
        updates.completed_at = new Date().toISOString();
      }
      
      if (newStatus === 'submitted') {
        updates.submitted_at = new Date().toISOString();
      }

      await updateStatus.mutateAsync({ applicationId, updates });
      toast.success('Application status updated successfully');
      setNewStatus('');
      setKuccpsRef('');
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(s => s.value === status);
    return <Badge className={option?.color || 'bg-muted'}>{status.replace('_', ' ')}</Badge>;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Application not found</p>
          <Button asChild>
            <Link to="/admin/applications">Back to Applications</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const profile = application.profiles;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/applications')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Application Details</h1>
              <p className="text-muted-foreground">ID: {application.id.slice(0, 8)}...</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(application.status)}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{profile?.full_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profile?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">
                        {profile?.date_of_birth
                          ? new Date(profile.date_of_birth).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">County</p>
                      <p className="font-medium">{profile?.county || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">ID Number</p>
                      <p className="font-medium">{profile?.id_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Index Number</p>
                    <p className="font-medium">{profile?.index_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mean Grade</p>
                    <p className="font-medium">{profile?.mean_grade || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cluster Points</p>
                    <p className="font-medium">{profile?.cluster_points || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Selections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Course Selections ({courseSelections?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courseSelections && courseSelections.length > 0 ? (
                  <div className="space-y-3">
                    {courseSelections.map((selection: any, index: number) => (
                      <div
                        key={selection.id}
                        className="flex items-start justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {selection.priority}
                          </div>
                          <div>
                            <p className="font-medium">{selection.course_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {selection.institution_name || 'Institution N/A'}
                            </p>
                            {selection.course_code && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Code: {selection.course_code}
                              </p>
                            )}
                          </div>
                        </div>
                        {selection.cluster_points && (
                          <Badge variant="outline">
                            {selection.cluster_points} pts
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No courses selected yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents ({documents?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents && documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.file_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.document_type} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No documents uploaded yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                  {getStatusBadge(application.status)}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Change Status To</p>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newStatus === 'completed' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">KUCCPS Reference Number</p>
                    <Textarea
                      placeholder="Enter the KUCCPS reference number..."
                      value={kuccpsRef}
                      onChange={(e) => setKuccpsRef(e.target.value)}
                    />
                  </div>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={!newStatus || updateStatus.isPending}
                    >
                      {updateStatus.isPending ? 'Updating...' : 'Update Status'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to change the application status to "{newStatus.replace('_', ' ')}"?
                        {newStatus === 'rejected' && (
                          <span className="block mt-2 text-destructive">
                            Warning: This action may notify the student.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleStatusUpdate}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* Application Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(application.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {application.submitted_at && (
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(application.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {application.completed_at && (
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Completed</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(application.completed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {application.kuccps_reference && (
                    <div className="mt-4 p-3 rounded-lg bg-secondary/10">
                      <p className="text-sm font-medium text-secondary">KUCCPS Reference</p>
                      <p className="text-sm">{application.kuccps_reference}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments && payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            KES {Number(payment.amount).toLocaleString()}
                          </p>
                          <Badge
                            className={
                              payment.status === 'completed'
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-amber-100 text-amber-700'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {payment.mpesa_receipt || 'No receipt'} • {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No payments recorded
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Application Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {application.personal_details_confirmed ? (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={application.personal_details_confirmed ? '' : 'text-muted-foreground'}>
                    Personal Details Confirmed
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {application.documents_uploaded ? (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={application.documents_uploaded ? '' : 'text-muted-foreground'}>
                    Documents Uploaded
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {courseSelections && courseSelections.length > 0 ? (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={courseSelections && courseSelections.length > 0 ? '' : 'text-muted-foreground'}>
                    Courses Selected
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {payments?.some((p: any) => p.status === 'completed') ? (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={payments?.some((p: any) => p.status === 'completed') ? '' : 'text-muted-foreground'}>
                    Payment Completed
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicationDetailPage;
