import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@surpluslink.org' },
    update: {},
    create: {
      email: 'admin@surpluslink.org',
      password: adminPassword,
      name: 'Super Admin',
      role: 'ADMIN',
      verified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample donor
  const donorPassword = await bcrypt.hash('donor123', 12);
  const donor = await prisma.user.upsert({
    where: { email: 'donor@example.com' },
    update: {},
    create: {
      email: 'donor@example.com',
      password: donorPassword,
      name: 'Sample Event Host',
      role: 'DONOR',
      verified: true,
    },
  });

  const donorProfile = await prisma.donorProfile.upsert({
    where: { userId: donor.id },
    update: {},
    create: {
      userId: donor.id,
      organizationName: 'Tech Conference 2024',
      phone: '+1234567890',
      latitude: 28.6139,
      longitude: 77.2090,
    },
  });
  console.log('✅ Donor profile created:', donorProfile.organizationName);

  // Create sample NGO
  const ngoPassword = await bcrypt.hash('ngo123', 12);
  const ngoUser = await prisma.user.upsert({
    where: { email: 'ngo@example.com' },
    update: {},
    create: {
      email: 'ngo@example.com',
      password: ngoPassword,
      name: 'Feeding Hope Foundation',
      role: 'NGO',
      verified: true,
    },
  });

  const ngoProfile = await prisma.ngoProfile.upsert({
    where: { userId: ngoUser.id },
    update: {},
    create: {
      userId: ngoUser.id,
      ngoName: 'Feeding Hope Foundation',
      registrationNumber: 'NGO/2024/12345',
      phone: '+1987654321',
      latitude: 28.6129,
      longitude: 77.2295,
      serviceRadiusKm: 25,
      approvalStatus: 'APPROVED',
      verifiedAt: new Date(),
    },
  });
  console.log('✅ NGO profile created:', ngoProfile.ngoName);

  // Create sample food request
  const expiryTime = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now
  const foodRequest = await prisma.foodRequest.create({
    data: {
      donorId: donorProfile.id,
      category: 'COOKED_VEG',
      quantity: 100,
      description: 'Conference lunch surplus - fresh vegetarian thali',
      isVeg: true,
      storageType: 'ROOM_TEMPERATURE',
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Tech Park Conference Center, Delhi',
      expiryTime,
      status: 'OPEN',
    },
  });
  console.log('✅ Sample food request created:', foodRequest.id);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
