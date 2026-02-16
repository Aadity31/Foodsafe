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

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      donorProfile: true,
    },
  });

  // If user doesn't have a donorProfile, create one
  if (!user || !user.donorProfile) {
    // Create donor profile if it doesn't exist
    await prisma.donorProfile.create({
      data: { userId: session.user.id },
    });
    
    // Refetch user with the new donor profile
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        donorProfile: true,
      },
    });
  }

  if (!user || !user.donorProfile) {
    redirect('/auth/register');
  }

  return <ProfileForm user={user} donorProfile={user.donorProfile} />;
}
