import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Phone number validation (basic)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number');

/**
 * Location validation
 */
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
});

/**
 * Registration schema for all users
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['DONOR', 'NGO']),
});

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Food request creation schema
 */
export const foodRequestSchema = z.object({
  category: z.enum([
    'COOKED_VEG',
    'COOKED_NON_VEG',
    'DRY_ITEMS',
    'PACKAGED',
    'BAKED_GOODS',
    'FRUITS_VEGETABLES',
    'DAIRY',
    'BEVERAGES',
    'OTHER',
  ]),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10000, 'Quantity too high'),
  description: z.string().max(500, 'Description too long').optional(),
  isVeg: z.boolean(),
  storageType: z.enum(['ROOM_TEMPERATURE', 'REFRIGERATED', 'FROZEN']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(255).optional(),
});

/**
 * NGO profile schema
 */
export const ngoProfileSchema = z.object({
  ngoName: z.string().min(2, 'NGO name must be at least 2 characters'),
  registrationNumber: z.string().optional(),
  phone: phoneSchema,
  address: z.string().max(255).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  serviceRadiusKm: z.number().min(1).max(100).optional(),
});

/**
 * Donor profile schema
 */
export const donorProfileSchema = z.object({
  organizationName: z.string().optional().nullable(),
  phone: phoneSchema.optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
});

/**
 * OTP verification schema
 */
export const otpVerificationSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

/**
 * OTP entry schema for pickup
 */
export const pickupOtpSchema = z.object({
  foodRequestId: z.string(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

/**
 * Export type inference helpers
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FoodRequestInput = z.infer<typeof foodRequestSchema>;
export type NgoProfileInput = z.infer<typeof ngoProfileSchema>;
export type DonorProfileInput = z.infer<typeof donorProfileSchema>;
