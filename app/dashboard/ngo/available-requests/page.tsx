import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getAvailableFoodRequests, acceptFoodRequest } from '@/lib/actions/ngo';
import { AvailableRequestsClient } from './available-requests-client';

export default async function AvailableRequestsPage() {
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

  // Check if NGO has location set
  if (!ngoProfile.latitude || !ngoProfile.longitude) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Location Required</h1>
          <p className="text-muted-foreground mb-6">
            Please set your NGO location in your profile to see available requests near you.
          </p>
          <a
            href="/dashboard/ngo/profile"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
          >
            Update Profile
          </a>
        </div>
      </div>
    );
  }

  const result = await getAvailableFoodRequests();
  const requests = 'requests' in result ? (result.requests ?? []) : [];

  return (
    <AvailableRequestsClient
      requests={requests}
      ngoProfile={ngoProfile}
    />
  );
}
