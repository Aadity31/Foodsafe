'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { registerSchema, loginSchema, donorProfileSchema, ngoProfileSchema } from '@/lib/utils/validation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * Register a new user (Donor or NGO)
 */
export async function registerUser(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    role: formData.get('role'),
  };

  const validated = registerSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors.map(e => e.message).join(', ') };
  }

  const { email, password, name, role } = validated.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: 'User with this email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role as 'DONOR' | 'NGO',
    },
  });

  // Create profile based on role
  if (role === 'DONOR') {
    await prisma.donorProfile.create({
      data: { userId: user.id },
    });
  } else {
    await prisma.ngoProfile.create({
      data: { 
        userId: user.id,
        ngoName: name,
        approvalStatus: 'PENDING',
      },
    });
  }

  redirect('/auth/login?registered=true');
}

/**
 * Login user
 */
export async function loginUser(formData: FormData, role?: string) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors.map(e => e.message).join(', ') };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: 'Invalid email or password' };
  }

  if (user.suspended) {
    return { error: 'Your account has been suspended' };
  }

  // Check if role matches (if role parameter provided)
  if (role && user.role !== role) {
    return { error: `This account is not registered as a ${role.toLowerCase()}. Please use the correct login.` };
  }

  // Check verification status
  if (!user.verified) {
    return { verificationPending: true, userId: user.id };
  }

  // Return success - NextAuth will handle session creation
  return { success: true, user: { id: user.id, email: user.email, role: user.role } };
}

/**
 * Update donor profile
 */
export async function updateDonorProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const organizationName = formData.get('organizationName') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const latitudeStr = formData.get('latitude') as string;
  const longitudeStr = formData.get('longitude') as string;
  
  // Convert strings to numbers or undefined
  const latitude = latitudeStr ? parseFloat(latitudeStr) : undefined;
  const longitude = longitudeStr ? parseFloat(longitudeStr) : undefined;
  
  // Validate latitude and longitude if provided
  if (latitude !== undefined && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
    return { error: 'Invalid latitude value' };
  }
  if (longitude !== undefined && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
    return { error: 'Invalid longitude value' };
  }

  const rawData = {
    organizationName: organizationName || undefined,
    phone: phone || undefined,
    address: address || undefined,
    latitude,
    longitude,
  };

  const validated = donorProfileSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors.map(e => e.message).join(', ') };
  }

  // Update user name if provided
  if (name) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });
  }

  await prisma.donorProfile.update({
    where: { userId: session.user.id },
    data: validated.data,
  });

  revalidatePath('/dashboard/donor');
  revalidatePath('/dashboard/donor/profile');
  return { success: true };
}

/**
 * Update NGO profile
 */
export async function updateNgoProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const rawData = {
    ngoName: formData.get('ngoName'),
    registrationNumber: formData.get('registrationNumber'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    serviceRadiusKm: formData.get('serviceRadiusKm'),
  };

  const validated = ngoProfileSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.errors.map(e => e.message).join(', ') };
  }

  await prisma.ngoProfile.update({
    where: { userId: session.user.id },
    data: validated.data,
  });

  revalidatePath('/dashboard/ngo');
  return { success: true };
}
