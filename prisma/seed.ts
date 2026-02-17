import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user only
  const adminPassword = await bcrypt.hash('admin@himani123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodsafe.org' },
    update: {},
    create: {
      email: 'admin@foodsafe.org',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
      verified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

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
