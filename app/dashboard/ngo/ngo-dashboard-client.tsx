'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { List, Truck, CheckCircle, AlertCircle, Utensils, Clock, History, BarChart3, User, MapPin } from 'lucide-react';

interface RecentActivity {
  id: string;
  acceptedAt: Date | string;
  completedAt: Date | string | null;
  status: string;
  foodRequest: {
    id: string;
    quantity: number;
    category: string;
    isVeg: boolean;
    donor: {
      user: { name: string | null };
      organizationName: string | null;
    };
  };
}

interface NgoDashboardClientProps {
  session: any;
  stats: {
    availableRequests: number;
    activePickups: number;
    completedPickups: number;
    expiredMissed: number;
    totalMealsCollected: number;
    recentActivity: RecentActivity[];
  };
  ngoProfile: {
    id: string;
    ngoName: string;
    approvalStatus: string;
    serviceRadiusKm: number;
    latitude: number | null;
    longitude: number | null;
  };
}

export function NgoDashboardClient({
  session,
  stats,
  ngoProfile,
}: NgoDashboardClientProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'PENDING':
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          {ngoProfile.ngoName} • Verified NGO
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Requests Nearby
            </CardDescription>
            <CardTitle className="text-3xl">{stats.availableRequests}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Active Pickups
            </CardDescription>
            <CardTitle className="text-3xl">{stats.activePickups}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </CardDescription>
            <CardTitle className="text-3xl">{stats.completedPickups}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Expired/Missed
            </CardDescription>
            <CardTitle className="text-3xl">{stats.expiredMissed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Total Meals
            </CardDescription>
            <CardTitle className="text-3xl">{stats.totalMealsCollected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/ngo/available-requests">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <List className="h-8 w-8 text-green-600 mb-2" />
              <p className="font-medium">Browse Requests</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/ngo/active-pickups">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Truck className="h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium">Active Pickups</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/ngo/history">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <History className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-medium">History</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/ngo/analytics">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
              <p className="font-medium">Analytics</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest pickup activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity. Start by accepting a food request!
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={activity.foodRequest.isVeg ? 'success' : 'warning'}>
                        {activity.foodRequest.isVeg ? 'Veg' : 'Non-Veg'}
                      </Badge>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="font-medium">
                      {activity.foodRequest.quantity} servings • {activity.foodRequest.category.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.foodRequest.donor.organizationName || activity.foodRequest.donor.user.name || 'Anonymous'}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {activity.completedAt
                      ? `Completed ${formatDistanceToNow(new Date(activity.completedAt), { addSuffix: true })}`
                      : `Accepted ${formatDistanceToNow(new Date(activity.acceptedAt), { addSuffix: true })}`}
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
