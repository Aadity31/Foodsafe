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

  const [donorProfile, _] = await Promise.all([
    prisma.donorProfile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.foodRequest.updateMany({
      where: {
        donorId: session.user.id,
        status: 'OPEN',
        expiryTime: { lt: new Date() },
      },
      data: { status: 'EXPIRED' },
    }),
  ]);

  if (!donorProfile) {
    redirect('/auth/register');
  }

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
