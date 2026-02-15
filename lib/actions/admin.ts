'use server';

import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Admin action: Approve NGO
 */
export async function approveNgo(ngoProfileId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  await prisma.ngoProfile.update({
    where: { id: ngoProfileId },
    data: {
      approvalStatus: 'APPROVED',
      verifiedAt: new Date(),
    },
  });

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Admin action: Reject NGO
 */
export async function rejectNgo(ngoProfileId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  await prisma.ngoProfile.update({
    where: { id: ngoProfileId },
    data: { approvalStatus: 'REJECTED' },
  });

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Admin action: Suspend user
 */
export async function suspendUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { suspended: true },
  });

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Admin action: Unsuspend user
 */
export async function unsuspendUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { suspended: false },
  });

  revalidatePath('/admin');
  return { success: true };
}

/**
 * Get admin dashboard stats
 */
export async function getAdminStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const [
    totalUsers,
    totalDonors,
    totalNGOs,
    pendingNGOs,
    totalFoodRequests,
    completedRequests,
    expiredRequests,
    activeRequests,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'DONOR' } }),
    prisma.user.count({ where: { role: 'NGO' } }),
    prisma.ngoProfile.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.foodRequest.count(),
    prisma.foodRequest.count({ where: { status: 'COMPLETED' } }),
    prisma.foodRequest.count({ where: { status: 'EXPIRED' } }),
    prisma.foodRequest.count({ where: { status: 'OPEN' } }),
  ]);

  const totalMealsRescued = await prisma.foodRequest.aggregate({
    _sum: { quantity: true },
    where: { status: 'COMPLETED' },
  });

  return {
    totalUsers,
    totalDonors,
    totalNGOs,
    pendingNGOs,
    totalFoodRequests,
    completedRequests,
    expiredRequests,
    activeRequests,
    totalMealsRescued: totalMealsRescued._sum.quantity || 0,
    rescueRate: totalFoodRequests > 0 
      ? Math.round((completedRequests / totalFoodRequests) * 100) 
      : 0,
    expiredRatio: totalFoodRequests > 0 
      ? Math.round((expiredRequests / totalFoodRequests) * 100) 
      : 0,
  };
}

/**
 * Get all pending NGO applications
 */
export async function getPendingNGOs() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  return prisma.ngoProfile.findMany({
    where: { approvalStatus: 'PENDING' },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Get all food requests for admin view
 */
export async function getAllFoodRequests() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  return prisma.foodRequest.findMany({
    include: {
      donor: {
        include: { user: { select: { name: true, email: true } } },
      },
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
}

/**
 * Get all users for admin management
 */
export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  return prisma.user.findMany({
    include: {
      donorProfile: true,
      ngoProfile: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
