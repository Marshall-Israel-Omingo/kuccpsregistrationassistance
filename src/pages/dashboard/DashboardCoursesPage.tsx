import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Check, Building2, Clock, ArrowRight } from 'lucide-react';
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
import { courses, principles, Course } from '@/data/courses';
import { cn } from '@/lib/utils';

const DashboardCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');
  const { data: profile } = useProfile();

  const userPoints = profile?.aggregate_points || 0;

  const isQualified = (course: Course) => {
    return userPoints >= course.clusterPoints;
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
              Your points: {userPoints || 'Not set'} • Find courses that match your qualifications
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

            return (
              <Card
                key={course.id}
                className={cn(
                  'transition-all hover:shadow-md',
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
                        <Button variant="outline">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
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
