import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getDonorStats } from '@/lib/actions/food-request';
import { DonorDashboardClient } from './donor-dashboard-client';

export default async function DonorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'DONOR') {
    redirect('/auth/login');
  }

  const donorProfile = await prisma.donorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!donorProfile) {
    redirect('/auth/register');
  }

  const [stats, recentRequests] = await Promise.all([
    getDonorStats(),
    prisma.foodRequest.findMany({
      where: { donorId: donorProfile.id },
      include: {
        reservation: {
          include: {
            ngo: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return (
    <DonorDashboardClient
      session={session}
      stats={stats}
      recentRequests={recentRequests}
      donorProfile={donorProfile}
    />
  );
}
