import { useState, useEffect } from 'react';
import { User, GraduationCap, Save, Plus, X, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProfile, useUpdateProfile, useSubjectGrades, useUpdateSubjectGrades } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { kcseSubjects, kcseGrades, kenyanCounties } from '@/data/subjects';
import { gradePoints, calculateMeanGrade, SubjectGrade } from '@/lib/gradeCalculations';

const ProfilePage = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: subjectGrades, isLoading: gradesLoading } = useSubjectGrades();
  const updateProfile = useUpdateProfile();
  const updateSubjectGrades = useUpdateSubjectGrades();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    county: '',
    secondary_school: '',
    year_of_completion: '',
  });
  const [editableGrades, setEditableGrades] = useState<SubjectGrade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  useEffect(() => {
    if (subjectGrades) {
      setEditableGrades(subjectGrades.map(g => ({ subject: g.subject, grade: g.grade })));
    }
  }, [subjectGrades]);

  const handleEdit = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        county: profile.county || '',
        secondary_school: profile.secondary_school || '',
        year_of_completion: profile.year_of_completion?.toString() || '',
      });
    }
    if (subjectGrades) {
      setEditableGrades(subjectGrades.map(g => ({ subject: g.subject, grade: g.grade })));
    }
    setIsEditing(true);
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

    if (editableGrades.some(g => g.subject === selectedSubject)) {
      toast({
        title: 'Duplicate Subject',
        description: 'This subject has already been added',
        variant: 'destructive',
      });
      return;
    }

    setEditableGrades([...editableGrades, { subject: selectedSubject, grade: selectedGrade }]);
    setSelectedSubject('');
    setSelectedGrade('');
  };

  const removeSubject = (index: number) => {
    setEditableGrades(editableGrades.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      // Calculate new mean grade and points
      const { meanGrade, totalPoints } = calculateMeanGrade(editableGrades);

      // Update profile with calculated values
      const cleanedData: Record<string, unknown> = {
        full_name: formData.full_name || null,
        phone: formData.phone || null,
        county: formData.county || null,
        secondary_school: formData.secondary_school || null,
        year_of_completion: formData.year_of_completion ? parseInt(formData.year_of_completion) : null,
        mean_grade: meanGrade !== '-' ? meanGrade : null,
        aggregate_points: totalPoints > 0 ? totalPoints : null,
      };
      
      await updateProfile.mutateAsync(cleanedData);
      await updateSubjectGrades.mutateAsync(editableGrades);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile and subject grades have been updated successfully.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isLoading = profileLoading || gradesLoading;
  const displayGrades = isEditing ? editableGrades : (subjectGrades?.map(g => ({ subject: g.subject, grade: g.grade })) || []);
  const { meanGrade, totalPoints } = calculateMeanGrade(displayGrades);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>

        {/* Profile Header Card */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-secondary/20">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-foreground">{profile?.full_name || 'Student'}</h2>
                <p className="text-muted-foreground">{profile?.email}</p>
                {profile?.phone && (
                  <p className="text-muted-foreground text-sm mt-1">{profile.phone}</p>
                )}
              </div>
              <Button variant={isEditing ? 'outline' : 'coral'} onClick={() => (isEditing ? setIsEditing(false) : handleEdit())}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-secondary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                {isEditing ? (
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile?.full_name || '-'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-foreground font-medium">{profile?.email || '-'}</p>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile?.phone || '-'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>County</Label>
                {isEditing ? (
                  <Select
                    value={formData.county}
                    onValueChange={(value) => setFormData({ ...formData, county: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {kenyanCounties.map((county) => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-foreground font-medium">{profile?.county || '-'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <School className="h-5 w-5 text-secondary" />
                Education Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Secondary School</Label>
                {isEditing ? (
                  <Input
                    value={formData.secondary_school}
                    onChange={(e) => setFormData({ ...formData, secondary_school: e.target.value })}
                    placeholder="Enter school name"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile?.secondary_school || '-'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Year of Completion</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.year_of_completion}
                    onChange={(e) => setFormData({ ...formData, year_of_completion: e.target.value })}
                    placeholder="e.g., 2024"
                    min="2000"
                    max="2030"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile?.year_of_completion || '-'}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KCSE Results Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-secondary" />
              KCSE Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calculated Results Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mean Grade</Label>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-bold">
                  {meanGrade}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Total Points</Label>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold">
                  {totalPoints}
                </div>
              </div>
            </div>

            {/* Subject Grades Section */}
            <div className="space-y-3 pt-2">
              <Label className="text-base font-semibold">Subject Grades ({displayGrades.length})</Label>
              
              {isEditing && (
                <div className="grid grid-cols-3 gap-2">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {kcseSubjects
                        .filter(s => !editableGrades.some(g => g.subject === s))
                        .map((subject) => (
                          <SelectItem key={subject} value={subject} className="text-xs">
                            {subject}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="text-xs">
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
                  <Button type="button" size="sm" onClick={addSubject} variant="coral">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-lg p-3">
                {displayGrades.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4 col-span-2">No subject grades added</p>
                ) : (
                  displayGrades.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate max-w-[140px]">{item.subject}</span>
                        <span className="text-secondary font-bold">{item.grade}</span>
                        <span className="text-xs text-muted-foreground">({gradePoints[item.grade]} pts)</span>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                * Mean grade calculated from best Language + Math + 5 others
              </p>
            </div>

            {isEditing && (
              <Button variant="teal" className="w-full mt-4" onClick={handleSave} disabled={updateProfile.isPending || updateSubjectGrades.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateProfile.isPending || updateSubjectGrades.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
