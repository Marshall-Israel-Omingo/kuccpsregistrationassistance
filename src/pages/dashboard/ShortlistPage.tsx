import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowUpDown, 
  Trash2, 
  Download, 
  Edit3, 
  Save,
  X,
  Star,
  Building2,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { 
  usePlatformAccess, 
  usePrimaryShortlist, 
  useShortlistCourses, 
  useRemoveFromShortlist,
  useUpdateShortlistCourse,
} from '@/hooks/useApplication';
import { useToast } from '@/hooks/use-toast';
import { getCourseById } from '@/data/courses';

const ShortlistPage = () => {
  const { data: profile } = useProfile();
  const { data: platformAccess } = usePlatformAccess();
  const { data: primaryShortlist } = usePrimaryShortlist();
  const { data: shortlistCourses, isLoading } = useShortlistCourses(primaryShortlist?.id);
  const removeFromShortlist = useRemoveFromShortlist();
  const updateCourse = useUpdateShortlistCourse();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const hasPaidAccess = platformAccess?.status === 'paid';

  const handleRemove = async (id: string) => {
    if (!primaryShortlist) return;
    try {
      await removeFromShortlist.mutateAsync({ id, shortlistId: primaryShortlist.id });
      toast({ title: 'Removed', description: 'Course removed from shortlist' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove course', variant: 'destructive' });
    }
  };

  const handleSaveNotes = async (id: string) => {
    if (!primaryShortlist) return;
    try {
      await updateCourse.mutateAsync({
        id,
        shortlistId: primaryShortlist.id,
        updates: { notes: editNotes },
      });
      setEditingId(null);
      toast({ title: 'Saved', description: 'Notes updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save notes', variant: 'destructive' });
    }
  };

  const handleExportPDF = () => {
    // Create a simple text export for now
    if (!shortlistCourses || shortlistCourses.length === 0) {
      toast({ title: 'No courses', description: 'Add courses to your shortlist first', variant: 'destructive' });
      return;
    }

    const content = shortlistCourses.map((course, index) => 
      `${index + 1}. ${course.course_name} (${course.course_code}) - ${course.institution_name || 'Various'}`
    ).join('\n');

    const blob = new Blob([
      `CourseMatch - My Course Shortlist\n`,
      `Student: ${profile?.full_name || 'N/A'}\n`,
      `Mean Grade: ${profile?.mean_grade || 'N/A'}\n`,
      `Total Points: ${profile?.aggregate_points || 'N/A'}\n\n`,
      `Shortlisted Courses:\n${content}\n`,
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coursematch-shortlist.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Exported', description: 'Shortlist downloaded' });
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Course Shortlist</h1>
            <p className="text-muted-foreground">
              {shortlistCourses?.length || 0} courses selected for KUCCPS application
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF} disabled={!shortlistCourses?.length}>
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
            <Link to="/dashboard/courses">
              <Button variant="teal">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>

        {!hasPaidAccess && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-8 w-8 text-warning" />
                <div>
                  <h3 className="font-semibold">Unlock Full Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay 50 KES to get personalized recommendations and save up to 10 courses
                  </p>
                </div>
              </div>
              <Link to="/dashboard/payments">
                <Button variant="coral">Pay KES 50</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Shortlist */}
        {shortlistCourses && shortlistCourses.length > 0 ? (
          <div className="space-y-4">
            {shortlistCourses.map((course, index) => {
              const courseDetails = getCourseById(course.course_id);
              const isEditing = editingId === course.id;

              return (
                <Card key={course.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Priority number */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xl">
                        {index + 1}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{course.course_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.course_code} • {course.institution_name || 'Various institutions'}
                            </p>
                          </div>
                          {course.fit_score && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                              <Star className="h-3 w-3" />
                              {course.fit_score}% fit
                            </span>
                          )}
                        </div>

                        {/* Notes section */}
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Input
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="Add notes about this choice..."
                              className="flex-1"
                            />
                            <Button size="sm" onClick={() => handleSaveNotes(course.id)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {course.notes ? (
                              <p className="text-sm italic text-muted-foreground">"{course.notes}"</p>
                            ) : (
                              <p className="text-sm text-muted-foreground">No notes</p>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => {
                                setEditingId(course.id);
                                setEditNotes(course.notes || '');
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {/* Course details if available */}
                        {courseDetails && (
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                              {courseDetails.clusterPoints} points required
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {courseDetails.institutions.length} institutions
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link to={`/courses/${course.course_id}`}>
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove from shortlist?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove {course.course_name} from your shortlist.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemove(course.id)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses shortlisted yet</h3>
              <p className="text-muted-foreground mb-6">
                Start browsing courses and add your top choices to build your KUCCPS application list.
              </p>
              <Link to="/dashboard/courses">
                <Button variant="teal">Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Tips Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Your Shortlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Add courses in order of preference - your first choice should be your dream course</p>
            <p>• Include a mix of competitive and achievable options based on your points</p>
            <p>• Consider location, duration, and career outcomes when deciding</p>
            <p>• Export your list and use it when applying on the official KUCCPS portal</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ShortlistPage;
