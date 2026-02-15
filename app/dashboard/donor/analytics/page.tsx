import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { AnalyticsClient } from './analytics-client';

export default async function AnalyticsPage() {
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

  // Get overall stats
  const [totalRequests, completedRequests, activeRequests, expiredRequests] = await Promise.all([
    prisma.foodRequest.count({ where: { donorId: donorProfile.id } }),
    prisma.foodRequest.count({ where: { donorId: donorProfile.id, status: 'COMPLETED' } }),
    prisma.foodRequest.count({ where: { donorId: donorProfile.id, status: 'OPEN' } }),
    prisma.foodRequest.count({ where: { donorId: donorProfile.id, status: 'EXPIRED' } }),
  ]);

  // Get total meals donated
  const mealsDonatedResult = await prisma.foodRequest.aggregate({
    where: { donorId: donorProfile.id, status: 'COMPLETED' },
    _sum: { quantity: true },
  });
  const totalMealsDonated = mealsDonatedResult._sum.quantity || 0;

  // Get monthly data for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = await prisma.foodRequest.groupBy({
    by: ['status'],
    where: {
      donorId: donorProfile.id,
      createdAt: { gte: sixMonthsAgo },
    },
    _count: true,
    _sum: { quantity: true },
  });

  // Get category breakdown
  const categoryBreakdown = await prisma.foodRequest.groupBy({
    by: ['category'],
    where: { donorId: donorProfile.id },
    _count: true,
    _sum: { quantity: true },
  });

  // Calculate impact estimates (placeholder calculations)
  const co2Saved = totalMealsDonated * 0.5; // ~0.5kg CO2 per meal saved (placeholder)
  const waterSaved = totalMealsDonated * 2; // ~2 liters water saved per meal (placeholder)

  const stats = {
    totalRequests,
    completedRequests,
    activeRequests,
    expiredRequests,
    totalMealsDonated,
    co2Saved,
    waterSaved,
    successRate: totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0,
    monthlyData,
    categoryBreakdown,
  };

  return <AnalyticsClient stats={stats} />;
}
