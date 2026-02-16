'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FoodRequestForm } from './food-request-form';
import { createFoodRequest, cancelFoodRequest } from '@/lib/actions/food-request';
import { format } from 'date-fns';

interface DonorDashboardClientProps {
  session: any;
  stats: any;
  recentRequests: any[];
  donorProfile: any;
}

export function DonorDashboardClient({
  session,
  stats,
  recentRequests,
  donorProfile,
}: DonorDashboardClientProps) {
  const [showForm, setShowForm] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Donor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Report Surplus Food'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Surplus Food</CardTitle>
            <CardDescription>
              Fill in the details below to notify nearby NGOs about your surplus food
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FoodRequestForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl">{stats.total || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-primary">{stats.active || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completed || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rescue Rate</CardDescription>
            <CardTitle className="text-3xl">{stats.rescueRate || 0}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Food Requests</CardTitle>
          <CardDescription>
            Track the status of your food donation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No food requests yet. Click "Report Surplus Food" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(request.status)}
                      <Badge variant={request.isVeg ? 'success' : 'warning'}>
                        {request.isVeg ? 'Veg' : 'Non-Veg'}
                      </Badge>
                      <Badge variant="outline">{request.category.replace('_', ' ')}</Badge>
                    </div>
                    <h4 className="font-medium">
                      {request.quantity} servings • {request.storageType.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Created: {format(new Date(request.createdAt), 'dd/MM/yyyy')}
                    </p>
                    {request.reservation && (
                      <p className="text-sm text-muted-foreground">
                        Accepted by: {request.reservation.ngo?.user?.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {request.status === 'OPEN' && (
                      <form action={async () => {
                        await cancelFoodRequest(request.id);
                      }}>
                        <Button variant="outline" size="sm" type="submit">
                          Cancel
                        </Button>
                      </form>
                    )}
                    {request.status === 'RESERVED' && (
                      <div className="text-right">
                        <p className="text-sm font-medium">Pickup OTP</p>
                        <p className="text-2xl font-bold text-primary">
                          {request.reservation?.otpDisplay || '••••••'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
