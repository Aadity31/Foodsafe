'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPickupHistory } from '@/lib/actions/ngo';
import { format } from 'date-fns';
import { MapPin, Calendar, CheckCircle, XCircle, Clock, Navigation, RefreshCw } from 'lucide-react';

interface HistoryItem {
  id: string;
  acceptedAt: string | Date;
  completedAt: string | Date | null;
  status: string;
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
    donor: {
      user: {
        name: string | null;
      };
      organizationName: string | null;
    };
  };
  distance: number | null;
}

interface HistoryClientProps {
  history: HistoryItem[];
  ngoProfile: {
    id: string;
    ngoName: string;
    serviceRadiusKm: number;
    latitude: number | null;
    longitude: number | null;
  };
}

export function HistoryClient({ history: initialHistory, ngoProfile }: HistoryClientProps) {
  const [filter, setFilter] = useState<string>('ALL');
  const [history, setHistory] = useState(initialHistory);
  const [loading, setLoading] = useState(false);

  async function loadHistory(status?: string) {
    setLoading(true);
    try {
      const result = await getPickupHistory(status);
      if ('history' in result && result.history) {
        setHistory(result.history);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
    if (newFilter === 'ALL') {
      loadHistory(undefined);
    } else {
      loadHistory(newFilter);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pickup History</h1>
          <p className="text-muted-foreground">
            View your completed and cancelled pickups
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => loadHistory(filter === 'ALL' ? undefined : filter)}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'COMPLETED', 'CANCELLED'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange(status)}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No History</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {filter === 'ALL' 
                ? "You haven't completed any pickups yet." 
                : `You don't have any ${filter.toLowerCase()} pickups.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Request info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusBadge(item.status)}
                      <Badge variant={item.foodRequest.isVeg ? 'success' : 'warning'}>
                        {item.foodRequest.isVeg ? 'Veg' : 'Non-Veg'}
                      </Badge>
                      <Badge variant="outline">{getCategoryLabel(item.foodRequest.category)}</Badge>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                      {item.foodRequest.quantity} servings
                    </h3>

                    {item.foodRequest.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.foodRequest.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.foodRequest.address || 'Address not specified'}
                      </div>
                      {item.distance !== null && (
                        <div className="flex items-center gap-1">
                          <Navigation className="h-4 w-4" />
                          {item.distance?.toFixed(1)} km
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(item.acceptedAt), 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <span className="text-muted-foreground">Donor: </span>
                      <span className="font-medium">
                        {item.foodRequest.donor.organizationName || item.foodRequest.donor.user.name || 'Anonymous'}
                      </span>
                    </div>
                  </div>

                  {/* Right side - Status details */}
                  <div className="md:w-48 bg-gray-50 p-6 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l">
                    {item.status === 'COMPLETED' && item.completedAt && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="font-medium">{format(new Date(item.completedAt), 'MMM dd, yyyy HH:mm')}</p>
                      </div>
                    )}
                    {item.status === 'CANCELLED' && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium text-red-600">Cancelled</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
