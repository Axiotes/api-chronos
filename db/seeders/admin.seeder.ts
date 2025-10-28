import { Admin, PrismaClient } from '@prisma/client';

export const adminSeeder = async (prisma: PrismaClient): Promise<void> => {
  const admin = {
    name: process.env.ADMIN_NAME,
    cpf: process.env.ADMIN_CPF,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  } as Admin;

  for (const key in admin) {
    if (!key) {
      throw new Error(`Admin ${key} not defined in .env`);
    }
  }

  await prisma.admin.create({ data: admin });

  console.log('Admin seeder completed successfully');
};
