import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { getNgoProfile, updateNgoProfile } from '@/lib/actions/ngo';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
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

  return <ProfileForm ngoProfile={ngoProfile} />;
}
