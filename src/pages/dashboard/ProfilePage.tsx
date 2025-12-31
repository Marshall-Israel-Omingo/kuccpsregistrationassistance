import { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Hash, GraduationCap, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const meanGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
const counties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 'Machakos', 'Nyeri',
  'Meru', 'Kakamega', 'Bungoma', 'Embu', 'Kitui', 'Garissa', 'Turkana', 'Marsabit',
];

const ProfilePage = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    id_number: '',
    date_of_birth: '',
    county: '',
    index_number: '',
    mean_grade: '',
    cluster_points: '',
  });

  const handleEdit = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        id_number: profile.id_number || '',
        date_of_birth: profile.date_of_birth || '',
        county: profile.county || '',
        index_number: profile.index_number || '',
        mean_grade: profile.mean_grade || '',
        cluster_points: profile.cluster_points?.toString() || '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Convert empty strings to null for database compatibility
      const cleanedData = {
        full_name: formData.full_name || null,
        phone: formData.phone || null,
        id_number: formData.id_number || null,
        date_of_birth: formData.date_of_birth || null,
        county: formData.county || null,
        index_number: formData.index_number || null,
        mean_grade: formData.mean_grade || null,
        cluster_points: formData.cluster_points ? parseInt(formData.cluster_points) : null,
      };
      
      await updateProfile.mutateAsync(cleanedData);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
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
                <AvatarImage src={profile?.avatar_url || undefined} />
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
                <Label>ID Number</Label>
                {isEditing ? (
                  <Input
                    value={formData.id_number}
                    onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    placeholder="Enter ID number"
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile?.id_number || '-'}</p>
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
                <Label>Date of Birth</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground font-medium">{profile?.date_of_birth || '-'}</p>
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
                      {counties.map((county) => (
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

          {/* KCSE Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-secondary" />
                KCSE Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Index Number</Label>
                {isEditing ? (
                  <Input
                    value={formData.index_number}
                    onChange={(e) => setFormData({ ...formData, index_number: e.target.value })}
                    placeholder="e.g., 12345678/2024"
                  />
                ) : (
                  <p className="text-2xl font-bold text-secondary">{profile?.index_number || '-'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mean Grade</Label>
                  {isEditing ? (
                    <Select
                      value={formData.mean_grade}
                      onValueChange={(value) => setFormData({ ...formData, mean_grade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {meanGrades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-bold">
                      {profile?.mean_grade || '-'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cluster Points</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.cluster_points}
                      onChange={(e) => setFormData({ ...formData, cluster_points: e.target.value })}
                      placeholder="Enter points"
                      min="0"
                      max="48"
                    />
                  ) : (
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold">
                      {profile?.cluster_points || '-'}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <Button variant="teal" className="w-full mt-4" onClick={handleSave} disabled={updateProfile.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
