import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  GripVertical, 
  Trash2, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useShortlistCourses, useRemoveFromShortlist, useUpdatePriority } from '@/hooks/useShortlist';
import { useSubjectGrades } from '@/hooks/useProfile';
import { getCourseById, Course } from '@/data/courses';
import { useToast } from '@/hooks/use-toast';

interface CourseWithStrength {
  shortlistId: string;
  course: Course;
  priority: number;
  strengthScore: number;
  matchingSubjects: { subject: string; grade: string; required: string; status: 'exceeds' | 'meets' | 'below' }[];
  qualifies: boolean;
}

const MyChoicesPage = () => {
  const { data: shortlistCourses, isLoading } = useShortlistCourses();
  const { data: subjectGrades } = useSubjectGrades();
  const removeFromShortlist = useRemoveFromShortlist();
  const updatePriority = useUpdatePriority();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'priority' | 'strength'>('strength');

  // Calculate strength scores for each course
  const coursesWithStrength = useMemo(() => {
    if (!shortlistCourses) return [];

    const gradeValues: Record<string, number> = {
      'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
      'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
    };

    return shortlistCourses.map(sc => {
      const course = getCourseById(sc.course_id);
      if (!course) return null;

      const matchingSubjects: CourseWithStrength['matchingSubjects'] = [];
      let totalScore = 0;
      let qualifies = true;

      course.requirements.forEach(req => {
        // Find matching subject from user's grades
        const userGrade = subjectGrades?.find(sg => 
          req.subject.toLowerCase().includes(sg.subject.toLowerCase()) ||
          sg.subject.toLowerCase().includes(req.subject.toLowerCase().split('/')[0])
        );

        if (userGrade) {
          const userValue = gradeValues[userGrade.grade] || 0;
          const reqValue = gradeValues[req.minimumGrade] || 0;
          
          let status: 'exceeds' | 'meets' | 'below' = 'below';
          if (userValue > reqValue) {
            status = 'exceeds';
            totalScore += (userValue - reqValue) + 5;
          } else if (userValue === reqValue) {
            status = 'meets';
            totalScore += 3;
          } else {
            status = 'below';
            qualifies = false;
          }

          matchingSubjects.push({
            subject: req.subject,
            grade: userGrade.grade,
            required: req.minimumGrade,
            status
          });
        } else {
          matchingSubjects.push({
            subject: req.subject,
            grade: '-',
            required: req.minimumGrade,
            status: 'below'
          });
          qualifies = false;
        }
      });

      return {
        shortlistId: sc.id,
        course,
        priority: sc.priority,
        strengthScore: totalScore,
        matchingSubjects,
        qualifies
      } as CourseWithStrength;
    }).filter(Boolean) as CourseWithStrength[];
  }, [shortlistCourses, subjectGrades]);

  // Sort courses based on selected criteria
  const sortedCourses = useMemo(() => {
    const sorted = [...coursesWithStrength];
    if (sortBy === 'strength') {
      sorted.sort((a, b) => b.strengthScore - a.strengthScore);
    } else {
      sorted.sort((a, b) => a.priority - b.priority);
    }
    return sorted;
  }, [coursesWithStrength, sortBy]);

  const handleRemove = async (id: string, courseName: string) => {
    try {
      await removeFromShortlist.mutateAsync(id);
      toast({
        title: 'Course Removed',
        description: `${courseName} has been removed from your choices.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove course. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSortByStrength = async () => {
    if (sortBy === 'strength') {
      // Already sorted by strength, apply as new priority order
      const updates = sortedCourses.map((c, index) => ({
        id: c.shortlistId,
        priority: index + 1
      }));
      
      try {
        await updatePriority.mutateAsync(updates);
        toast({
          title: 'Priorities Updated',
          description: 'Your course choices have been reordered by strength.',
        });
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to update priorities.',
          variant: 'destructive',
        });
      }
    } else {
      setSortBy('strength');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Course Choices</h1>
            <p className="text-muted-foreground">
              {shortlistCourses?.length || 0} of 4 choices selected
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'strength' ? 'default' : 'outline'}
              onClick={() => setSortBy('strength')}
              size="sm"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              By Strength
            </Button>
            <Button
              variant={sortBy === 'priority' ? 'default' : 'outline'}
              onClick={() => setSortBy('priority')}
              size="sm"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              By Priority
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        {subjectGrades && subjectGrades.length === 0 && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Add your subject grades for accurate comparison
                </p>
                <Link to="/dashboard/profile" className="text-sm text-amber-600 hover:underline">
                  Update your grades in Profile →
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {sortedCourses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No Courses Selected Yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Browse our course catalog and add courses to your choices to compare them based on your qualifications.
              </p>
              <Link to="/courses">
                <Button variant="teal">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedCourses.map((item, index) => (
              <Card 
                key={item.shortlistId} 
                className={`transition-all ${
                  item.qualifies 
                    ? 'border-l-4 border-l-green-500' 
                    : 'border-l-4 border-l-amber-500'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg leading-tight">
                          <Link 
                            to={`/courses/${item.course.id}`}
                            className="hover:text-secondary transition-colors"
                          >
                            {item.course.name}
                          </Link>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.course.code} • {item.course.duration}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.shortlistId, item.course.name)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant={item.qualifies ? 'default' : 'secondary'} className="gap-1">
                      {item.qualifies ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Qualified
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          Check Requirements
                        </>
                      )}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Strength Score: <span className="font-semibold text-foreground">{item.strengthScore}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Required: <span className="font-semibold">{item.course.clusterPoints} pts</span>
                    </span>
                  </div>

                  {/* Subject Comparison */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {item.matchingSubjects.map((subj, i) => (
                      <div 
                        key={i}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                          subj.status === 'exceeds' 
                            ? 'bg-green-50 dark:bg-green-950' 
                            : subj.status === 'meets' 
                            ? 'bg-blue-50 dark:bg-blue-950'
                            : 'bg-amber-50 dark:bg-amber-950'
                        }`}
                      >
                        {subj.status === 'exceeds' ? (
                          <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : subj.status === 'meets' ? (
                          <Minus className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-amber-600 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate">{subj.subject.split('/')[0]}</p>
                          <p className="text-xs text-muted-foreground">
                            {subj.grade} / {subj.required}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Apply Priority Action */}
            {sortBy === 'strength' && (
              <div className="flex justify-center pt-4">
                <Button onClick={handleSortByStrength} variant="teal">
                  Apply Strength-Based Order as Priority
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyChoicesPage;
