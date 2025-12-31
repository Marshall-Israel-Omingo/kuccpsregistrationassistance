import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPrincipleById, getCoursesByPrinciple } from '@/data/courses';

const PrinciplePage = () => {
  const { principleId } = useParams<{ principleId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const principle = getPrincipleById(principleId || '');
  const courses = getCoursesByPrinciple(principleId || '');

  if (!principle) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Principle not found
            </h1>
            <Link to="/courses">
              <Button variant="teal">Back to Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredCourses = courses
    .filter(course =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'points-high':
          return b.clusterPoints - a.clusterPoints;
        case 'points-low':
          return a.clusterPoints - b.clusterPoints;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <>
      <Helmet>
        <title>{principle.name} Courses | KUCCPS Registration Service</title>
        <meta
          name="description"
          content={`Explore ${courses.length} ${principle.name} courses. ${principle.description}`}
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Header Banner */}
          <section className="gradient-coral py-12">
            <div className="container mx-auto px-4">
              <Link
                to="/courses"
                className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to All Courses
              </Link>

              <div className="flex items-start gap-4">
                <div className="text-5xl">{principle.icon}</div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                    {principle.name}
                  </h1>
                  <p className="text-primary-foreground/90 mb-4">
                    {principle.description}
                  </p>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground text-secondary text-sm font-semibold">
                    {courses.length} courses available
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="sticky top-16 z-40 bg-card border-b border-border py-4">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="points-high">Points (High to Low)</SelectItem>
                      <SelectItem value="points-low">Points (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Courses Grid */}
          <section className="py-12 bg-muted">
            <div className="container mx-auto px-4">
              {/* Results count */}
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>

              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No courses found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrinciplePage;
