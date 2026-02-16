'use server';

import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { foodRequestSchema } from '@/lib/utils/validation';
import { calculateExpiryWindow, calculateDistance } from '@/lib/utils/geo';
import { revalidatePath } from 'next/cache';
import { formatDistance } from 'date-fns';

/**
 * Create a new food request
 */
export async function createFoodRequest(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'DONOR') {
    return { error: 'Unauthorized' };
  }

  const rawData = {
    category: formData.get('category'),
    quantity: Number(formData.get('quantity')),
    description: formData.get('description'),
    isVeg: formData.get('isVeg') === 'true',
    storageType: formData.get('storageType'),
    latitude: Number(formData.get('latitude')),
    longitude: Number(formData.get('longitude')),
    address: formData.get('address'),
  };

  const validated = foodRequestSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors.map(e => e.message).join(', ') };
  }

  const { category, quantity, description, isVeg, storageType, latitude, longitude, address } = validated.data;

  // Get donor profile
  const donorProfile = await prisma.donorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!donorProfile) {
    return { error: 'Donor profile not found' };
  }

  // Calculate expiry window
  const expiryHours = calculateExpiryWindow(isVeg, storageType, category);
  const expiryTime = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  // Create food request
  const foodRequest = await prisma.foodRequest.create({
    data: {
      donorId: donorProfile.id,
      category,
      quantity,
      description,
      isVeg,
      storageType,
      latitude,
      longitude,
      address,
      expiryTime,
    },
  });

  // Find matching NGOs and notify (in production, this would send notifications)
  await notifyNearbyNGOs(foodRequest.id, latitude, longitude);

  revalidatePath('/dashboard/donor');
  return { success: true, foodRequestId: foodRequest.id };
}

/**
 * Find and notify nearby NGOs
 */
async function notifyNearbyNGOs(foodRequestId: string, lat: number, lon: number) {
  // Get all approved NGOs
  const ngos = await prisma.ngoProfile.findMany({
    where: { approvalStatus: 'APPROVED' },
    include: { user: { select: { suspended: true } } },
  });

  // Calculate distances and filter by service radius
  const eligibleNGOs = ngos
    .filter(ngo => !ngo.user.suspended)
    .map(ngo => ({
      ngo,
      distance: calculateDistance(lat, lon, ngo.latitude || 0, ngo.longitude || 0),
    }))
    .filter(item => item.distance <= (item.ngo.serviceRadiusKm || 25))
    .sort((a, b) => a.distance - b.distance);

  // Notify top 5 NGOs
  const topNGOs = eligibleNGOs.slice(0, 5);

  // In production, this would send actual notifications
  // For now, just log
  console.log(`Notifying ${topNGOs.length} NGOs about food request ${foodRequestId}`);
}

/**
 * Get food requests for NGO dashboard
 */
export async function getNgoFoodRequests() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'NGO') {
    return { error: 'Unauthorized' };
  }

  const ngoProfile = await prisma.ngoProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!ngoProfile || !ngoProfile.latitude || !ngoProfile.longitude) {
    return { error: 'NGO location not set' };
  }

  // Get open food requests
  const foodRequests = await prisma.foodRequest.findMany({
    where: {
      status: 'OPEN',
      expiryTime: { gt: new Date() },
    },
    include: {
      donor: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate distance and filter by NGO service radius
  const requestsWithDistance = foodRequests.map(request => ({
    ...request,
    distance: calculateDistance(
      ngoProfile.latitude!,
      ngoProfile.longitude!,
      request.latitude,
      request.longitude
    ),
  })).filter(request => request.distance <= ngoProfile.serviceRadiusKm);

  return { requests: requestsWithDistance };
}

/**
 * Accept a food request
 */
export async function acceptFoodRequest(foodRequestId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'NGO') {
    return { error: 'Unauthorized' };
  }

  const ngoProfile = await prisma.ngoProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!ngoProfile) {
    return { error: 'NGO profile not found' };
  }

  // Check if request is still available
  const foodRequest = await prisma.foodRequest.findUnique({
    where: { id: foodRequestId },
  });

  if (!foodRequest) {
    return { error: 'Food request not found' };
  }

  if (foodRequest.status !== 'OPEN') {
    return { error: 'This request is no longer available' };
  }

  if (new Date() > foodRequest.expiryTime) {
    // Auto-expire the request
    await prisma.foodRequest.update({
      where: { id: foodRequestId },
      data: { status: 'EXPIRED' },
    });
    return { error: 'This request has expired' };
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = require('crypto').createHash('sha256').update(otp).digest('hex');

  // Create reservation and lock request
  await prisma.$transaction([
    prisma.foodRequest.update({
      where: { id: foodRequestId },
      data: { status: 'RESERVED' },
    }),
    prisma.reservation.create({
      data: {
        foodRequestId,
        ngoId: ngoProfile.id,
        otp,
        otpHash,
      },
    }),
  ]);

  return { success: true, otp };
}

/**
 * Complete pickup with OTP verification - Only the donor can confirm
 */
export async function completePickup(foodRequestId: string, otp: string, photoUrl?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // Get the food request to check if the current user is the donor
  const foodRequest = await prisma.foodRequest.findUnique({
    where: { id: foodRequestId },
    include: { donor: { include: { user: true } } },
  });

  if (!foodRequest) {
    return { error: 'Food request not found' };
  }

  // Verify that the current user is the donor
  if (foodRequest.donor.userId !== session.user.id) {
    return { error: 'Only the donor can confirm pickup completion' };
  }

  const reservation = await prisma.reservation.findUnique({
    where: { foodRequestId },
    include: { foodRequest: true },
  });

  if (!reservation) {
    return { error: 'Reservation not found' };
  }

  if (reservation.failedAttempts >= 3) {
    // Cancel reservation and reopen request
    await prisma.$transaction([
      prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'CANCELLED' },
      }),
      prisma.foodRequest.update({
        where: { id: foodRequestId },
        data: { status: 'OPEN' },
      }),
    ]);
    return { error: 'Too many failed attempts. Reservation cancelled.' };
  }

  // Verify OTP
  const hashedOtp = require('crypto').createHash('sha256').update(otp).digest('hex');
  
  if (hashedOtp !== reservation.otpHash) {
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { failedAttempts: reservation.failedAttempts + 1 },
    });
    return { error: 'Invalid OTP', remainingAttempts: 3 - reservation.failedAttempts - 1 };
  }

  // Complete the reservation
  await prisma.$transaction([
    prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        photoUrl,
      },
    }),
    prisma.foodRequest.update({
      where: { id: foodRequestId },
      data: { status: 'COMPLETED' },
    }),
  ]);

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Cancel food request (donor only)
 */
export async function cancelFoodRequest(foodRequestId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'DONOR') {
    return { error: 'Unauthorized' };
  }

  const foodRequest = await prisma.foodRequest.findUnique({
    where: { id: foodRequestId },
    include: { donor: true },
  });

  if (!foodRequest) {
    return { error: 'Food request not found' };
  }

  if (foodRequest.donor.userId !== session.user.id) {
    return { error: 'Unauthorized' };
  }

  if (['RESERVED', 'COMPLETED'].includes(foodRequest.status)) {
    return { error: 'Cannot cancel a reserved or completed request' };
  }

  await prisma.foodRequest.update({
    where: { id: foodRequestId },
    data: { status: 'CANCELLED' },
  });

  revalidatePath('/dashboard/donor');
  return { success: true };
}

/**
 * Get donor dashboard stats
 */
export async function getDonorStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'DONOR') {
    return { error: 'Unauthorized' };
  }

  const donorProfile = await prisma.donorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!donorProfile) {
    return { error: 'Donor profile not found' };
  }

  const [total, completed, active, expired] = await Promise.all([
    prisma.foodRequest.count({ where: { donorId: donorProfile.id } }),
    prisma.foodRequest.count({ where: { donorId: donorProfile.id, status: 'COMPLETED' } }),
    prisma.foodRequest.count({ where: { donorId: donorProfile.id, status: 'OPEN' } }),
    prisma.foodRequest.count({ where: { donorId: donorProfile.id, status: 'EXPIRED' } }),
  ]);

  return {
    total,
    completed,
    active,
    expired,
    rescueRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/**
 * Get NGO dashboard stats
 */
export async function getNgoStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'NGO') {
    return { error: 'Unauthorized' };
  }

  const ngoProfile = await prisma.ngoProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!ngoProfile) {
    return { error: 'NGO profile not found' };
  }

  const [total, completed, pending] = await Promise.all([
    prisma.reservation.count({ where: { ngoId: ngoProfile.id } }),
    prisma.reservation.count({ where: { ngoId: ngoProfile.id, status: 'COMPLETED' } }),
    prisma.reservation.count({ where: { ngoId: ngoProfile.id, status: 'PENDING' } }),
  ]);

  return {
    total,
    completed,
    pending,
    successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
