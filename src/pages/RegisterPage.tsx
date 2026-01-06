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
  Plus,
  X,
  AlertCircle,
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { kcseSubjects, kcseGrades } from '@/data/subjects';
import { gradePoints, calculateMeanGrade, validateSubjects, SubjectGrade } from '@/lib/gradeCalculations';
import { supabase } from '@/integrations/supabase/client';

const steps = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Index Numbers' },
  { id: 3, title: 'KCSE Grades' },
];

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    kcseIndexNumber: '',
    kcpeIndexNumber: '',
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [subjects, setSubjects] = useState<SubjectGrade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addSubject = () => {
    if (!selectedSubject || !selectedGrade) {
      toast({
        title: 'Selection Required',
        description: 'Please select both subject and grade',
        variant: 'destructive',
      });
      return;
    }

    if (subjects.some(s => s.subject === selectedSubject)) {
      toast({
        title: 'Duplicate Subject',
        description: 'This subject has already been added',
        variant: 'destructive',
      });
      return;
    }

    setSubjects([...subjects, { subject: selectedSubject, grade: selectedGrade }]);
    setSelectedSubject('');
    setSelectedGrade('');
    setErrors((prev) => ({ ...prev, subjects: '' }));
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^(07|01)\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Invalid phone format (07XXXXXXXX or 01XXXXXXXX)';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (step === 2) {
      if (!formData.kcseIndexNumber.trim()) newErrors.kcseIndexNumber = 'KCSE Index Number is required';
      if (!formData.kcpeIndexNumber.trim()) newErrors.kcpeIndexNumber = 'KCPE Index Number is required';
    }

    if (step === 3) {
      const validation = validateSubjects(subjects);
      if (!validation.isValid) {
        newErrors.subjects = validation.error || 'Invalid subjects';
      }
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
      if (!formData.agreePrivacy) newErrors.agreePrivacy = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsLoading(true);

    // Calculate mean grade and total points
    const { meanGrade, totalPoints } = calculateMeanGrade(subjects);

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      phone: formData.phone,
      index_number: formData.kcseIndexNumber,
      kcpe_index_number: formData.kcpeIndexNumber,
      mean_grade: meanGrade,
      cluster_points: totalPoints.toString(),
    });

    if (error) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Get the newly created user and insert subject grades
    const { data: { user: newUser } } = await supabase.auth.getUser();
    
    if (newUser && subjects.length > 0) {
      const subjectGradesData = subjects.map(s => ({
        user_id: newUser.id,
        subject: s.subject,
        grade: s.grade,
        points: gradePoints[s.grade] || 0,
      }));

      await supabase.from('subject_grades').insert(subjectGradesData);
    }

    toast({
      title: 'Account Created!',
      description: 'Welcome to CourseMatch!',
    });
    navigate('/dashboard');
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
  const { meanGrade, totalPoints } = calculateMeanGrade(subjects);

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
        <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
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
              {/* Step 1: Personal Information */}
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
                        className={cn('pl-10', errors.fullName && 'border-destructive')}
                      />
                    </div>
                    {errors.fullName && <p className="text-destructive text-sm">{errors.fullName}</p>}
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
                        className={cn('pl-10', errors.email && 'border-destructive')}
                      />
                    </div>
                    {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
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
                        className={cn('pl-10', errors.phone && 'border-destructive')}
                      />
                    </div>
                    {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
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
                        className={cn('pl-10 pr-10', errors.password && 'border-destructive')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
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

              {/* Step 2: Index Numbers */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="kcseIndexNumber">KCSE Index Number</Label>
                    <Input
                      id="kcseIndexNumber"
                      type="text"
                      placeholder="e.g., 12345678/2024"
                      value={formData.kcseIndexNumber}
                      onChange={(e) => updateFormData('kcseIndexNumber', e.target.value)}
                      className={cn(errors.kcseIndexNumber && 'border-destructive')}
                    />
                    {errors.kcseIndexNumber && <p className="text-destructive text-sm">{errors.kcseIndexNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kcpeIndexNumber">KCPE Index Number</Label>
                    <Input
                      id="kcpeIndexNumber"
                      type="text"
                      placeholder="e.g., 12345678"
                      value={formData.kcpeIndexNumber}
                      onChange={(e) => updateFormData('kcpeIndexNumber', e.target.value)}
                      className={cn(errors.kcpeIndexNumber && 'border-destructive')}
                    />
                    {errors.kcpeIndexNumber && <p className="text-destructive text-sm">{errors.kcpeIndexNumber}</p>}
                  </div>
                </>
              )}

              {/* Step 3: KCSE Subject Grades */}
              {currentStep === 3 && (
                <>
                  <Alert className="bg-secondary/10 border-secondary">
                    <AlertCircle className="h-4 w-4 text-secondary" />
                    <AlertDescription className="text-secondary">
                      Add minimum 8 subjects including English/Kiswahili and Mathematics
                    </AlertDescription>
                  </Alert>

                  {/* Subject Entry */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <Label>Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {kcseSubjects
                            .filter(s => !subjects.some(sub => sub.subject === s))
                            .map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Grade</Label>
                      <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {kcseGrades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button type="button" onClick={addSubject} className="w-full" variant="coral">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>

                  {errors.subjects && <p className="text-destructive text-sm">{errors.subjects}</p>}

                  {/* Added Subjects List */}
                  {subjects.length > 0 && (
                    <div className="space-y-2">
                      <Label>Added Subjects ({subjects.length})</Label>
                      <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
                        {subjects.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.subject}</span>
                              <span className="text-secondary font-bold">{item.grade}</span>
                              <span className="text-xs text-muted-foreground">({gradePoints[item.grade]} pts)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSubject(index)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calculated Results */}
                  {subjects.length >= 7 && (
                    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 border-2 border-secondary/30 rounded-lg p-4">
                      <h3 className="font-bold text-foreground mb-3">Calculated Results</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background p-3 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground mb-1">Mean Grade</p>
                          <p className="text-2xl font-bold text-secondary">{meanGrade}</p>
                        </div>
                        <div className="bg-background p-3 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground mb-1">Total Points</p>
                          <p className="text-2xl font-bold text-primary">{totalPoints}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        * Based on best Language + Mathematics + Best 5 other subjects
                      </p>
                    </div>
                  )}

                  {/* Terms & Privacy */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => updateFormData('agreeTerms', checked as boolean)}
                      />
                      <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                        I agree to the{' '}
                        <Link to="/terms" className="text-secondary hover:underline">
                          Terms of Service
                        </Link>
                      </Label>
                    </div>
                    {errors.agreeTerms && <p className="text-destructive text-sm">{errors.agreeTerms}</p>}

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onCheckedChange={(checked) => updateFormData('agreePrivacy', checked as boolean)}
                      />
                      <Label htmlFor="agreePrivacy" className="text-sm cursor-pointer">
                        I agree to the{' '}
                        <Link to="/privacy" className="text-secondary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.agreePrivacy && <p className="text-destructive text-sm">{errors.agreePrivacy}</p>}
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? 'invisible' : ''}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNext} variant="coral">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" variant="teal" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    <Check className="ml-2 h-4 w-4" />
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
