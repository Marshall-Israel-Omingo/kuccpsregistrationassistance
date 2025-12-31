import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>KUCCPS Registration Service | Simplify Your University Application</title>
        <meta
          name="description"
          content="Simplify your KUCCPS university application with our expert service. Browse courses, check eligibility, and let us handle your registration for just KES 500."
        />
        <meta
          name="keywords"
          content="KUCCPS, university application, Kenya universities, course registration, higher education Kenya"
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <StatsSection />
          <HowItWorksSection />
          <FeaturesSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
