/**
 * Haversine Formula Implementation
 * Calculates the distance between two geographic points
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate expiry time based on food type and storage conditions
 * @param isVeg Whether the food is vegetarian
 * @param storageType Storage condition
 * @param category Food category
 * @returns Expiry time in hours
 */
export function calculateExpiryWindow(
  isVeg: boolean,
  storageType: 'ROOM_TEMPERATURE' | 'REFRIGERATED' | 'FROZEN',
  category: string
): number {
  // Room temperature rules
  if (storageType === 'ROOM_TEMPERATURE') {
    if (category === 'DRY_ITEMS' || category === 'PACKAGED') {
      return 8; // 8 hours for dry/packaged items
    }
    return isVeg ? 6 : 4; // Veg: 6 hours, Non-veg: 4 hours
  }

  // Refrigerated rules
  if (storageType === 'REFRIGERATED') {
    if (category === 'DRY_ITEMS' || category === 'PACKAGED') {
      return 24; // 24 hours for dry/packaged
    }
    return isVeg ? 12 : 10; // Veg: 12 hours, Non-veg: 10 hours
  }

  // Frozen - longer shelf life, default to 24 hours for safety
  return 24;
}

/**
 * Check if a food request has expired
 */
export function isExpired(expiryTime: Date): boolean {
  return new Date() > new Date(expiryTime);
}

/**
 * Get time remaining until expiry in minutes
 */
export function getTimeRemaining(expiryTime: Date): number {
  const now = new Date();
  const expiry = new Date(expiryTime);
  return Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / 60000));
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
