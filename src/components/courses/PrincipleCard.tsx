import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Principle } from '@/data/courses';

interface PrincipleCardProps {
  principle: Principle;
}

const PrincipleCard = ({ principle }: PrincipleCardProps) => {
  return (
    <Link
      to={`/courses/principle/${principle.id}`}
      className="group block bg-card rounded-xl p-6 border border-border hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Icon */}
      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
        {principle.icon}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
        {principle.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {principle.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
          {principle.courseCount} courses
        </span>
        <span className="flex items-center text-secondary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View Courses
          <ChevronRight className="h-4 w-4 ml-1" />
        </span>
      </div>
    </Link>
  );
};

export default PrincipleCard;
