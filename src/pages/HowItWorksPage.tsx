import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Search,
  BarChart3,
  BookmarkCheck,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const steps = [
  {
    icon: ClipboardCheck,
    number: '01',
    title: 'Enter Your KCSE Grades',
    description:
      'Input your subject grades and we\'ll calculate your cluster points automatically. This helps us determine which courses you qualify for.',
    details: [
      'Enter all your KCSE subjects and grades',
      'Cluster points calculated automatically',
      'Mean grade computed in real-time',
      'Supports all 31 KCSE subjects',
    ],
  },
  {
    icon: Search,
    number: '02',
    title: 'Browse & Search Courses',
    description:
      'Explore our comprehensive course catalog with over 500+ programs across 42 universities and 272 public colleges.',
    details: [
      'Search by course name, institution, or field of study',
      'Filter by cluster points and grade requirements',
      'View detailed course information',
      'Discover courses you didn\'t know existed',
    ],
  },
  {
    icon: BarChart3,
    number: '03',
    title: 'Check Your Eligibility',
    description:
      'Instantly see which courses you qualify for based on your grades. No more guessing—know exactly where you stand.',
    details: [
      'Real-time eligibility checking',
      'See matching subject requirements',
      'Understand minimum cut-off points',
      'Get personalized recommendations',
    ],
  },
  {
    icon: BookmarkCheck,
    number: '04',
    title: 'Shortlist & Compare',
    description:
      'Save courses you\'re interested in to your shortlist. Compare programs side by side to make informed decisions.',
    details: [
      'Create and manage your course shortlist',
      'Compare up to 4 courses at once',
      'Export your selections',
      'Share with parents or advisors',
    ],
  },
];

const faqs = [
  {
    question: 'Is CourseMatch free to use?',
    answer:
      'Yes! CourseMatch is completely free to browse courses and check your eligibility. Create an account to save your shortlist and get personalized recommendations.',
  },
  {
    question: 'How accurate is the eligibility checker?',
    answer:
      'Our eligibility data is sourced from official university requirements and updated regularly. However, we recommend verifying with the specific institution before making final decisions.',
  },
  {
    question: 'Do you handle university applications?',
    answer:
      'CourseMatch is a course discovery platform. We help you find and compare courses, but the actual application process is handled through KUCCPS or directly with institutions.',
  },
  {
    question: 'How many courses are available on CourseMatch?',
    answer:
      'We have over 500 courses from 42 universities and 272 public colleges across Kenya. We\'re constantly adding new programs to our database.',
  },
  {
    question: 'Can I save courses I\'m interested in?',
    answer:
      'Yes! Create a free account to access your personal shortlist where you can save, organize, and compare courses you\'re considering.',
  },
  {
    question: 'How do cluster points work?',
    answer:
      'Cluster points are calculated based on your performance in specific subject combinations relevant to your desired course. Different courses require different subject clusters.',
  },
];

const HowItWorksPage = () => {
  return (
    <>
      <Helmet>
        <title>How It Works | CourseMatch - Find Your Perfect Course</title>
        <meta
          name="description"
          content="Learn how CourseMatch helps you discover the perfect university course. Enter your grades, browse courses, check eligibility, and compare programs."
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-coral py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                How CourseMatch Works
              </h1>
              <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
                Finding your perfect course is easy. Just follow these four simple steps 
                to discover programs that match your qualifications and goals.
              </p>
            </div>
          </section>

          {/* Steps Section */}
          <section className="py-20 bg-card">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto space-y-16">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isEven = index % 2 === 0;

                  return (
                    <div
                      key={step.number}
                      className={`flex flex-col md:flex-row gap-8 items-center ${
                        !isEven ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div
                            className={`w-32 h-32 rounded-2xl flex items-center justify-center ${
                              isEven ? 'gradient-coral' : 'gradient-teal'
                            }`}
                          >
                            <Icon className="h-16 w-16 text-primary-foreground" />
                          </div>
                          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-nav text-nav-foreground flex items-center justify-center font-bold text-lg">
                            {step.number}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                              <span className="text-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                    FAQ
                  </span>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground">
                    Got questions? We've got answers.
                  </p>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-card rounded-lg border-none px-6"
                    >
                      <AccordionTrigger className="text-left text-foreground hover:text-secondary hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          {faq.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 pl-8">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 gradient-coral">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ready to Find Your Perfect Course?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                Start exploring over 500 courses from universities and colleges across Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/courses">
                  <Button variant="hero" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero-outline" size="lg">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HowItWorksPage;
