'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createFoodRequest } from '@/lib/actions/food-request';

interface DonorProfile {
  id: string;
  organizationName: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface CreateRequestFormProps {
  donorProfile: DonorProfile;
}

export function CreateRequestForm({ donorProfile }: CreateRequestFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  // Form state
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [isVeg, setIsVeg] = useState('true');
  const [storageType, setStorageType] = useState('');
  const [latitude, setLatitude] = useState(donorProfile.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(donorProfile.longitude?.toString() || '');
  const [address, setAddress] = useState(donorProfile.address || '');

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setLocationLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location. Please enter manually.');
        setLocationLoading(false);
      }
    );
  };

  useEffect(() => {
    if (donorProfile.latitude && donorProfile.longitude) {
      setLatitude(donorProfile.latitude.toString());
      setLongitude(donorProfile.longitude.toString());
    }
  }, [donorProfile]);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await createFoodRequest(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/dashboard/donor/requests');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Food Request</h1>
        <p className="text-muted-foreground">
          Report surplus food to notify nearby NGOs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Food Details</CardTitle>
          <CardDescription>
            Provide information about the surplus food available for donation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Food Category *</Label>
                <Select name="category" value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COOKED_VEG">Cooked Vegetarian</SelectItem>
                    <SelectItem value="COOKED_NON_VEG">Cooked Non-Veg</SelectItem>
                    <SelectItem value="DRY_ITEMS">Dry Items</SelectItem>
                    <SelectItem value="PACKAGED">Packaged</SelectItem>
                    <SelectItem value="BAKED_GOODS">Baked Goods</SelectItem>
                    <SelectItem value="FRUITS_VEGETABLES">Fruits & Vegetables</SelectItem>
                    <SelectItem value="DAIRY">Dairy</SelectItem>
                    <SelectItem value="BEVERAGES">Beverages</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="category" value={category} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (servings) *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max="10000"
                  placeholder="e.g., 50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of the food items"
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Food Type *</Label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="isVeg" 
                      value="true" 
                      checked={isVeg === 'true'}
                      onChange={(e) => setIsVeg(e.target.value)}
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="isVeg" 
                      value="false"
                      checked={isVeg === 'false'}
                      onChange={(e) => setIsVeg(e.target.value)}
                    />
                    <span>Non-Vegetarian</span>
                  </label>
                </div>
                <input type="hidden" name="isVeg" value={isVeg} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageType">Storage Type *</Label>
                <Select 
                  name="storageType" 
                  value={storageType} 
                  onValueChange={setStorageType}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOM_TEMPERATURE">Room Temperature</SelectItem>
                    <SelectItem value="REFRIGERATED">Refrigerated</SelectItem>
                    <SelectItem value="FROZEN">Frozen</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="storageType" value={storageType} />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Pickup Location</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address (optional)</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Full address for pickup"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="flex items-end gap-4">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 28.6139"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 77.2090"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? 'Getting...' : '📍 My Location'}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
