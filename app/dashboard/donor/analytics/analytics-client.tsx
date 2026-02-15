'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsClientProps {
  stats: {
    totalRequests: number;
    completedRequests: number;
    activeRequests: number;
    expiredRequests: number;
    totalMealsDonated: number;
    co2Saved: number;
    waterSaved: number;
    successRate: number;
    monthlyData: Array<{
      status: string;
      _count: number;
      _sum: { quantity: number | null };
    }>;
    categoryBreakdown: Array<{
      category: string;
      _count: number;
      _sum: { quantity: number | null };
    }>;
  };
}

export function AnalyticsClient({ stats }: AnalyticsClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your food donation impact and performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl">{stats.totalRequests}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.successRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.activeRequests}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-3xl text-gray-600">{stats.expiredRequests}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
          <CardDescription>
            Measurable contribution to reducing food waste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600">
                {stats.totalMealsDonated.toLocaleString()}
              </div>
              <div className="text-sm text-green-700 mt-2">Meals Donated</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600">
                {stats.co2Saved.toLocaleString()} kg
              </div>
              <div className="text-sm text-blue-700 mt-2">CO₂ Saved (est.)</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600">
                {stats.waterSaved.toLocaleString()} L
              </div>
              <div className="text-sm text-purple-700 mt-2">Water Saved (est.)</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            * Impact estimates are based on average environmental savings per meal rescued
          </p>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Completed', value: stats.completedRequests, color: 'bg-green-500' },
                { label: 'Active', value: stats.activeRequests, color: 'bg-blue-500' },
                { label: 'Expired', value: stats.expiredRequests, color: 'bg-gray-400' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`}
                      style={{ 
                        width: stats.totalRequests > 0 
                          ? `${(item.value / stats.totalRequests) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.categoryBreakdown.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No data available yet
              </p>
            ) : (
              <div className="space-y-3">
                {stats.categoryBreakdown.map((cat) => (
                  <div key={cat.category} className="flex justify-between items-center">
                    <span className="text-sm">{cat.category.replace('_', ' ')}</span>
                    <div className="text-right">
                      <span className="font-medium">{cat._count} requests</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({cat._sum.quantity || 0} servings)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tips to Improve Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Report surplus food immediately after your event ends</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Set accurate pickup time windows (shorter windows = faster response)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Ensure accurate location coordinates for easy navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Properly store food to maintain quality until pickup</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
