import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DonorDashboardLayout } from './donor-dashboard-layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Role check - redirect if not donor
  if (session.user.role !== 'DONOR') {
    if (session.user.role === 'NGO') {
      redirect('/dashboard/ngo');
    } else if (session.user.role === 'ADMIN') {
      redirect('/admin');
    }
    redirect('/');
  }

  return <DonorDashboardLayout>{children}</DonorDashboardLayout>;
}
