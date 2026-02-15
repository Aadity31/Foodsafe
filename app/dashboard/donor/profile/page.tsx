import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'DONOR') {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      donorProfile: true,
    },
  });

  if (!user || !user.donorProfile) {
    redirect('/auth/register');
  }

  return <ProfileForm user={user} donorProfile={user.donorProfile} />;
}
