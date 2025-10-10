import { Injectable } from '@nestjs/common';

import { EmployeeDto } from './dtos/employee.dto';

import { Employee, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(employee: EmployeeDto): Promise<Employee> {
    return await this.prisma.employee.create({ data: employee });
  }

  public async findByCpf<T extends Prisma.EmployeeSelect>(
    cpf: string,
    select?: T,
    active = true,
  ): Promise<Prisma.EmployeeGetPayload<{ select: T }> | null> {
    return this.prisma.employee.findUnique({
      where: { cpf, active },
      select,
    });
  }
}
