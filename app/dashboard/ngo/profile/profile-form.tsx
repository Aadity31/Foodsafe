'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateNgoProfile } from '@/lib/actions/ngo';
import { Loader2, Save, MapPin, Navigation } from 'lucide-react';

interface NgoProfile {
  id: string;
  ngoName: string;
  registrationNumber: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number;
  approvalStatus: string;
}

interface ProfileFormProps {
  ngoProfile: NgoProfile;
}

export function ProfileForm({ ngoProfile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ngoName: ngoProfile.ngoName,
    registrationNumber: ngoProfile.registrationNumber || '',
    phone: ngoProfile.phone || '',
    address: ngoProfile.address || '',
    latitude: ngoProfile.latitude?.toString() || '',
    longitude: ngoProfile.longitude?.toString() || '',
    serviceRadiusKm: ngoProfile.serviceRadiusKm.toString(),
  });

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
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
        setLocationLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location. Please enter manually.');
        setLocationLoading(false);
      }
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const form = new FormData();
      form.append('ngoName', formData.ngoName);
      form.append('registrationNumber', formData.registrationNumber);
      form.append('phone', formData.phone);
      form.append('address', formData.address);
      if (formData.latitude) form.append('latitude', formData.latitude);
      if (formData.longitude) form.append('longitude', formData.longitude);
      if (formData.serviceRadiusKm) form.append('serviceRadiusKm', formData.serviceRadiusKm);

      const result = await updateNgoProfile(form);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your NGO information and service area
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>NGO Information</CardTitle>
            <CardDescription>
              Your profile information is visible to donors and used for matching requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  Profile updated successfully!
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ngoName">NGO Name *</Label>
                  <Input
                    id="ngoName"
                    value={formData.ngoName}
                    onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
                    placeholder="Enter your NGO name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Enter registration number"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location & Service Area
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="e.g., 28.6139"
                    />
                  </div>

                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="e.g., 77.2090"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceRadiusKm">Service Radius (km)</Label>
                    <Input
                      id="serviceRadiusKm"
                      type="number"
                      step="1"
                      min="1"
                      max="100"
                      value={formData.serviceRadiusKm}
                      onChange={(e) => setFormData({ ...formData, serviceRadiusKm: e.target.value })}
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="flex items-center gap-2"
                  >
                    {locationLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    {locationLoading ? 'Getting location...' : 'Use My Current Location (GPS)'}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  Enter your NGO's coordinates to enable location-based request matching. 
                  The service radius determines how far you're willing to travel to pick up donations.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
