import { PrismaClient } from '@prisma/client';
import { adminSeeder } from 'db/seeders/admin.seeder';
import { employeeSeeder } from 'db/seeders/employee.seeder';
import { timeRecordsSeeder } from 'db/seeders/time-records.seeder';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  adminSeeder(prisma);
  employeeSeeder(prisma);
  timeRecordsSeeder(prisma); // Seeder de employee deve ser executado antes ou já ter employee cadastrados
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
