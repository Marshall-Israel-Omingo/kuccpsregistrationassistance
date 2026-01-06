import { useState } from 'react';
import { Search, SlidersHorizontal, X, Plus, Check, Building2, Clock } from 'lucide-react';
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
import { useApplication, useCourseSelections, useAddCourseSelection } from '@/hooks/useApplication';
import { courses, principles, Course } from '@/data/courses';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DashboardCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');
  const { data: profile } = useProfile();
  const { data: application } = useApplication();
  const { data: selections } = useCourseSelections(application?.id);
  const addCourseSelection = useAddCourseSelection();
  const { toast } = useToast();

  const userClusterPoints = profile?.cluster_points || 0;

  const isQualified = (course: Course) => {
    return userClusterPoints >= course.clusterPoints;
  };

  const isSelected = (courseId: string) => {
    return selections?.some((s) => s.course_id === courseId);
  };

  const getNextPriority = () => {
    if (!selections || selections.length === 0) return 1;
    return Math.max(...selections.map((s) => s.priority)) + 1;
  };

  const handleAddCourse = async (course: Course) => {
    if (!application) {
      toast({ title: 'Error', description: 'No application found', variant: 'destructive' });
      return;
    }

    if (selections && selections.length >= 4) {
      toast({ title: 'Maximum reached', description: 'You can only select up to 4 courses', variant: 'destructive' });
      return;
    }

    try {
      await addCourseSelection.mutateAsync({
        application_id: application.id,
        course_id: course.id,
        course_name: course.name,
        course_code: course.code,
        institution_name: course.institutions[0]?.name || null,
        cluster_points: course.clusterPoints,
        priority: getNextPriority(),
      });
      toast({ title: 'Course added!', description: `${course.name} added as Choice ${getNextPriority()}` });
    } catch (error: any) {
      if (error.message?.includes('unique')) {
        toast({ title: 'Already selected', description: 'This course is already in your choices', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: 'Failed to add course', variant: 'destructive' });
      }
    }
  };

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrinciple = selectedPrinciple === 'all' || course.principleId === selectedPrinciple;
      return matchesSearch && matchesPrinciple;
    })
    .sort((a, b) => {
      switch (sortBy) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Browse Courses</h1>
            <p className="text-muted-foreground">
              {selections?.length || 0} of 4 courses selected • Your points: {userClusterPoints || 'Not set'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses..."
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
              <SelectValue placeholder="All Principles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Principles</SelectItem>
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
                        {qualified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">
                            <Check className="h-3 w-3" />
                            Qualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
                            Not Qualified
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-secondary">{course.clusterPoints}</span> points
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
                      {selected ? (
                        <Button variant="outline" disabled className="text-secondary">
                          <Check className="mr-2 h-4 w-4" />
                          Selected
                        </Button>
                      ) : (
                        <Button
                          variant="teal"
                          onClick={() => handleAddCourse(course)}
                          disabled={!qualified || (selections && selections.length >= 4)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Choices
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
