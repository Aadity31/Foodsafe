import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getNgoAnalytics } from '@/lib/actions/ngo';
import { AnalyticsClient } from './analytics-client';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'NGO') {
    redirect('/auth/login');
  }

  const ngoProfile = await prisma.ngoProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!ngoProfile) {
    redirect('/auth/register');
  }

  if (ngoProfile.approvalStatus !== 'APPROVED') {
    redirect('/verification-pending');
  }

  const result = await getNgoAnalytics();
  
  const analytics = !('error' in result) ? result : {
    monthlyData: [],
    totalPickups: 0,
    totalMeals: 0,
    averageDistance: 0,
    completionRate: 0,
  };

  return (
    <AnalyticsClient
      analytics={analytics}
      ngoProfile={ngoProfile}
    />
  );
}
