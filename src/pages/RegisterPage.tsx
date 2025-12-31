import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'KCSE Details' },
  { id: 3, title: 'Confirmation' },
];

const meanGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    indexNumber: '',
    meanGrade: '',
    clusterPoints: '',
    addSubjectsLater: false,
    agreeTerms: false,
    agreePrivacy: false,
  });
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      phone: formData.phone,
      index_number: formData.indexNumber,
      mean_grade: formData.meanGrade,
      cluster_points: formData.clusterPoints,
    });

    if (error) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created!',
        description: 'Welcome to KUCCPS Registration Service.',
      });
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-destructive' };
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-warning' };
    if (password.length < 10) return { strength: 75, label: 'Good', color: 'bg-secondary' };
    return { strength: 100, label: 'Strong', color: 'bg-success' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <Helmet>
        <title>Create Account | KUCCPS Registration Service</title>
        <meta
          name="description"
          content="Create your KUCCPS account to start your university application journey."
        />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Panel - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 gradient-coral relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 flex flex-col justify-center p-12">
            <Link to="/" className="flex items-center gap-3 mb-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">KUCCPS</span>
            </Link>

            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              Start Your Journey
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-md">
              Create an account to access our comprehensive course catalog and streamlined
              application process.
            </p>

            <div className="space-y-4">
              {[
                'Browse 500+ university courses',
                'Check eligibility instantly',
                'Track application progress',
                'Get expert support',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-primary-foreground/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-lg">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">KUCCPS</span>
              </Link>
            </div>

            <div className="text-center lg:text-left mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                        currentStep >= step.id
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                    </div>
                    <span
                      className={cn(
                        'text-xs mt-1 hidden sm:block',
                        currentStep >= step.id ? 'text-secondary' : 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-12 sm:w-24 h-1 mx-2 rounded-full',
                        currentStep > step.id ? 'bg-secondary' : 'bg-muted'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g., 0712345678"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn('h-full transition-all', passwordStrength.color)}
                              style={{ width: `${passwordStrength.strength}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: KCSE Details */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="indexNumber">KCSE Index Number</Label>
                    <Input
                      id="indexNumber"
                      type="text"
                      placeholder="e.g., 12345678/2024"
                      value={formData.indexNumber}
                      onChange={(e) => updateFormData('indexNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meanGrade">Mean Grade</Label>
                    <Select
                      value={formData.meanGrade}
                      onValueChange={(value) => updateFormData('meanGrade', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your mean grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {meanGrades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clusterPoints">Cluster Points</Label>
                    <Input
                      id="clusterPoints"
                      type="number"
                      placeholder="Enter your cluster points"
                      value={formData.clusterPoints}
                      onChange={(e) => updateFormData('clusterPoints', e.target.value)}
                      min="0"
                      max="48"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="addSubjectsLater"
                      checked={formData.addSubjectsLater}
                      onCheckedChange={(checked) =>
                        updateFormData('addSubjectsLater', checked as boolean)
                      }
                    />
                    <Label htmlFor="addSubjectsLater" className="text-sm cursor-pointer">
                      I'll add my subject grades later
                    </Label>
                  </div>
                </>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <>
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-foreground">Review Your Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium text-foreground">{formData.fullName || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium text-foreground">{formData.email || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="font-medium text-foreground">{formData.phone || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Index Number:</span>
                        <p className="font-medium text-foreground">{formData.indexNumber || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mean Grade:</span>
                        <p className="font-medium text-foreground">{formData.meanGrade || '-'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cluster Points:</span>
                        <p className="font-medium text-foreground">
                          {formData.clusterPoints || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) =>
                          updateFormData('agreeTerms', checked as boolean)
                        }
                      />
                      <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                        I agree to the{' '}
                        <Link to="/terms" className="text-secondary hover:underline">
                          Terms of Service
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onCheckedChange={(checked) =>
                          updateFormData('agreePrivacy', checked as boolean)
                        }
                      />
                      <Label htmlFor="agreePrivacy" className="text-sm cursor-pointer">
                        I agree to the{' '}
                        <Link to="/privacy" className="text-secondary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                {currentStep < steps.length ? (
                  <Button type="button" variant="teal" onClick={handleNext} className="flex-1">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="teal"
                    className="flex-1"
                    disabled={!formData.agreeTerms || !formData.agreePrivacy || isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
