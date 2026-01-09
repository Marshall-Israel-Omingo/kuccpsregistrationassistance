import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 gradient-coral rounded-3xl opacity-10 blur-3xl" />
            
            <div className="relative gradient-coral rounded-3xl p-12 md:p-16 overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm mb-6">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                  <span className="text-primary-foreground text-sm font-medium">
                    Free to Use
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to Find Your Dream Course?
                </h2>
                <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of students who have discovered their perfect career path with CourseMatch. 
                  Start exploring today!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/courses">
                    <Button variant="hero" size="xl">
                      <Search className="mr-2 h-5 w-5" />
                      Browse Courses
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="hero-outline" size="xl">
                      Create Free Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <p className="text-primary-foreground/70 text-sm mt-6">
                  ✓ 500+ Courses • ✓ 42 Universities • ✓ Free to Browse
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
