import { Shield, Clock, HeadphonesIcon, Award, RefreshCw, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure & Confidential',
    description: 'Your personal data is encrypted and protected. We never share your information with third parties.',
  },
  {
    icon: Clock,
    title: '48-Hour Turnaround',
    description: 'We process your application within 48 hours of receiving your complete details and payment.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our dedicated support team is available round the clock to answer your questions.',
  },
  {
    icon: Award,
    title: 'Expert Guidance',
    description: 'Our KUCCPS specialists ensure your application is submitted correctly the first time.',
  },
  {
    icon: RefreshCw,
    title: 'Money-Back Guarantee',
    description: 'If we fail to process your application successfully, get a full refund. No questions asked.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Track your application status anytime, anywhere from your smartphone or tablet.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Benefits That Matter
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've helped thousands of students secure their university placements. 
            Here's why they trust us.
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
