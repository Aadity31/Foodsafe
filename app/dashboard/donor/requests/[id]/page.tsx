import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { RequestDetailClient } from './request-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'DONOR') {
    redirect('/auth/login');
  }

  const { id } = await params;

  const donorProfile = await prisma.donorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!donorProfile) {
    redirect('/auth/register');
  }

  // Auto-expire if needed
  await prisma.foodRequest.updateMany({
    where: {
      id,
      donorId: donorProfile.id,
      status: 'OPEN',
      expiryTime: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  });

  const request = await prisma.foodRequest.findUnique({
    where: { id },
    include: {
      donor: {
        include: { user: { select: { name: true, email: true } } },
      },
      reservation: {
        include: {
          ngo: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
      },
    },
  });

  if (!request || request.donorId !== donorProfile.id) {
    notFound();
  }

  // Convert Date fields to strings for client component
  const requestData = {
    ...request,
    expiryTime: request.expiryTime.toISOString(),
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    reservation: request.reservation
      ? {
          ...request.reservation,
          acceptedAt: request.reservation.acceptedAt?.toISOString() || '',
          completedAt: request.reservation.completedAt?.toISOString() || null,
        }
      : null,
  };

  return <RequestDetailClient request={requestData} />;
}
