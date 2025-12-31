import { Link } from 'react-router-dom';
import { Building2, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border hover:border-secondary/30 transition-all duration-300 hover:shadow-lg overflow-hidden group">
      {/* Header with gradient */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-secondary transition-colors">
            {course.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
            {course.clusterPoints} Points
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            Grade {course.meanGrade}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {course.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-secondary" />
            {course.institutions.length} {course.institutions.length === 1 ? 'Institution' : 'Institutions'}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-secondary" />
            {course.mode}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-muted/50 border-t border-border">
        <Link to={`/courses/${course.id}`}>
          <Button variant="teal" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
