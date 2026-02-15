import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getPickupHistory } from '@/lib/actions/ngo';
import { HistoryClient } from './history-client';

export default async function HistoryPage() {
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

  const result = await getPickupHistory();
  const history = 'history' in result ? (result.history ?? []) : [];

  return (
    <HistoryClient
      history={history}
      ngoProfile={ngoProfile}
    />
  );
}
