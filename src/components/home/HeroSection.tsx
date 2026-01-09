import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Search, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const features = [
    'Personalized course recommendations',
    'Check eligibility instantly',
    'Compare programs side by side',
  ];

  return (
    <section className="relative overflow-hidden gradient-coral">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm mb-6 animate-fade-in-up">
            <Compass className="h-4 w-4 text-primary-foreground" />
            <span className="text-primary-foreground text-sm font-medium">
              500+ Courses Available
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-6 animate-fade-in-up animation-delay-100 leading-tight">
            Find Your Perfect University Course
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
            Discover courses that match your qualifications and career goals. Browse programs from top Kenyan universities and colleges.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-300">
            <Link to="/courses">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Explore Courses
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up animation-delay-400">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-foreground" />
                <span className="text-primary-foreground/90 text-sm font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z"
            className="fill-muted"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
