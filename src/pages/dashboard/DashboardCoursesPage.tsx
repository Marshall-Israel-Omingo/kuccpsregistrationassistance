import { useState } from 'react';
import { Search, SlidersHorizontal, X, Plus, Check, Building2, Clock, Star, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { usePlatformAccess, usePrimaryShortlist, useShortlistCourses, useAddToShortlist } from '@/hooks/useApplication';
import { courses, principles, Course } from '@/data/courses';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const DashboardCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('all');
  const [sortBy, setSortBy] = useState('fit');
  const { data: profile } = useProfile();
  const { data: platformAccess } = usePlatformAccess();
  const { data: primaryShortlist } = usePrimaryShortlist();
  const { data: shortlistCourses } = useShortlistCourses(primaryShortlist?.id);
  const addToShortlist = useAddToShortlist();
  const { toast } = useToast();

  const hasPaidAccess = platformAccess?.status === 'paid';
  const userPoints = profile?.aggregate_points || 0;

  // Calculate fit score based on user's points vs course requirements
  const calculateFitScore = (course: Course): number => {
    if (!userPoints) return 50;
    const diff = userPoints - course.clusterPoints;
    if (diff >= 10) return 95;
    if (diff >= 5) return 85;
    if (diff >= 0) return 75;
    if (diff >= -3) return 55;
    return 30;
  };

  const isQualified = (course: Course) => {
    return userPoints >= course.clusterPoints;
  };

  const isSelected = (courseId: string) => {
    return shortlistCourses?.some((s) => s.course_id === courseId);
  };

  const getNextPriority = () => {
    if (!shortlistCourses || shortlistCourses.length === 0) return 1;
    return Math.max(...shortlistCourses.map((s) => s.priority)) + 1;
  };

  const handleAddCourse = async (course: Course) => {
    if (!primaryShortlist) {
      toast({ title: 'Error', description: 'No shortlist found', variant: 'destructive' });
      return;
    }

    if (!hasPaidAccess) {
      toast({ title: 'Upgrade Required', description: 'Pay 50 KES to add courses to your shortlist', variant: 'destructive' });
      return;
    }

    if (shortlistCourses && shortlistCourses.length >= 10) {
      toast({ title: 'Maximum reached', description: 'You can shortlist up to 10 courses', variant: 'destructive' });
      return;
    }

    try {
      const fitScore = calculateFitScore(course);
      await addToShortlist.mutateAsync({
        shortlist_id: primaryShortlist.id,
        course_id: course.id,
        course_name: course.name,
        course_code: course.code,
        institution_name: course.institutions[0]?.name || null,
        institution_id: course.institutions[0]?.id || null,
        priority: getNextPriority(),
        notes: null,
        fit_score: fitScore,
      });
      toast({ title: 'Added to shortlist!', description: `${course.name} added as Choice ${getNextPriority()}` });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to add course', variant: 'destructive' });
    }
  };

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrinciple = selectedPrinciple === 'all' || course.principleId === selectedPrinciple;
      return matchesSearch && matchesPrinciple;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'fit':
          return calculateFitScore(b) - calculateFitScore(a);
        case 'points-high':
          return b.clusterPoints - a.clusterPoints;
        case 'points-low':
          return a.clusterPoints - b.clusterPoints;
        case 'qualified':
          return (isQualified(b) ? 1 : 0) - (isQualified(a) ? 1 : 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20 lg:pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Browse Courses</h1>
            <p className="text-muted-foreground">
              {shortlistCourses?.length || 0} courses shortlisted • Your points: {userPoints || 'Not set'}
            </p>
          </div>
          {!hasPaidAccess && (
            <Link to="/dashboard/payments">
              <Button variant="teal">
                <Lock className="mr-2 h-4 w-4" />
                Unlock Full Access - 50 KES
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses by name, code, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {principles.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.icon} {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fit">Best Fit</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="points-high">Points (High to Low)</SelectItem>
              <SelectItem value="points-low">Points (Low to High)</SelectItem>
              <SelectItem value="qualified">Qualified First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        <div className="grid gap-4">
          {filteredCourses.map((course) => {
            const qualified = isQualified(course);
            const selected = isSelected(course.id);
            const fitScore = calculateFitScore(course);

            return (
              <Card
                key={course.id}
                className={cn(
                  'transition-all hover:shadow-md',
                  selected && 'border-secondary bg-secondary/5',
                  !qualified && 'opacity-70'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{course.name}</h3>
                        {hasPaidAccess && (
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                            fitScore >= 80 ? "bg-success/10 text-success" :
                            fitScore >= 60 ? "bg-secondary/10 text-secondary" :
                            "bg-warning/10 text-warning"
                          )}>
                            <Star className="h-3 w-3" />
                            {fitScore}% fit
                          </span>
                        )}
                        {qualified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">
                            <Check className="h-3 w-3" />
                            Qualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
                            Need {course.clusterPoints - userPoints} more points
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-secondary">{course.clusterPoints}</span> points required
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {course.institutions.length} institutions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                      {selected ? (
                        <Button variant="outline" disabled className="text-secondary">
                          <Check className="mr-2 h-4 w-4" />
                          Shortlisted
                        </Button>
                      ) : (
                        <Button
                          variant="teal"
                          onClick={() => handleAddCourse(course)}
                          disabled={!hasPaidAccess || (shortlistCourses && shortlistCourses.length >= 10)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Shortlist
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardCoursesPage;
