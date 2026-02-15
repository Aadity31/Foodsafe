'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createFoodRequest } from '@/lib/actions/food-request';

interface FoodRequestFormProps {
  onSuccess: () => void;
}

export function FoodRequestForm({ onSuccess }: FoodRequestFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await createFoodRequest(formData);

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Food Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COOKED_VEG">Cooked Veg</SelectItem>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (servings)</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            max="10000"
            placeholder="e.g., 50"
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
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Food Type</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="isVeg" value="true" defaultChecked />
              <span>Vegetarian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="isVeg" value="false" />
              <span>Non-Vegetarian</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storageType">Storage Type</Label>
          <Select name="storageType" required>
            <SelectTrigger>
              <SelectValue placeholder="Select storage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ROOM_TEMPERATURE">Room Temperature</SelectItem>
              <SelectItem value="REFRIGERATED">Refrigerated</SelectItem>
              <SelectItem value="FROZEN">Frozen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            placeholder="e.g., 28.6139"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            placeholder="e.g., 77.2090"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Pickup Address (optional)</Label>
        <Input
          id="address"
          name="address"
          placeholder="Full address for pickup"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}
