'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { completePickup } from '@/lib/actions/food-request';

interface FoodRequest {
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
  createdAt: string;
  donor: {
    user: {
      name: string | null;
      email: string;
    };
    organizationName: string | null;
    phone: string | null;
  };
  reservation: {
    id: string;
    status: string;
    acceptedAt: string;
    completedAt: string | null;
    ngo: {
      user: {
        name: string | null;
        email: string;
      };
      ngoName: string;
      phone: string | null;
    };
  } | null;
}

interface RequestDetailClientProps {
  request: FoodRequest;
}

const categoryLabels: Record<string, string> = {
  COOKED_VEG: 'Cooked Vegetarian',
  COOKED_NON_VEG: 'Cooked Non-Veg',
  DRY_ITEMS: 'Dry Items',
  PACKAGED: 'Packaged Food',
  BAKED_GOODS: 'Baked Goods',
  FRUITS_VEGETABLES: 'Fruits & Vegetables',
  DAIRY: 'Dairy Products',
  BEVERAGES: 'Beverages',
  OTHER: 'Other',
};

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  RESERVED: 'Reserved',
  COMPLETED: 'Completed',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
};

function getStatusColor(status: string): string {
  switch (status) {
    case 'OPEN':
      return 'bg-green-500';
    case 'RESERVED':
      return 'bg-blue-500';
    case 'COMPLETED':
      return 'bg-gray-500';
    case 'EXPIRED':
      return 'bg-red-500';
    case 'CANCELLED':
      return 'bg-red-800';
    default:
      return 'bg-gray-500';
  }
}

export function RequestDetailClient({ request }: RequestDetailClientProps) {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this request?')) return;

    try {
      const response = await fetch(`/api/food-requests/${request.id}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to cancel request');
      }
    } catch (error) {
      alert('An error occurred while cancelling the request');
    }
  };

  const handleComplete = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter the 6-digit OTP provided by the NGO');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await completePickup(request.id, otp);
      
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || 'Failed to complete request');
      }
    } catch (error) {
      alert('An error occurred while completing the request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        {/* Request Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Food Request Details</CardTitle>
                <p className="text-sm text-gray-500 mt-1">ID: {request.id}</p>
              </div>
              <Badge className={getStatusColor(request.status)}>
                {statusLabels[request.status] || request.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p>{categoryLabels[request.category] || request.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Quantity (people served)</p>
                <p>{request.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Food Type</p>
                <p>{request.isVeg ? '🥬 Vegetarian' : '🍗 Non-Vegetarian'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Storage Type</p>
                <p>{request.storageType.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Expiry Time</p>
                <p>{formatDate(request.expiryTime)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p>{formatDate(request.createdAt)}</p>
              </div>
            </div>
            {request.description && (
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p>{request.description}</p>
              </div>
            )}
            {request.address && (
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>{request.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Donor Information */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Organization:</strong> {request.donor.organizationName || 'N/A'}</p>
            <p><strong>Name:</strong> {request.donor.user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {request.donor.user.email}</p>
            {request.donor.phone && <p><strong>Phone:</strong> {request.donor.phone}</p>}
          </CardContent>
        </Card>

        {/* Reservation Info (if reserved) */}
        {request.reservation && (
          <Card>
            <CardHeader>
              <CardTitle>Reserved by NGO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>NGO Name:</strong> {request.reservation.ngo.ngoName}</p>
              <p><strong>Contact:</strong> {request.reservation.ngo.user.email}</p>
              {request.reservation.ngo.phone && (
                <p><strong>Phone:</strong> {request.reservation.ngo.phone}</p>
              )}
              <p><strong>Accepted At:</strong> {formatDate(request.reservation.acceptedAt)}</p>
              {request.reservation.completedAt && (
                <p><strong>Completed At:</strong> {formatDate(request.reservation.completedAt)}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {request.status === 'OPEN' && (
          <div className="flex gap-4">
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Request
            </Button>
          </div>
        )}

        {request.status === 'RESERVED' && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-medium text-yellow-800 mb-2">Enter OTP to Confirm Pickup</p>
              <p className="text-sm text-yellow-600 mb-4">
                Ask the NGO representative for the 6-digit OTP to verify the pickup
              </p>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="text-center text-xl tracking-widest font-mono"
                  />
                </div>
                <Button 
                  onClick={handleComplete} 
                  disabled={isSubmitting || otp.length !== 6}
                  className=""
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Pickup'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
