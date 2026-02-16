'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateDonorProfile } from '@/lib/actions/auth';
import { Loader2, Save, MapPin, Navigation } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  verified: boolean;
  suspended: boolean;
}

interface DonorProfile {
  id: string;
  userId: string;
  organizationName: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface ProfileFormProps {
  user: User;
  donorProfile: DonorProfile;
}

export function ProfileForm({ user, donorProfile }: ProfileFormProps) {
  const [name, setName] = useState(user.name || '');
  const [organizationName, setOrganizationName] = useState(donorProfile.organizationName || '');
  const [phone, setPhone] = useState(donorProfile.phone || '');
  const [address, setAddress] = useState(donorProfile.address || '');
  const [latitude, setLatitude] = useState(donorProfile.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(donorProfile.longitude?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current location using GPS
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setLocationLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location. Please enter manually.');
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('organizationName', organizationName);
      formData.append('phone', phone);
      formData.append('address', address);
      
      // Add location if provided
      if (latitude) {
        formData.append('latitude', latitude);
      }
      if (longitude) {
        formData.append('longitude', longitude);
      }

      const result = await updateDonorProfile(formData);
      
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        // Update user name in the session by reloading
        window.location.reload();
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Donor Profile</CardTitle>
          <CardDescription>Manage your profile information and location</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                Profile updated successfully!
              </div>
            )}
            
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Your organization name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your address"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  title="Use current location"
                >
                  {locationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Click the navigation icon to get your current location
              </p>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
