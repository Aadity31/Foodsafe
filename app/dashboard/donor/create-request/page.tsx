import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { CreateRequestForm } from './create-request-form.tsx';

export default async function CreateRequestPage() {
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

  return <CreateRequestForm donorProfile={donorProfile} />;
}
