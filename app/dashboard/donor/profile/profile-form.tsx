'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          organizationName,
          phone,
          address,
        }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Donor Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
