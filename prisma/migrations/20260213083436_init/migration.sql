-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DONOR', 'NGO', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('COOKED_VEG', 'COOKED_NON_VEG', 'DRY_ITEMS', 'PACKAGED', 'BAKED_GOODS', 'FRUITS_VEGETABLES', 'DAIRY', 'BEVERAGES', 'OTHER');

-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('ROOM_TEMPERATURE', 'REFRIGERATED', 'FROZEN');

-- CreateEnum
CREATE TYPE "FoodRequestStatus" AS ENUM ('OPEN', 'RESERVED', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'DONOR',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NgoProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ngoName" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "serviceRadiusKm" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NgoProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodRequest" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT,
    "isVeg" BOOLEAN NOT NULL,
    "storageType" "StorageType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "expiryTime" TIMESTAMP(3) NOT NULL,
    "status" "FoodRequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "foodRequestId" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "photoUrl" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "DonorProfile_userId_key" ON "DonorProfile"("userId");

-- CreateIndex
CREATE INDEX "DonorProfile_userId_idx" ON "DonorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NgoProfile_userId_key" ON "NgoProfile"("userId");

-- CreateIndex
CREATE INDEX "NgoProfile_userId_idx" ON "NgoProfile"("userId");

-- CreateIndex
CREATE INDEX "NgoProfile_approvalStatus_idx" ON "NgoProfile"("approvalStatus");

-- CreateIndex
CREATE INDEX "FoodRequest_donorId_idx" ON "FoodRequest"("donorId");

-- CreateIndex
CREATE INDEX "FoodRequest_status_idx" ON "FoodRequest"("status");

-- CreateIndex
CREATE INDEX "FoodRequest_expiryTime_idx" ON "FoodRequest"("expiryTime");

-- CreateIndex
CREATE INDEX "FoodRequest_latitude_longitude_idx" ON "FoodRequest"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_foodRequestId_key" ON "Reservation"("foodRequestId");

-- CreateIndex
CREATE INDEX "Reservation_foodRequestId_idx" ON "Reservation"("foodRequestId");

-- CreateIndex
CREATE INDEX "Reservation_ngoId_idx" ON "Reservation"("ngoId");

-- AddForeignKey
ALTER TABLE "DonorProfile" ADD CONSTRAINT "DonorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NgoProfile" ADD CONSTRAINT "NgoProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodRequest" ADD CONSTRAINT "FoodRequest_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "DonorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_foodRequestId_fkey" FOREIGN KEY ("foodRequestId") REFERENCES "FoodRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "NgoProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
