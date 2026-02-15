import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { DonorRequestsClient } from './requests-client';

export default async function DonorRequestsPage() {
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

  // Auto-expire requests that have passed their expiry time
  await prisma.foodRequest.updateMany({
    where: {
      donorId: donorProfile.id,
      status: 'OPEN',
      expiryTime: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  });

  const requests = await prisma.foodRequest.findMany({
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
  });

  return <DonorRequestsClient requests={requests} />;
}
