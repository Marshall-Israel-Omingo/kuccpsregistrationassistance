import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronLeft,
  Clock,
  BookOpen,
  Building2,
  GraduationCap,
  Briefcase,
  MapPin,
  CheckCircle,
  Plus,
  Check,
  Loader2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCourseById, getPrincipleById } from '@/data/courses';
import { useAuth } from '@/contexts/AuthContext';
import { useAddToShortlist, useShortlistCourses } from '@/hooks/useShortlist';
import { useToast } from '@/hooks/use-toast';

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = getCourseById(courseId || '');
  const principle = course ? getPrincipleById(course.principleId) : null;
  const { user } = useAuth();
  const { toast } = useToast();
  const addToShortlist = useAddToShortlist();
  const { data: shortlistCourses } = useShortlistCourses();
  
  const isInShortlist = shortlistCourses?.some(c => c.course_id === courseId) ?? false;
  const shortlistCount = shortlistCourses?.length || 0;

  const handleAddToChoices = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/courses/${courseId}` } } });
      return;
    }

    try {
      await addToShortlist.mutateAsync({ 
        courseId: courseId || '',
        institutionId: course?.institutions[0]?.id,
        institutionName: course?.institutions[0]?.name,
      });
      toast({
        title: 'Added to My Choices',
        description: `${course?.name} has been added to your course choices.`,
      });
    } catch (error: any) {
      toast({
        title: 'Could not add course',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!course || !principle) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Course not found
            </h1>
            <Link to="/courses">
              <Button variant="teal">Browse All Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.name} | KUCCPS Registration Service</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 bg-muted">
          {/* Breadcrumb */}
          <div className="bg-card border-b border-border py-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm">
                <Link to="/courses" className="text-muted-foreground hover:text-secondary">
                  Courses
                </Link>
                <span className="text-muted-foreground">/</span>
                <Link
                  to={`/courses/principle/${principle.id}`}
                  className="text-muted-foreground hover:text-secondary"
                >
                  {principle.name}
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground font-medium truncate max-w-[200px]">
                  {course.name}
                </span>
              </nav>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Header Card */}
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <Link
                      to={`/courses/principle/${principle.id}`}
                      className="inline-flex items-center text-secondary hover:text-secondary/80 mb-4 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to {principle.name}
                    </Link>

                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {course.name}
                    </h1>
                    <p className="text-muted-foreground mb-4">{course.code}</p>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full gradient-coral text-primary-foreground text-sm font-medium">
                        {principle.icon} {principle.name}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GraduationCap className="h-5 w-5 text-secondary" />
                      Entry Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary/10 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-secondary">
                          {course.clusterPoints}
                        </div>
                        <div className="text-sm text-muted-foreground">Cluster Points</div>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-primary">
                          {course.meanGrade}
                        </div>
                        <div className="text-sm text-muted-foreground">Mean Grade</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Subject Requirements</h4>
                      <div className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-border last:border-0"
                          >
                            <span className="text-foreground">{req.subject}</span>
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              {req.minimumGrade}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Program Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-secondary" />
                      Program Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <Clock className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                          <div className="font-semibold text-foreground">{course.duration}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Mode</div>
                          <div className="font-semibold text-foreground">{course.mode}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About This Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Career Pathways Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Briefcase className="h-5 w-5 text-secondary" />
                      Career Pathways
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {course.careers.map((career, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted"
                        >
                          <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                          <span className="text-foreground">{career}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Action Card - Sticky */}
                <div className="lg:sticky lg:top-24">
                  <Card className="shadow-lg">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="text-sm text-muted-foreground mb-1">
                          Service Fee
                        </div>
                        <div className="text-3xl font-bold text-secondary">
                          KES 500
                        </div>
                      </div>

                      <Button 
                        variant="teal" 
                        size="lg" 
                        className="w-full mb-3"
                        onClick={handleAddToChoices}
                        disabled={isInShortlist || shortlistCount >= 4 || addToShortlist.isPending}
                      >
                        {addToShortlist.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : isInShortlist ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Added to Choices
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add to My Choices
                          </>
                        )}
                      </Button>

                      {isInShortlist && (
                        <Link to="/dashboard/my-choices">
                          <Button variant="outline" size="lg" className="w-full">
                            View My Choices
                          </Button>
                        </Link>
                      )}

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        {shortlistCount}/4 choices selected
                      </p>
                    </CardContent>
                  </Card>

                  {/* Institutions Card */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 className="h-5 w-5 text-secondary" />
                        Offering Institutions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {course.institutions.map((institution) => (
                        <div
                          key={institution.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted"
                        >
                          <div className="p-2 rounded-lg bg-card">
                            <Building2 className="h-4 w-4 text-secondary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {institution.name}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {institution.campus}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CourseDetailPage;
