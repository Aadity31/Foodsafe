'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { acceptFoodRequest } from '@/lib/actions/ngo';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, Utensils, Navigation, CheckCircle, AlertCircle } from 'lucide-react';

interface Request {
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
  status: string;
  distance: number;
  donor: {
    user: {
      name: string | null;
    };
    organizationName: string | null;
  };
}

interface AvailableRequestsClientProps {
  requests: Request[];
  ngoProfile: {
    ngoName: string;
    serviceRadiusKm: number;
    latitude: number | null;
    longitude: number | null;
  };
}

export function AvailableRequestsClient({ requests, ngoProfile }: AvailableRequestsClientProps) {
  const [accepting, setAccepting] = useState<string | null>(null);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentOtp, setCurrentOtp] = useState<string | null>(null);

  async function handleAccept(requestId: string) {
    setAccepting(requestId);
    try {
      const result = await acceptFoodRequest(requestId);
      if (result.success) {
        setAcceptedId(requestId);
        setCurrentOtp(result.otp || null);
        setShowOtpModal(true);
      } else {
        alert(result.error || 'Failed to accept request');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setAccepting(null);
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

  const getStorageLabel = (storageType: string) => {
    const labels: Record<string, string> = {
      ROOM_TEMPERATURE: 'Room Temp',
      REFRIGERATED: 'Refrigerated',
      FROZEN: 'Frozen',
    };
    return labels[storageType] || storageType;
  };

  const getExpiryColor = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const minutesRemaining = Math.floor((expiry.getTime() - now.getTime()) / 60000);
    
    if (minutesRemaining <= 30) return 'text-red-600';
    if (minutesRemaining <= 60) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Available Requests</h1>
          <p className="text-muted-foreground">
            Food donations within {ngoProfile.serviceRadiusKm}km • Service radius: {ngoProfile.serviceRadiusKm}km
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {requests.length} available
        </Badge>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Available Requests</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are no food requests available in your area at the moment. 
              Check back later or expand your service radius in your profile settings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Request info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={request.isVeg ? 'success' : 'warning'}>
                        {request.isVeg ? 'Veg' : 'Non-Veg'}
                      </Badge>
                      <Badge variant="outline">{getCategoryLabel(request.category)}</Badge>
                      <Badge variant="secondary">{getStorageLabel(request.storageType)}</Badge>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                      {request.quantity} servings
                    </h3>

                    {request.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {request.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {request.address || 'Address not specified'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-4 w-4" />
                        {request.distance?.toFixed(1) || 'N/A'} km away
                      </div>
                      <div className={`flex items-center gap-1 ${getExpiryColor(request.expiryTime)}`}>
                        <Clock className="h-4 w-4" />
                        Expires {formatDistanceToNow(new Date(request.expiryTime), { addSuffix: true })}
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <span className="text-muted-foreground">Donor: </span>
                      <span className="font-medium">
                        {request.donor.organizationName || request.donor.user.name || 'Anonymous'}
                      </span>
                    </div>
                  </div>

                  {/* Right side - Action */}
                  <div className="md:w-48 bg-gray-50 p-6 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l">
                    <Button
                      onClick={() => handleAccept(request.id)}
                      disabled={accepting === request.id || acceptedId === request.id}
                      className="w-full md:w-auto"
                    >
                      {accepting === request.id ? (
                        'Accepting...'
                      ) : acceptedId === request.id ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accepted
                        </>
                      ) : (
                        'Accept Request'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Request Accepted!</CardTitle>
              <CardDescription>
                Share this OTP with the donor for pickup verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-6">
                <p className="text-sm text-green-700 mb-2">Your OTP</p>
                <p className="text-4xl font-bold tracking-widest text-green-800">
                  {currentOtp}
                </p>
              </div>
              <p className="text-sm text-muted-foreground text-center mb-4">
                The donor will need to provide this OTP when you arrive for pickup.
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  setShowOtpModal(false);
                  window.location.href = '/dashboard/ngo/active-pickups';
                }}
              >
                Go to Active Pickups
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
