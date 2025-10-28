import { PrismaClient } from '@prisma/client';
import { adminSeeder } from 'db/seeders/admin.seeder';
import { employeeSeeder } from 'db/seeders/employee.seeder';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  adminSeeder(prisma);
  employeeSeeder(prisma);
  
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
