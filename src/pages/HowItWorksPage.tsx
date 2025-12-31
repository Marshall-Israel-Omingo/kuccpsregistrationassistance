import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Search,
  CreditCard,
  FileText,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
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
    icon: Search,
    number: '01',
    title: 'Browse & Select Courses',
    description:
      'Explore our comprehensive course catalog with over 500+ programs across 42 universities and 272 public colleges. Use our smart filters to find courses that match your qualifications.',
    details: [
      'Search by course name, institution, or field of study',
      'Filter by cluster points and mean grade requirements',
      'View eligibility status instantly when logged in',
      'Compare programs across different institutions',
    ],
  },
  {
    icon: CreditCard,
    number: '02',
    title: 'Pay for Our Service',
    description:
      'Secure your application with our affordable KES 500 service fee via M-Pesa. This one-time payment covers your complete KUCCPS registration process.',
    details: [
      'Convenient M-Pesa payment option',
      'Instant payment confirmation',
      'Money-back guarantee if registration fails',
      'Receipt sent to your email',
    ],
  },
  {
    icon: FileText,
    number: '03',
    title: 'Submit Your Details',
    description:
      'Provide your KCSE results, personal information, and up to 4 course choices. Our system validates your eligibility in real-time.',
    details: [
      'Easy step-by-step form submission',
      'Real-time eligibility validation',
      'Upload supporting documents securely',
      'Review and confirm before submission',
    ],
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'We Register You',
    description:
      'Sit back and relax while our KUCCPS experts handle your registration. We submit your application and send you confirmation within 48 hours.',
    details: [
      'Expert KUCCPS specialists process your application',
      'Error-free submission guaranteed',
      '48-hour turnaround time',
      'Email and SMS confirmation sent',
    ],
  },
];

const faqs = [
  {
    question: 'How much does your service cost?',
    answer:
      'Our service fee is KES 500 per application. This covers the complete KUCCPS registration process, including expert verification, submission, and confirmation.',
  },
  {
    question: 'How long does the registration process take?',
    answer:
      'Once you submit your details and payment, we process your KUCCPS registration within 48 hours. You will receive email and SMS confirmation once complete.',
  },
  {
    question: 'What if my registration fails?',
    answer:
      'We offer a full money-back guarantee. If we are unable to complete your KUCCPS registration for any reason attributable to our service, you will receive a complete refund.',
  },
  {
    question: 'Can I choose more than one course?',
    answer:
      'Yes! Following KUCCPS guidelines, you can select up to 4 course choices in order of preference. We will register all your choices as submitted.',
  },
  {
    question: 'What documents do I need to provide?',
    answer:
      'You will need to provide your KCSE result slip, a copy of your national ID, and fill in your personal details including contact information and subject grades.',
  },
  {
    question: 'Is my personal information secure?',
    answer:
      'Absolutely. We use bank-level encryption to protect all your data. Your information is only used for the KUCCPS registration process and is never shared with third parties.',
  },
];

const HowItWorksPage = () => {
  return (
    <>
      <Helmet>
        <title>How It Works | KUCCPS Registration Service</title>
        <meta
          name="description"
          content="Learn how our KUCCPS registration service works in 4 simple steps. Browse courses, pay, submit details, and we handle your registration."
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-coral py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                How It Works
              </h1>
              <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
                Get your KUCCPS registration done in 4 simple steps. We've streamlined the
                process so you can focus on your future.
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
                              <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
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

          {/* Pricing Section */}
          <section className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
                  Simple Pricing
                </span>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  One Price. Everything Included.
                </h2>
                <p className="text-muted-foreground mb-8">
                  No hidden fees, no surprises. Pay once and we handle everything.
                </p>

                <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
                  <div className="text-5xl font-bold text-secondary mb-2">KES 500</div>
                  <div className="text-muted-foreground mb-6">One-time service fee</div>

                  <div className="space-y-3 text-left mb-8">
                    {[
                      'Complete KUCCPS registration',
                      'Up to 4 course choices',
                      '48-hour processing',
                      'Email & SMS confirmation',
                      'Expert verification',
                      'Money-back guarantee',
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/register">
                    <Button variant="teal" size="lg" className="w-full">
                      Get Started Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-card">
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
                      className="bg-muted rounded-lg border-none px-6"
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
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                Join thousands of students who have successfully registered through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button variant="hero" size="lg">
                    Start Your Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="hero-outline" size="lg">
                    Browse Courses
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
