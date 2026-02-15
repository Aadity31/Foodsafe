'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Utensils, MapPin, TrendingUp, BarChart3 } from 'lucide-react';

interface MonthlyData {
  month: string;
  pickups: number;
  meals: number;
}

interface AnalyticsClientProps {
  analytics: {
    monthlyData: MonthlyData[];
    totalPickups: number;
    totalMeals: number;
    averageDistance: number;
    completionRate: number;
  };
  ngoProfile: {
    id: string;
    ngoName: string;
    serviceRadiusKm: number;
    latitude: number | null;
    longitude: number | null;
  };
}

export function AnalyticsClient({ analytics, ngoProfile }: AnalyticsClientProps) {
  const maxPickups = Math.max(...analytics.monthlyData.map(m => m.pickups), 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Your pickup performance and impact metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Total Pickups
            </CardDescription>
            <CardTitle className="text-4xl">{analytics.totalPickups}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Meals Rescued
            </CardDescription>
            <CardTitle className="text-4xl">{analytics.totalMeals}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Avg. Distance
            </CardDescription>
            <CardTitle className="text-4xl">{analytics.averageDistance} km</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Completion Rate
            </CardDescription>
            <CardTitle className="text-4xl">{analytics.completionRate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Monthly Pickups Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Pickups
          </CardTitle>
          <CardDescription>
            Your pickup activity over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.monthlyData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pickup data available yet. Start accepting requests to see your analytics.
            </div>
          ) : (
            <div className="h-64 flex items-end gap-2">
              {analytics.monthlyData.map((month, index) => {
                const height = (month.pickups / maxPickups) * 100;
                const monthLabel = month.month.split('-');
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={`${month.pickups} pickups (${month.meals} meals)`}
                    />
                    <span className="text-xs text-muted-foreground mt-2">
                      {monthLabel[1]}/{monthLabel[0].slice(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Area Info */}
      <Card>
        <CardHeader>
          <CardTitle>Service Area</CardTitle>
          <CardDescription>
            Your configured service radius for accepting requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{ngoProfile.serviceRadiusKm} km</p>
              <p className="text-muted-foreground">Service Radius</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
