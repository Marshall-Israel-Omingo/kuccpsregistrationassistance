import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Users, Award, Shield, ArrowRight, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const values = [
  {
    icon: Heart,
    title: 'Student-First Approach',
    description: 'Every feature we build puts students at the center. Your success is our success.',
  },
  {
    icon: Shield,
    title: 'Trusted Information',
    description: 'We provide accurate, verified course data you can rely on for your decisions.',
  },
  {
    icon: Award,
    title: 'Excellence in Service',
    description: 'We strive to deliver the best course browsing experience possible.',
  },
  {
    icon: Users,
    title: 'Inclusive Access',
    description: 'We make course discovery accessible to students from all backgrounds.',
  },
];

const stats = [
  { value: '500+', label: 'Courses Listed' },
  { value: '42', label: 'Universities' },
  { value: '272', label: 'Colleges' },
  { value: '10K+', label: 'Students Helped' },
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | CourseMatch - Find Your Perfect Course</title>
        <meta
          name="description"
          content="Learn about CourseMatch and our mission to help Kenyan students discover and explore university courses that match their qualifications."
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-coral py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                About CourseMatch
              </h1>
              <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
                Empowering Kenyan students to discover the right courses for their future 
                through smart matching and comprehensive course information.
              </p>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-20 bg-card">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
                      Our Story
                    </span>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      Making Course Discovery Simple
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      We started CourseMatch because we understood the challenges students face 
                      when trying to find the right university course. With hundreds of programs 
                      across dozens of institutions, it can be overwhelming.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Our platform brings together comprehensive course information, eligibility 
                      checking, and smart recommendations—all in one place. No more visiting 
                      multiple websites or guessing if you qualify.
                    </p>
                    <p className="text-muted-foreground">
                      Today, we've helped thousands of students explore courses and make 
                      informed decisions about their higher education journey.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="bg-muted rounded-2xl p-8">
                      <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                          <div
                            key={index}
                            className="bg-card rounded-xl p-4 text-center shadow-card"
                          >
                            <div className="text-2xl font-bold text-secondary">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl p-8 border-l-4 border-l-secondary">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To simplify course discovery for every Kenyan student by providing 
                    comprehensive, accurate, and personalized course information. We believe 
                    every student deserves to find a program that matches their qualifications 
                    and career aspirations.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-8 border-l-4 border-l-primary">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become Kenya's most trusted platform for course discovery, helping 
                    students navigate their educational journey with confidence. We envision 
                    a future where every student can easily find their perfect course match.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-20 bg-card">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                  Our Values
                </span>
                <h2 className="text-3xl font-bold text-foreground mb-4">What We Stand For</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  These core values guide everything we do and every decision we make.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="bg-muted rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                    >
                      <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-7 w-7 text-secondary" />
                      </div>
                      <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 gradient-coral">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Start Exploring Courses Today
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                Join thousands of students who have found their perfect course match with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/courses">
                  <Button variant="hero" size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="hero-outline" size="lg">
                    Contact Us
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

export default AboutPage;
