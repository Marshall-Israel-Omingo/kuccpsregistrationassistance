import { Shield, Search, BarChart3, Award, Sparkles, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Course Search',
    description: 'Find courses that match your KCSE grades and career interests with our intelligent search engine.',
  },
  {
    icon: BarChart3,
    title: 'Eligibility Checker',
    description: 'Instantly see which courses you qualify for based on your cluster points and subject grades.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Recommendations',
    description: 'Get course suggestions tailored to your qualifications and career aspirations.',
  },
  {
    icon: Award,
    title: 'Compare Programs',
    description: 'Compare courses across different universities to find the best fit for your goals.',
  },
  {
    icon: Shield,
    title: 'Verified Information',
    description: 'Access accurate, up-to-date course requirements and university details you can trust.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Browse courses and check eligibility anytime, anywhere from your smartphone or tablet.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Why CourseMatch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Choose Right
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've built the tools to help you make informed decisions about your higher education journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={feature.title}
                className="bg-card rounded-xl p-6 border border-border hover:border-secondary/30 transition-all duration-300 hover:shadow-lg group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
