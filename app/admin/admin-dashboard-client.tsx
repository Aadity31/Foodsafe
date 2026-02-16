'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { approveNgo, rejectNgo, suspendUser, unsuspendUser } from '@/lib/actions/admin';
import { format } from 'date-fns';

interface AdminDashboardClientProps {
  session: any;
  stats: any;
  pendingNGOs: any[];
  foodRequests: any[];
  users: any[];
}

export function AdminDashboardClient({
  session,
  stats,
  pendingNGOs,
  foodRequests,
  users,
}: AdminDashboardClientProps) {
  const [pendingNgos, setPendingNgos] = useState(pendingNGOs);

  async function handleApproveNgo(id: string) {
    await approveNgo(id);
    setPendingNgos(prev => prev.filter(ngo => ngo.id !== id));
  }

  async function handleRejectNgo(id: string) {
    await rejectNgo(id);
    setPendingNgos(prev => prev.filter(ngo => ngo.id !== id));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform management and oversight
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{stats.totalUsers || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.totalDonors || 0} Donors • {stats.totalNGOs || 0} NGOs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Food Requests</CardDescription>
            <CardTitle className="text-3xl">{stats.totalFoodRequests || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.activeRequests || 0} Active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Meals Rescued</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.totalMealsRescued || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.rescueRate || 0}% rescue rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired Requests</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.expiredRequests || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.expiredRatio || 0}% expired ratio
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ngos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ngos">Pending NGOs ({pendingNgos.length})</TabsTrigger>
          <TabsTrigger value="requests">Food Requests</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Pending NGOs */}
        <TabsContent value="ngos">
          <Card>
            <CardHeader>
              <CardTitle>NGO Applications</CardTitle>
              <CardDescription>
                Review and approve NGO registration requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingNgos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending NGO applications
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingNgos.map((ngo: any) => (
                    <div
                      key={ngo.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                    >
                      <div>
                        <h4 className="font-medium">{ngo.ngoName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ngo.user?.email}
                        </p>
                        {ngo.registrationNumber && (
                          <p className="text-sm text-muted-foreground">
                            Reg No: {ngo.registrationNumber}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied: {format(new Date(ngo.createdAt), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleRejectNgo(ngo.id)}
                        >
                          Reject
                        </Button>
                        <Button onClick={() => handleApproveNgo(ngo.id)}>
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Food Requests */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>All Food Requests</CardTitle>
              <CardDescription>
                Monitor food rescue activity across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {foodRequests.slice(0, 20).map((request: any) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        request.status === 'COMPLETED' ? 'success' :
                        request.status === 'OPEN' ? 'info' :
                        request.status === 'EXPIRED' ? 'destructive' : 'warning'
                      }>
                        {request.status}
                      </Badge>
                      <div>
                        <p className="font-medium">
                          {request.category.replace('_', ' ')} • {request.quantity} servings
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.donor?.user?.name || 'Anonymous'} • {request.address || 'No address'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {format(new Date(request.createdAt), 'dd/MM/yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 20).map((user: any) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <div>
                        <p className="font-medium">{user.name || 'Unnamed'}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {user.suspended ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                      {user.role !== 'ADMIN' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (user.suspended) {
                              await unsuspendUser(user.id);
                            } else {
                              await suspendUser(user.id);
                            }
                          }}
                        >
                          {user.suspended ? 'Unsuspend' : 'Suspend'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
