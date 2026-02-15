import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getNgoStats, getNgoFoodRequests } from '@/lib/actions/food-request';
import { NgoDashboardClient } from './ngo-dashboard-client';

export default async function NgoDashboard() {
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

  // Check if NGO is approved
  if (ngoProfile.approvalStatus !== 'APPROVED') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-16 w-16 mx-auto text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Pending Approval</h1>
          <p className="text-muted-foreground mb-6">
            Your NGO registration is currently pending approval from our team.
            We'll review your application and get back to you within 2-3 business days.
          </p>
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-medium">{ngoProfile.approvalStatus}</span>
          </p>
        </div>
      </div>
    );
  }

  const statsResult = await getNgoStats();
  const foodRequestsResult = await getNgoFoodRequests();

  // Handle error cases
  const stats = 'error' in statsResult ? null : statsResult;
  const foodRequests = ('requests' in foodRequestsResult ? foodRequestsResult.requests : []) || [];

  return (
    <NgoDashboardClient
      session={session}
      stats={stats}
      foodRequests={foodRequests}
      ngoProfile={ngoProfile}
    />
  );
}
