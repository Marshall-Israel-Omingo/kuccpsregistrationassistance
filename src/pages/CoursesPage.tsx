import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PrincipleCard from '@/components/courses/PrincipleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { principles } from '@/data/courses';

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrinciples = principles.filter(principle =>
    principle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    principle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Browse Courses | KUCCPS Registration Service</title>
        <meta
          name="description"
          content="Browse over 500+ university courses across 12 academic principles. Find the perfect program for your career goals."
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Header Banner */}
          <section className="gradient-coral py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Browse Courses
                </h1>
                <p className="text-primary-foreground/90 mb-8">
                  Explore our comprehensive catalog of university programs
                </p>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by field of study..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-12 h-12 text-base bg-card border-0 shadow-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Principles Grid */}
          <section className="py-12 bg-muted">
            <div className="container mx-auto px-4">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Academic Principles
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredPrinciples.length} categories found
                  </p>
                </div>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Grid */}
              {filteredPrinciples.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPrinciples.map((principle) => (
                    <PrincipleCard key={principle.id} principle={principle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No results found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CoursesPage;
