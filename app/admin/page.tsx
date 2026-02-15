import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getAdminStats, getPendingNGOs, getAllFoodRequests, getAllUsers } from '@/lib/actions/admin';
import { AdminDashboardClient } from './admin-dashboard-client';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  const [statsResult, pendingNGOsResult, foodRequestsResult, usersResult] = await Promise.all([
    getAdminStats(),
    getPendingNGOs(),
    getAllFoodRequests(),
    getAllUsers(),
  ]);

  // Handle error cases
  const stats = 'error' in statsResult ? null : statsResult;
  const pendingNGOs = 'error' in pendingNGOsResult ? [] : pendingNGOsResult;
  const foodRequests = 'error' in foodRequestsResult ? [] : foodRequestsResult;
  const users = 'error' in usersResult ? [] : usersResult;

  return (
    <AdminDashboardClient
      session={session}
      stats={stats}
      pendingNGOs={pendingNGOs}
      foodRequests={foodRequests}
      users={users}
    />
  );
}
