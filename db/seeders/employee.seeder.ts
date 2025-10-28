import { Employee, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const employeeSeeder = async (prisma: PrismaClient): Promise<void> => {
  const employees: Employee[] = [];

  for (let i = 0; i <= 5; i++) {
    const employee = {
      name: faker.person.fullName(),
      cpf: fakeCpfSimple(),
      arrivalTime: '06:30',
      exitTime: '16:30',
    } as Employee;

    employees.push(employee);
  }

  await prisma.employee.createMany({ data: employees });

  console.log('Employee seeder completed successfully');
};

function fakeCpfSimple(): string {
  let cpf = '';
  for (let i = 0; i < 11; i++) {
    cpf += Math.floor(Math.random() * 10).toString();
  }
  return cpf;
}
