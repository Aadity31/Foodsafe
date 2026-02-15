import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getActivePickups, confirmPickup, cancelReservation } from '@/lib/actions/ngo';
import { ActivePickupsClient } from './active-pickups-client';

export default async function ActivePickupsPage() {
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

  const result = await getActivePickups();
  const pickups = 'pickups' in result ? (result.pickups ?? []) : [];

  return (
    <ActivePickupsClient
      pickups={pickups}
      ngoProfile={ngoProfile}
    />
  );
}
