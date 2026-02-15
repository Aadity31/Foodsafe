'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapView } from './map-view';
import { acceptFoodRequest } from '@/lib/actions/food-request';
import { formatDistanceToNow } from 'date-fns';

interface NgoDashboardClientProps {
  session: any;
  stats: any;
  foodRequests: any[];
  ngoProfile: any;
}

export function NgoDashboardClient({
  session,
  stats,
  foodRequests,
  ngoProfile,
}: NgoDashboardClientProps) {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [accepting, setAccepting] = useState<string | null>(null);

  async function handleAccept(requestId: string) {
    setAccepting(requestId);
    try {
      const result = await acceptFoodRequest(requestId);
      if (result.success) {
        alert(`Request accepted! OTP: ${result.otp}`);
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setAccepting(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="success">Available</Badge>;
      case 'RESERVED':
        return <Badge variant="warning">Reserved</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      case 'EXPIRED':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">NGO Dashboard</h1>
          <p className="text-muted-foreground">
            {ngoProfile.ngoName} • Verified NGO
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button
            variant={view === 'map' ? 'default' : 'outline'}
            onClick={() => setView('map')}
          >
            Map View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available Requests</CardDescription>
            <CardTitle className="text-3xl">{foodRequests.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pickups</CardDescription>
            <CardTitle className="text-3xl">{stats.total || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Pickups</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.pending || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.successRate || 0}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Food Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Available Food Requests</CardTitle>
          <CardDescription>
            Food donations near you • Service radius: {ngoProfile.serviceRadiusKm}km
          </CardDescription>
        </CardHeader>
        <CardContent>
          {view === 'map' ? (
            <MapView requests={foodRequests} ngoLat={ngoProfile.latitude} ngoLng={ngoProfile.longitude} />
          ) : (
            <>
              {foodRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No food requests available in your area at the moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {foodRequests.map((request: any) => (
                    <div
                      key={request.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={request.isVeg ? 'success' : 'warning'}>
                            {request.isVeg ? 'Veg' : 'Non-Veg'}
                          </Badge>
                          <Badge variant="outline">{request.category.replace('_', ' ')}</Badge>
                          <Badge variant="secondary">
                            {request.distance?.toFixed(1) || 'N/A'} km away
                          </Badge>
                        </div>
                        <h4 className="font-medium">
                          {request.quantity} servings • {request.storageType.replace('_', ' ')}
                        </h4>
                        {request.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            Expires: {formatDistanceToNow(new Date(request.expiryTime), { addSuffix: true })}
                          </span>
                          <span>
                            {request.donor?.user?.name || 'Anonymous Donor'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAccept(request.id)}
                          disabled={accepting === request.id}
                        >
                          {accepting === request.id ? 'Accepting...' : 'Accept'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
