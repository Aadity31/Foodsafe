'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { confirmPickup, cancelReservation } from '@/lib/actions/ngo';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, Navigation, CheckCircle, XCircle, AlertTriangle, Camera, Loader2 } from 'lucide-react';

interface Pickup {
  id: string;
  foodRequestId: string;
  acceptedAt: string;
  failedAttempts: number;
  status: string;
  photoUrl: string | null;
  foodRequest: {
    id: string;
    category: string;
    quantity: number;
    description: string | null;
    isVeg: boolean;
    storageType: string;
    latitude: number;
    longitude: number;
    address: string | null;
    expiryTime: string;
    donor: {
      user: {
        name: string | null;
      };
      organizationName: string | null;
    };
  };
  timeRemaining: number;
  timeRemainingFormatted: string;
  distance: number | null;
}

interface ActivePickupsClientProps {
  pickups: Pickup[];
  ngoProfile: {
    id: string;
    ngoName: string;
    serviceRadiusKm: number;
    latitude: number | null;
    longitude: number | null;
  };
}

export function ActivePickupsClient({ pickups, ngoProfile }: ActivePickupsClientProps) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [confirmedPickups, setConfirmedPickups] = useState<Set<string>>(new Set());

  async function handleConfirm(foodRequestId: string) {
    setConfirming(foodRequestId);
    try {
      const result = await confirmPickup(foodRequestId, photoUrl || undefined);
      if (result.success) {
        setConfirmedPickups(prev => new Set(prev).add(foodRequestId));
        setShowConfirmModal(null);
        setPhotoUrl('');
      } else {
        alert(result.error || 'Failed to confirm pickup');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setConfirming(null);
    }
  }

  async function handleCancel(foodRequestId: string) {
    setCancelling(foodRequestId);
    try {
      const result = await cancelReservation(foodRequestId);
      if (result.success) {
        setShowCancelModal(null);
        // Refresh the page
        window.location.reload();
      } else {
        alert(result.error || 'Failed to cancel reservation');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setCancelling(null);
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      COOKED_VEG: 'Cooked Veg',
      COOKED_NON_VEG: 'Cooked Non-Veg',
      DRY_ITEMS: 'Dry Items',
      PACKAGED: 'Packaged',
      BAKED_GOODS: 'Baked Goods',
      FRUITS_VEGETABLES: 'Fruits & Vegetables',
      DAIRY: 'Dairy',
      BEVERAGES: 'Beverages',
      OTHER: 'Other',
    };
    return labels[category] || category;
  };

  const getExpiryColor = (timeRemaining: number) => {
    if (timeRemaining <= 30) return 'text-red-600';
    if (timeRemaining <= 60) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Active Pickups</h1>
          <p className="text-muted-foreground">
            Your reserved pickups awaiting collection
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {pickups.length} active
        </Badge>
      </div>

      {pickups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Pickups</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You don't have any active pickups at the moment. 
              Browse available requests to accept new food donations.
            </p>
            <Button className="mt-4" onClick={() => window.location.href = '/dashboard/ngo/available-requests'}>
              Browse Available Requests
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pickups.map((pickup) => (
            <Card key={pickup.id} className={`overflow-hidden ${confirmedPickups.has(pickup.foodRequest.id) ? 'opacity-50' : ''}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Request info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="warning">Reserved</Badge>
                      <Badge variant={pickup.foodRequest.isVeg ? 'success' : 'warning'}>
                        {pickup.foodRequest.isVeg ? 'Veg' : 'Non-Veg'}
                      </Badge>
                      <Badge variant="outline">{getCategoryLabel(pickup.foodRequest.category)}</Badge>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                      {pickup.foodRequest.quantity} servings
                    </h3>

                    {pickup.foodRequest.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {pickup.foodRequest.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {pickup.foodRequest.address || 'Address not specified'}
                      </div>
                      {pickup.distance !== null && (
                        <div className="flex items-center gap-1">
                          <Navigation className="h-4 w-4" />
                          {pickup.distance?.toFixed(1)} km away
                        </div>
                      )}
                      <div className={`flex items-center gap-1 ${getExpiryColor(pickup.timeRemaining)}`}>
                        <Clock className="h-4 w-4" />
                        {pickup.timeRemainingFormatted} remaining
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <span className="text-muted-foreground">Donor: </span>
                      <span className="font-medium">
                        {pickup.foodRequest.donor.organizationName || pickup.foodRequest.donor.user.name || 'Anonymous'}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-muted-foreground">
                      Accepted {formatDistanceToNow(new Date(pickup.acceptedAt), { addSuffix: true })}
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="md:w-64 bg-gray-50 p-6 flex flex-col gap-3 border-t md:border-t-0 md:border-l">
                    {confirmedPickups.has(pickup.foodRequest.id) ? (
                      <div className="flex items-center justify-center gap-2 text-green-600 py-4">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Pickup Confirmed</span>
                      </div>
                    ) : (
                      <>
                        <Button
                          className="w-full"
                          onClick={() => setShowConfirmModal(pickup.foodRequest.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Pickup
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setShowCancelModal(pickup.foodRequest.id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirm Pickup Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Confirm Pickup</CardTitle>
              <CardDescription>
                Confirm that you have collected this food donation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photo">Pickup Photo URL (Optional)</Label>
                <Input
                  id="photo"
                  placeholder="Enter photo URL or leave blank"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can upload a photo after confirmation
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Before confirming:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Verify the food quality and quantity</li>
                      <li>Ensure proper packaging</li>
                      <li>Coordinate with the donor for handoff</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowConfirmModal(null);
                    setPhotoUrl('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleConfirm(showConfirmModal)}
                  disabled={confirming === showConfirmModal}
                >
                  {confirming === showConfirmModal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Cancel Reservation</CardTitle>
              <CardDescription>
                Are you sure you want to cancel this reservation?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  The food request will be made available for other NGOs to accept. 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => setShowCancelModal(null)}
                >
                  Keep Reservation
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleCancel(showCancelModal)}
                  disabled={cancelling === showCancelModal}
                >
                  {cancelling === showCancelModal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cancel Reservation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
