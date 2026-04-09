import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getNgoDashboardStats } from '@/lib/actions/ngo';
import { NgoDashboardClient } from './ngo-dashboard-client';

export default async function NgoDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'NGO') {
    redirect('/auth/login');
  }

  const [ngoProfile, statsResult] = await Promise.all([
    prisma.ngoProfile.findUnique({
      where: { userId: session.user.id },
    }),
    getNgoDashboardStats(),
  ]);

  if (!ngoProfile) {
    redirect('/auth/register');
  }

  if (ngoProfile.approvalStatus !== 'APPROVED') {
    redirect('/verification-pending');
  }
  
  const statsData = !('error' in statsResult) ? statsResult : {
    availableRequests: 0,
    activePickups: 0,
    completedPickups: 0,
    expiredMissed: 0,
    totalMealsCollected: 0,
    recentActivity: [],
  };

  return (
    <NgoDashboardClient
      session={session}
      stats={statsData}
      ngoProfile={ngoProfile}
    />
  );
}
