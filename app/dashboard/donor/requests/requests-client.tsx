'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cancelFoodRequest } from '@/lib/actions/food-request';
import { formatDistanceToNow } from 'date-fns';

interface Request {
  id: string;
  category: string;
  quantity: number;
  isVeg: boolean;
  storageType: string;
  status: string;
  address: string | null;
  expiryTime: Date;
  createdAt: Date;
  updatedAt: Date;
  reservation: {
    id: string;
    ngo: {
      user: { name: string | null };
    };
    otpHash: string;
    acceptedAt: Date | null;
    completedAt: Date | null;
    status: string;
  } | null;
}

interface DonorRequestsClientProps {
  requests: Request[];
}

export function DonorRequestsClient({ requests }: DonorRequestsClientProps) {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredRequests = filter === 'ALL' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="info">Open</Badge>;
      case 'RESERVED':
        return <Badge variant="warning">Reserved</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'EXPIRED':
        return <Badge variant="secondary">Expired</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getExpiryStatus = (expiryTime: Date, status: string) => {
    if (status !== 'OPEN') return null;
    
    const expiry = new Date(expiryTime);
    const now = new Date();
    const isExpired = expiry < now;
    const timeLeft = formatDistanceToNow(expiry, { addSuffix: true });
    
    return (
      <span className={isExpired ? 'text-red-500' : 'text-orange-500'}>
        {isExpired ? 'Expired' : `Expires ${timeLeft}`}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-muted-foreground">
            View and manage all your food donation requests
          </p>
        </div>
        <Link href="/dashboard/donor/create-request">
          <Button>+ Create New Request</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'OPEN', 'RESERVED', 'COMPLETED', 'EXPIRED', 'CANCELLED'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">{requests.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'OPEN').length}
            </div>
            <div className="text-sm text-muted-foreground">Open</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {requests.filter(r => r.status === 'RESERVED').length}
            </div>
            <div className="text-sm text-muted-foreground">Reserved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {requests.filter(r => r.status === 'EXPIRED').length}
            </div>
            <div className="text-sm text-muted-foreground">Expired</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Request List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Request ID</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Expiry</th>
                    <th className="text-left py-3 px-4 font-medium">Reserved NGO</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Link 
                          href={`/dashboard/donor/requests/${request.id}`}
                          className="font-mono text-sm hover:underline"
                        >
                          {request.id.slice(0, 8)}...
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={request.isVeg ? 'success' : 'warning'}>
                            {request.isVeg ? 'Veg' : 'Non-Veg'}
                          </Badge>
                          <span className="text-sm">{request.category.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{request.quantity} servings</td>
                      <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
                      <td className="py-3 px-4 text-sm">
                        {getExpiryStatus(request.expiryTime, request.status)}
                      </td>
                      <td className="py-3 px-4">
                        {request.reservation ? (
                          <span className="text-sm">
                            {request.reservation.ngo.user.name}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/donor/requests/${request.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          {request.status === 'OPEN' && (
                            <form action={async () => {
                              await cancelFoodRequest(request.id);
                            }}>
                              <Button variant="destructive" size="sm" type="submit">
                                Cancel
                              </Button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
