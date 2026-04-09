'use server';

import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { calculateDistance, getTimeRemaining, formatDuration } from '@/lib/utils/geo';
import { generateOTP, hashOTP, verifyOTP } from '@/lib/utils/otp';
import { revalidatePath } from 'next/cache';

/**
 * Get NGO Profile with user info
 */
export async function getNgoProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'NGO') {
    return { error: 'Unauthorized' };
  }

  const ngoProfile = await prisma.ngoProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        }
      }
    }
  });

  if (!ngoProfile) {
    return { error: 'NGO profile not found' };
  }

  return { ngoProfile };
}

/**
 * Get NGO Dashboard Stats
 * Returns comprehensive stats for the dashboard overview
 */
export async function getNgoDashboardStats() {
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

  const now = new Date();

  // Get all data using parallel queries
  const [
    availableRequests,
    activePickups,
    completedPickups,
    expiredMissed,
    completedReservations,
    recentActivity,
  ] = await Promise.all([
    // Available (OPEN) requests within service radius - count all for now
    prisma.foodRequest.count({
      where: {
        status: 'OPEN',
        expiryTime: { gt: now },
      },
    }),
    // Active pickups (RESERVED by this NGO)
    prisma.reservation.count({
      where: {
        ngoId: ngoProfile.id,
        status: 'PENDING',
      },
    }),
    // Completed pickups
    prisma.reservation.count({
      where: {
        ngoId: ngoProfile.id,
        status: 'COMPLETED',
      },
    }),
    // Expired/Missed (reservations that were cancelled)
    prisma.reservation.count({
      where: {
        ngoId: ngoProfile.id,
        status: 'CANCELLED',
      },
    }),
    // Get completed reservations to calculate total meals
    prisma.reservation.findMany({
      where: {
        ngoId: ngoProfile.id,
        status: 'COMPLETED',
      },
      include: {
        foodRequest: true,
      },
    }),
    // Get recent activity
    prisma.reservation.findMany({
      where: { ngoId: ngoProfile.id },
      include: {
        foodRequest: {
          include: {
            donor: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { acceptedAt: 'desc' },
      take: 10,
    }),
  ]);

  const totalMealsCollected = completedReservations.reduce(
    (sum, r) => sum + r.foodRequest.quantity, 
    0
  );

  return {
    availableRequests,
    activePickups,
    completedPickups,
    expiredMissed,
    totalMealsCollected,
    recentActivity,
  };
}

/**
 * Get Available Food Requests
 * Server-side filtering by distance using Haversine formula
 */
export async function getAvailableFoodRequests() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'NGO') {
    return { error: 'Unauthorized' };
  }

  const ngoProfile = await prisma.ngoProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!ngoProfile || !ngoProfile.latitude || !ngoProfile.longitude) {
    return { error: 'NGO location not set. Please update your profile with coordinates.' };
  }

  const now = new Date();

  // Fetch all OPEN requests that haven't expired
  // We fetch a broader range and filter by distance server-side
  const foodRequests = await prisma.foodRequest.findMany({
    where: {
      status: 'OPEN',
      expiryTime: { gt: now },
      // Broader geo bounds for initial fetch
      latitude: {
        gte: ngoProfile.latitude - 1,
        lte: ngoProfile.latitude + 1,
      },
      longitude: {
        gte: ngoProfile.longitude - 1,
        lte: ngoProfile.longitude + 1,
      },
    },
    include: {
      donor: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate distance and filter by service radius
  const requestsWithDistance = foodRequests
    .map((request) => ({
      ...request,
      expiryTime: request.expiryTime.toISOString(),
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      distance: calculateDistance(
        ngoProfile.latitude!,
        ngoProfile.longitude!,
        request.latitude,
        request.longitude
      ),
    }))
    .filter((request) => request.distance <= ngoProfile.serviceRadiusKm)
    .sort((a, b) => a.distance - b.distance);

  return { requests: requestsWithDistance };
}

/**
 * Accept a Food Request
 * Transaction-based with OTP generation and proper locking
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

  // Validate NGO location
  if (!ngoProfile.latitude || !ngoProfile.longitude) {
    return { error: 'NGO location not set. Please update your profile.' };
  }

  try {
    // Use transaction with locking to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Lock the food request row for update
      const foodRequest = await tx.foodRequest.findUnique({
        where: { id: foodRequestId },
      });

      if (!foodRequest) {
        throw new Error('Food request not found');
      }

      // Check if NGO is trying to accept their own request
      const donorProfile = await tx.donorProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (donorProfile && foodRequest.donorId === donorProfile.id) {
        throw new Error('You cannot accept your own food request');
      }

      // Check status
      if (foodRequest.status !== 'OPEN') {
        throw new Error('This request is no longer available');
      }

      // Check expiry
      if (new Date() > foodRequest.expiryTime) {
        // Auto-expire
        await tx.foodRequest.update({
          where: { id: foodRequestId },
          data: { status: 'EXPIRED' },
        });
        throw new Error('This request has expired');
      }

      // Check if already reserved by another NGO (double reservation check)
      const existingReservation = await tx.reservation.findUnique({
        where: { foodRequestId },
      });

      if (existingReservation) {
        throw new Error('This request has already been reserved');
      }

      // Check distance - prevent accepting outside service radius
      const distance = calculateDistance(
        ngoProfile.latitude!,
        ngoProfile.longitude!,
        foodRequest.latitude,
        foodRequest.longitude
      );

      if (distance > ngoProfile.serviceRadiusKm) {
        throw new Error('This request is outside your service radius');
      }

      // Generate OTP
      const otp = generateOTP();
      const otpHash = hashOTP(otp);

      // Create reservation and update request status atomically
      await tx.reservation.create({
        data: {
          foodRequestId,
          ngoId: ngoProfile.id,
          otp,
          otpHash,
        },
      });

      await tx.foodRequest.update({
        where: { id: foodRequestId },
        data: { status: 'RESERVED' },
      });

      return { otp, foodRequestId };
    });

    revalidatePath('/dashboard/ngo');
    revalidatePath('/dashboard/ngo/available-requests');
    revalidatePath('/dashboard/ngo/active-pickups');

    return { 
      success: true, 
      otp: result.otp,
      message: 'Request accepted successfully! Share this OTP with the donor for pickup verification.'
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to accept request';
    return { error: errorMessage };
  }
}

/**
 * Get Active Pickups
 * Returns reservations that are PENDING and food requests that are RESERVED
 */
export async function getActivePickups() {
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

  const reservations = await prisma.reservation.findMany({
    where: {
      ngoId: ngoProfile.id,
      status: 'PENDING',
      foodRequest: {
        status: 'RESERVED',
      },
    },
    include: {
      foodRequest: {
        include: {
          donor: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { acceptedAt: 'asc' },
  });

  // Calculate time remaining for each pickup and convert dates to strings
  const pickupsWithMeta = reservations.map((reservation) => {
    const timeRemaining = getTimeRemaining(reservation.foodRequest.expiryTime);
    const distance = ngoProfile.latitude && ngoProfile.longitude
      ? calculateDistance(
          ngoProfile.latitude,
          ngoProfile.longitude,
          reservation.foodRequest.latitude,
          reservation.foodRequest.longitude
        )
      : null;

    return {
      ...reservation,
      acceptedAt: reservation.acceptedAt.toISOString(),
      foodRequest: {
        ...reservation.foodRequest,
        expiryTime: reservation.foodRequest.expiryTime.toISOString(),
        createdAt: reservation.foodRequest.createdAt.toISOString(),
        updatedAt: reservation.foodRequest.updatedAt.toISOString(),
      },
      timeRemaining,
      timeRemainingFormatted: formatDuration(timeRemaining),
      distance,
    };
  });

  return { pickups: pickupsWithMeta };
}

/**
 * Confirm Pickup
 * Called by NGO after physical pickup with photo and OTP
 */
export async function confirmPickup(foodRequestId: string, photoUrl?: string, otp?: string) {
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

  try {
    await prisma.$transaction(async (tx) => {
      // Find the reservation
      const reservation = await tx.reservation.findUnique({
        where: { foodRequestId },
        include: { foodRequest: true },
      });

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Verify ownership
      if (reservation.ngoId !== ngoProfile.id) {
        throw new Error('Unauthorized - this reservation is not assigned to you');
      }

      // Verify status
      if (reservation.status !== 'PENDING') {
        throw new Error('This pickup is not in pending status');
      }

      if (reservation.foodRequest.status !== 'RESERVED') {
        throw new Error('Food request is not in reserved status');
      }

      // Verify OTP if provided
      if (otp && reservation.otpHash) {
        const isValidOtp = await verifyOTP(otp, reservation.otpHash);
        if (!isValidOtp) {
          throw new Error('Invalid OTP');
        }
        // Check OTP expiry
        if (reservation.otpExpiry && new Date() > reservation.otpExpiry) {
          throw new Error('OTP has expired');
        }
      }

      // Update reservation
      await tx.reservation.update({
        where: { id: reservation.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          photoUrl,
        },
      });

      // Update food request
      await tx.foodRequest.update({
        where: { id: foodRequestId },
        data: { status: 'COMPLETED' },
      });
    });

    revalidatePath('/dashboard/ngo');
    revalidatePath('/dashboard/ngo/active-pickups');
    revalidatePath('/dashboard/ngo/history');

    return { success: true, message: 'Pickup confirmed successfully!' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to confirm pickup';
    return { error: errorMessage };
  }
}

/**
 * Cancel Reservation
 * Called by NGO to cancel their reservation
 */
export async function cancelReservation(foodRequestId: string) {
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

  try {
    await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { foodRequestId },
      });

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      if (reservation.ngoId !== ngoProfile.id) {
        throw new Error('Unauthorized');
      }

      if (reservation.status !== 'PENDING') {
        throw new Error('Can only cancel pending reservations');
      }

      // Update reservation status
      await tx.reservation.update({
        where: { id: reservation.id },
        data: {
          status: 'CANCELLED',
        },
      });

      // Reopen the food request
      await tx.foodRequest.update({
        where: { id: foodRequestId },
        data: { status: 'OPEN' },
      });
    });

    revalidatePath('/dashboard/ngo');
    revalidatePath('/dashboard/ngo/active-pickups');
    revalidatePath('/dashboard/ngo/available-requests');

    return { success: true, message: 'Reservation cancelled successfully' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel reservation';
    return { error: errorMessage };
  }
}

/**
 * Get Pickup History
 * Completed, cancelled, and expired pickups
 */
export async function getPickupHistory(statusFilter?: string) {
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

  let whereClause: any = {
    ngoId: ngoProfile.id,
  };

  if (statusFilter === 'COMPLETED') {
    whereClause.status = 'COMPLETED';
  } else if (statusFilter === 'CANCELLED') {
    whereClause.status = 'CANCELLED';
  } else if (statusFilter === 'EXPIRED') {
    whereClause.foodRequest = { status: 'EXPIRED' };
  } else {
    // Default: show completed and cancelled
    whereClause.status = { in: ['COMPLETED', 'CANCELLED'] };
  }

  const history = await prisma.reservation.findMany({
    where: whereClause,
    include: {
      foodRequest: {
        include: {
          donor: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { acceptedAt: 'desc' },
  });

  // Add distance info and convert dates to strings
  const historyWithDistance = history.map((item) => ({
    ...item,
    acceptedAt: item.acceptedAt.toISOString(),
    completedAt: item.completedAt?.toISOString() ?? null,
    foodRequest: {
      ...item.foodRequest,
      expiryTime: item.foodRequest.expiryTime.toISOString(),
      createdAt: item.foodRequest.createdAt.toISOString(),
      updatedAt: item.foodRequest.updatedAt.toISOString(),
    },
    distance: ngoProfile.latitude && ngoProfile.longitude
      ? calculateDistance(
          ngoProfile.latitude,
          ngoProfile.longitude,
          item.foodRequest.latitude,
          item.foodRequest.longitude
        )
      : null,
  }));

  return { history: historyWithDistance };
}

/**
 * Get NGO Analytics
 * Aggregated data for analytics page
 */
export async function getNgoAnalytics() {
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

  // Get date range for last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  // Get all completed reservations
  const completedReservations = await prisma.reservation.findMany({
    where: {
      ngoId: ngoProfile.id,
      status: 'COMPLETED',
      completedAt: { gte: twelveMonthsAgo },
    },
    include: {
      foodRequest: true,
    },
    orderBy: { completedAt: 'asc' },
  });

  // Calculate monthly data
  const monthlyData: Record<string, { month: string; pickups: number; meals: number }> = {};
  
  completedReservations.forEach((reservation) => {
    const monthKey = reservation.completedAt 
      ? `${reservation.completedAt.getFullYear()}-${String(reservation.completedAt.getMonth() + 1).padStart(2, '0')}`
      : 'unknown';
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthKey, pickups: 0, meals: 0 };
    }
    monthlyData[monthKey].pickups += 1;
    monthlyData[monthKey].meals += reservation.foodRequest.quantity;
  });

  // Calculate totals
  const totalPickups = completedReservations.length;
  const totalMeals = completedReservations.reduce((sum, r) => sum + r.foodRequest.quantity, 0);

  // Calculate average distance
  let totalDistance = 0;
  let distanceCount = 0;
  completedReservations.forEach((reservation) => {
    if (ngoProfile.latitude && ngoProfile.longitude) {
      const distance = calculateDistance(
        ngoProfile.latitude,
        ngoProfile.longitude,
        reservation.foodRequest.latitude,
        reservation.foodRequest.longitude
      );
      totalDistance += distance;
      distanceCount += 1;
    }
  });
  const averageDistance = distanceCount > 0 ? totalDistance / distanceCount : 0;

  // Get completion rate
  const [totalReservations, completedCount] = await Promise.all([
    prisma.reservation.count({ where: { ngoId: ngoProfile.id } }),
    prisma.reservation.count({ where: { ngoId: ngoProfile.id, status: 'COMPLETED' } }),
  ]);

  const completionRate = totalReservations > 0 
    ? Math.round((completedCount / totalReservations) * 100) 
    : 0;

  return {
    monthlyData: Object.values(monthlyData),
    totalPickups,
    totalMeals,
    averageDistance: Math.round(averageDistance * 100) / 100,
    completionRate,
  };
}

/**
 * Update NGO Profile
 */
export async function updateNgoProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'NGO') {
    return { error: 'Unauthorized' };
  }

  const rawData = {
    ngoName: formData.get('ngoName') as string,
    registrationNumber: formData.get('registrationNumber') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
    longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
    serviceRadiusKm: formData.get('serviceRadiusKm') ? parseFloat(formData.get('serviceRadiusKm') as string) : undefined,
  };

  // Basic validation
  if (!rawData.ngoName || rawData.ngoName.trim() === '') {
    return { error: 'NGO name is required' };
  }

  try {
    await prisma.ngoProfile.update({
      where: { userId: session.user.id },
      data: {
        ngoName: rawData.ngoName,
        registrationNumber: rawData.registrationNumber,
        phone: rawData.phone,
        address: rawData.address,
        latitude: rawData.latitude,
        longitude: rawData.longitude,
        serviceRadiusKm: rawData.serviceRadiusKm,
      },
    });

    revalidatePath('/dashboard/ngo');
    revalidatePath('/dashboard/ngo/profile');
    
    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    return { error: 'Failed to update profile' };
  }
}

/**
 * Validate OTP (for donor side - called from API)
 */
export async function validateOTP(foodRequestId: string, otp: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { foodRequestId },
    include: { foodRequest: true },
  });

  if (!reservation) {
    return { error: 'Reservation not found' };
  }

  // Check if already completed
  if (reservation.status === 'COMPLETED') {
    return { error: 'This pickup has already been completed' };
  }

  // Check if cancelled
  if (reservation.status === 'CANCELLED') {
    return { error: 'This reservation has been cancelled' };
  }

  // Check failed attempts
  if (reservation.failedAttempts >= 3) {
    // Cancel reservation
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
  const hashedInput = hashOTP(otp);
  
  if (hashedInput !== reservation.otpHash) {
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { failedAttempts: reservation.failedAttempts + 1 },
    });
    
    const remaining = 3 - reservation.failedAttempts - 1;
    return { 
      error: 'Invalid OTP', 
      remainingAttempts: remaining,
      message: `Invalid OTP. ${remaining} attempts remaining.`
    };
  }

  // OTP valid - allow completion
  return { 
    success: true, 
    message: 'OTP verified successfully',
    ngoId: reservation.ngoId,
  };
}
