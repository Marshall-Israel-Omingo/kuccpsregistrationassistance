import { Link } from 'react-router-dom';
import { BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const ApplicationPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground">Application features coming soon</p>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Application System Coming Soon
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              We're working on bringing you a seamless application experience. 
              In the meantime, explore our course catalog to find programs that match your qualifications.
            </p>
            <Link to="/courses">
              <Button variant="teal">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationPage;
