import { Search, ClipboardCheck, BarChart3, BookmarkCheck } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Enter Your Grades',
    description: 'Input your KCSE subject grades and we\'ll calculate your cluster points automatically.',
    color: 'primary',
  },
  {
    icon: Search,
    title: 'Browse Courses',
    description: 'Explore our comprehensive catalog of 500+ courses from universities and colleges across Kenya.',
    color: 'secondary',
  },
  {
    icon: BarChart3,
    title: 'Check Eligibility',
    description: 'See which courses you qualify for based on your grades and subject requirements.',
    color: 'primary',
  },
  {
    icon: BookmarkCheck,
    title: 'Shortlist & Compare',
    description: 'Save your favorite courses to your shortlist and compare them side by side.',
    color: 'secondary',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Finding your perfect course is easy with CourseMatch. 
            Just follow these four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isPrimary = step.color === 'primary';
            
            return (
              <div
                key={step.title}
                className="relative group"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-border" />
                )}
                
                <div className="relative bg-card rounded-2xl p-6 border border-border hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground border-2 border-card">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    isPrimary ? 'gradient-coral' : 'gradient-teal'
                  }`}>
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
