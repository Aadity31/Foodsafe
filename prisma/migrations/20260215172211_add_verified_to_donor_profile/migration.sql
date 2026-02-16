-- AlterTable
ALTER TABLE "DonorProfile" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "otpExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "FoodRequest_status_expiryTime_idx" ON "FoodRequest"("status", "expiryTime");

-- CreateIndex
CREATE INDEX "NgoProfile_latitude_longitude_idx" ON "NgoProfile"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");

-- CreateIndex
CREATE INDEX "Reservation_ngoId_status_idx" ON "Reservation"("ngoId", "status");
