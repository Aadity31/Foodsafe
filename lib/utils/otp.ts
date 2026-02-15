import crypto from 'crypto';

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Hash OTP using SHA-256 (for storage)
 */
export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * Verify OTP against stored hash
 */
export function verifyOTP(otp: string, hashedOTP: string): boolean {
  const hashedInput = hashOTP(otp);
  return crypto.timingSafeEqual(
    Buffer.from(hashedInput),
    Buffer.from(hashedOTP)
  );
}

/**
 * Check if OTP attempts exceed limit
 */
export function isOTPLocked(failedAttempts: number, maxAttempts: number = 3): boolean {
  return failedAttempts >= maxAttempts;
}

/**
 * Increment failed attempts and check if locked
 */
export function processFailedAttempt(failedAttempts: number): { locked: boolean; newAttempts: number } {
  const newAttempts = failedAttempts + 1;
  return {
    locked: newAttempts >= 3,
    newAttempts
  };
}
